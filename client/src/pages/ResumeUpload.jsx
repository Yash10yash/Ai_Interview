import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, FileText, CheckCircle, X, Brain, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeUpload() {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped?.type === 'application/pdf') setFile(dropped);
        else toast.error('Please upload a PDF file');
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('resume', file);
        try {
            const { data } = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(data);
            toast.success('Resume uploaded and analyzed!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 relative z-10">
            <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4">
                            <FileText size={24} color="white" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Upload Your <span className="gradient-text">Resume</span></h1>
                        <p className="text-gray-500">AI will extract your skills and generate personalized interview questions.</p>
                    </div>

                    <div className="glass-card pink-shadow rounded-3xl p-8">
                        {!result ? (
                            <>
                                {/* Drop Zone */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('fileInput').click()}
                                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                    ${dragging ? 'border-pink-400 bg-pink-50 scale-[1.02]' : file ? 'border-pink-300 bg-pink-50' : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'}`}>
                                    <input id="fileInput" type="file" accept=".pdf" className="hidden"
                                        onChange={e => e.target.files[0] && setFile(e.target.files[0])} />
                                    <AnimatePresence mode="wait">
                                        {file ? (
                                            <motion.div key="file" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                                                <CheckCircle size={40} className="mx-auto mb-3 text-pink-500" />
                                                <p className="font-semibold text-gray-800">{file.name}</p>
                                                <p className="text-sm text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                                <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                    className="mt-3 text-red-400 text-xs hover:text-red-600 flex items-center gap-1 mx-auto">
                                                    <X size={12} /> Remove
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="drop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <Upload size={40} className="mx-auto mb-3 text-pink-400" />
                                                <p className="font-semibold text-gray-700">Drop your PDF here</p>
                                                <p className="text-sm text-gray-400 mt-1">or click to browse files</p>
                                                <p className="text-xs text-gray-300 mt-2">Max 5MB · PDF only</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button onClick={handleUpload} disabled={!file || uploading}
                                    className="btn-gradient w-full mt-6 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                                    {uploading ? (
                                        <>
                                            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 1s linear infinite' }} />
                                            Analyzing with AI...
                                        </>
                                    ) : (<><Brain size={18} /> Analyze Resume</>)}
                                </button>
                            </>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="text-center mb-6">
                                    <CheckCircle size={48} className="mx-auto mb-3 text-pink-500" />
                                    <h2 className="text-xl font-black text-gray-900">Resume Analyzed!</h2>
                                    <p className="text-gray-500 text-sm mt-1">{result.textLength} characters extracted</p>
                                </div>
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <Zap size={14} className="text-pink-500" /> Detected Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.skills?.length > 0 ? result.skills.map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-pink-50 border border-pink-200 rounded-full text-xs font-medium text-pink-600 capitalize">{skill}</span>
                                        )) : <span className="text-gray-400 text-sm">No specific skills detected — generic questions will be used.</span>}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => navigate('/interview/setup', { state: { resumeId: result.resumeId } })}
                                        className="btn-gradient flex-1 py-3 rounded-2xl text-white font-bold flex items-center justify-center gap-2">
                                        <Brain size={16} /> Start Interview
                                    </button>
                                    <button onClick={() => { setResult(null); setFile(null); }}
                                        className="px-5 py-3 rounded-2xl border border-pink-100 text-gray-600 font-medium hover:bg-pink-50 transition-colors">
                                        Re-upload
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
