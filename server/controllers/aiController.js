const OpenAI = require('openai');
const Resume = require('../models/Resume');

const getOpenAI = () => {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        return null;
    }
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

// Fallback mock questions when no API key
const getMockQuestions = (mode, difficulty) => {
    const questions = {
        DSA: {
            easy: ['What is a linked list?', 'Explain Big O notation.', 'What is a stack vs queue?', 'How does binary search work?', 'What is recursion?'],
            medium: ['Implement a binary tree traversal.', 'Explain dynamic programming.', 'How would you detect a cycle in a linked list?', 'What is a hash table?', 'Explain merge sort.'],
            hard: ['Solve the knapsack problem.', 'Explain Dijkstra\'s algorithm.', 'What is the traveling salesman problem?', 'Implement LRU Cache.', 'Explain Red-Black trees.'],
        },
        HR: {
            easy: ['Tell me about yourself.', 'Why do you want this job?', 'What are your strengths?', 'Where do you see yourself in 5 years?', 'Why did you leave your last job?'],
            medium: ['Describe a challenging project you worked on.', 'How do you handle conflict at work?', 'Tell me about leadership experience.', 'Describe a time you failed.', 'How do you prioritize tasks?'],
            hard: ['Describe your biggest professional achievement.', 'How do you handle high-pressure situations?', 'Tell about a time you influenced without authority.', 'Describe navigating ambiguity.', 'How do you manage work-life balance?'],
        },
        Technical: {
            easy: ['What is REST API?', 'Explain MVC architecture.', 'What is version control?', 'What is an API endpoint?', 'Explain HTTP methods.'],
            medium: ['Explain microservices vs monolith.', 'What is JWT and how does it work?', 'Explain database indexing.', 'What is Docker?', 'Explain CI/CD pipelines.'],
            hard: ['Design a URL shortener system.', 'Explain CAP theorem.', 'Design a real-time chat system.', 'How would you handle 1M concurrent users?', 'Explain distributed transactions.'],
        },
        Custom: {
            easy: ['Introduce yourself and your background.', 'What technologies do you use daily?', 'Describe your development workflow.', 'What is your strongest skill?', 'What projects have you built?'],
            medium: ['Walk through your most complex project.', 'How do you ensure code quality?', 'How do you learn new technologies?', 'Describe your problem-solving process.', 'How do you debug difficult issues?'],
            hard: ['How would you architect a scalable system?', 'Describe your approach to system design.', 'How do you handle technical debt?', 'Explain a hard technical decision you made.', 'How do you mentor junior developers?'],
        },
    };
    return questions[mode] || questions['Technical'];
};

// Generate questions using OpenAI or fallback
const generateQuestions = async (req, res) => {
    const { mode, difficulty = 'mixed', count = 10, resumeId } = req.body;
    const openai = getOpenAI();

    let questions = [];

    if (openai && resumeId) {
        try {
            const resume = await Resume.findById(resumeId);
            const resumeText = resume ? resume.extractedText.substring(0, 2000) : '';
            const prompt = `You are an expert technical interviewer. Based on the following resume, generate ${count} interview questions for a ${mode} interview${difficulty !== 'mixed' ? ` at ${difficulty} difficulty` : ''}.
      
Resume excerpt:
${resumeText}

Generate exactly ${count} questions in JSON array format like:
[{"text": "question here", "difficulty": "easy|medium|hard", "category": "${mode}"}]

Focus on the candidate's specific skills and experience. Make questions progressive.`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1500,
                temperature: 0.7,
            });

            const content = completion.choices[0].message.content;
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) questions = JSON.parse(jsonMatch[0]);
        } catch (err) {
            console.log('OpenAI error, using fallback:', err.message);
        }
    }

    // Fallback to mock questions
    if (questions.length === 0) {
        const mockByMode = getMockQuestions(mode, difficulty);
        const allMock = [...mockByMode.easy, ...mockByMode.medium, ...mockByMode.hard];
        questions = allMock.slice(0, count).map((text, i) => ({
            text,
            difficulty: i < Math.floor(count / 3) ? 'easy' : i < Math.floor(2 * count / 3) ? 'medium' : 'hard',
            category: mode,
        }));
    }

    // Save to resume if resumeId provided
    if (resumeId) {
        await Resume.findByIdAndUpdate(resumeId, { questions });
    }

    res.json({ questions });
};

// Evaluate answer using OpenAI or simple scoring
const evaluateAnswer = async (req, res) => {
    const { question, answer, category, difficulty } = req.body;
    const openai = getOpenAI();

    if (!answer || answer.trim().length < 5) {
        return res.json({
            score: 0, maxScore: 10,
            strengths: [], weaknesses: ['No answer provided'],
            correctExplanation: 'Please provide a detailed answer.',
            confidenceScore: 0, communicationScore: 0,
            professionalToneFeedback: 'No answer was given.',
        });
    }

    if (openai) {
        try {
            const prompt = `You are an expert interviewer evaluating a candidate's answer.

Question: ${question}
Category: ${category}
Difficulty: ${difficulty}
Candidate's Answer: ${answer}

Evaluate this answer and respond ONLY with a valid JSON object in this exact format:
{
  "score": <number 0-10>,
  "maxScore": 10,
  "strengths": ["<strength1>", "<strength2>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "correctExplanation": "<ideal answer explanation>",
  "confidenceScore": <number 0-10>,
  "communicationScore": <number 0-10>,
  "professionalToneFeedback": "<feedback on tone and communication style>"
}`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 800,
                temperature: 0.3,
            });

            const content = completion.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const evaluation = JSON.parse(jsonMatch[0]);
                return res.json(evaluation);
            }
        } catch (err) {
            console.log('OpenAI eval error, using heuristic:', err.message);
        }
    }

    // Heuristic fallback evaluation
    const words = answer.trim().split(' ').length;
    const score = Math.min(10, Math.max(1, Math.floor(words / 10)));
    const confidenceScore = Math.min(10, Math.floor(words / 8));
    const communicationScore = answer.includes('.') ? Math.min(10, score + 1) : score;

    res.json({
        score,
        maxScore: 10,
        strengths: words > 30 ? ['Detailed answer provided', 'Good elaboration'] : ['Answer attempted'],
        weaknesses: words < 20 ? ['Answer could be more detailed', 'Add specific examples'] : ['Could improve technical depth'],
        correctExplanation: `A strong answer to "${question}" would include specific examples, technical depth, and clear communication.`,
        confidenceScore,
        communicationScore,
        professionalToneFeedback: words > 50 ? 'Good professional communication style.' : 'Try to provide more comprehensive answers with examples.',
    });
};

// Generate improvement plan
const generateImprovementPlan = async (req, res) => {
    const { weaknesses, mode, score } = req.body;
    const openai = getOpenAI();

    let plan = '';

    if (openai && weaknesses && weaknesses.length > 0) {
        try {
            const prompt = `Create a 7-day improvement plan for an interview candidate who scored ${score}/10 in a ${mode} interview.
Their main weaknesses are: ${weaknesses.join(', ')}.

Respond with a JSON object:
{
  "weeklyPlan": [
    {"day": 1, "focus": "topic", "exercises": ["ex1", "ex2"], "resources": ["resource1"]}
  ],
  "exercises": ["exercise1", "exercise2", "exercise3"],
  "resources": ["resource1", "resource2"],
  "summary": "personalized summary"
}`;

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000,
                temperature: 0.5,
            });

            const content = completion.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) plan = JSON.parse(jsonMatch[0]);
        } catch (err) {
            console.log('OpenAI plan error:', err.message);
        }
    }

    if (!plan) {
        plan = {
            weeklyPlan: [
                { day: 1, focus: 'Fundamentals Review', exercises: ['Review core concepts', 'Practice 3 basic problems'], resources: ['MDN Web Docs'] },
                { day: 2, focus: 'Practice Problems', exercises: ['Solve 5 LeetCode problems', 'Review solutions'], resources: ['LeetCode', 'HackerRank'] },
                { day: 3, focus: 'System Design', exercises: ['Design a simple system', 'Review architecture patterns'], resources: ['System Design Primer'] },
                { day: 4, focus: 'Mock Interviews', exercises: ['Complete 2 mock interviews', 'Record yourself answering'], resources: ['Pramp', 'InterviewBit'] },
                { day: 5, focus: 'Communication Skills', exercises: ['Practice STAR method', 'Behavioral question bank'], resources: ['YouTube: Interview Tips'] },
                { day: 6, focus: 'Technical Deep Dive', exercises: ['Study weak areas', 'Build a mini-project'], resources: ['Coursera', 'Udemy'] },
                { day: 7, focus: 'Final Review', exercises: ['Complete practice interview', 'Review all notes'], resources: ['Glassdoor', 'LinkedIn Learning'] },
            ],
            exercises: ['Daily LeetCode practice (30 min)', 'Record and review mock answers', 'Build portfolio projects'],
            resources: ['LeetCode', 'System Design Primer', 'STAR Method Guide'],
            summary: `Focus on improving ${weaknesses.slice(0, 2).join(' and ')} over the next 7 days with structured daily practice.`,
        };
    }

    res.json(plan);
};

module.exports = { generateQuestions, evaluateAnswer, generateImprovementPlan };
