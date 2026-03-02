import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const particles = [];
        const count = 18;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 6 + 3;
            p.className = 'particle';
            p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 10}s;
        opacity: ${Math.random() * 0.06 + 0.02};
      `;
            container.appendChild(p);
            particles.push(p);
        }

        return () => particles.forEach(p => p.remove());
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {/* Floating gradient blobs */}
            {/* <div className="blob w-96 h-96 bg-pink-300" style={{ top: '5%', left: '10%', animationDelay: '0s' }} />
            <div className="blob w-80 h-80 bg-red-300" style={{ top: '50%', right: '5%', animationDelay: '3s' }} />
            <div className="blob w-72 h-72 bg-pink-400" style={{ bottom: '10%', left: '40%', animationDelay: '6s' }} /> */}
        </div>
    );
}
