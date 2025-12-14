
import React from 'react';

const Loader = ({ className = "h-64" }: { className?: string }) => {
  return (
    <div className={`main-container ${className}`}>
      <style>{`
        .loader {
          width: 100%;
          height: 100%;
          max-width: 300px;
          max-height: 300px;
        }

        .trace-bg {
          stroke: #334155;
          stroke-width: 2;
          fill: none;
          opacity: 0.3;
        }
        .dark .trace-bg {
          stroke: #475569;
        }

        .trace-flow {
          stroke-width: 2;
          fill: none;
          stroke-dasharray: 20 100;
          stroke-dashoffset: 120;
          stroke-linecap: round;
          animation: flow 2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }

        .yellow { stroke: #fbbf24; color: #fbbf24; }
        .blue { stroke: #3b82f6; color: #3b82f6; }
        .green { stroke: #22c55e; color: #22c55e; }
        .purple { stroke: #a855f7; color: #a855f7; }
        .red { stroke: #ef4444; color: #ef4444; }

        @keyframes flow {
          0% { stroke-dashoffset: 120; }
          100% { stroke-dashoffset: 0; }
        }

        .chip-body {
          fill: #1e293b;
          stroke: #475569;
          stroke-width: 1;
        }
        .dark .chip-body {
          fill: #0f172a;
          stroke: #334155;
        }

        .chip-text {
          fill: #94a3b8;
          font-family: monospace;
          font-weight: bold;
          font-size: 8px;
          text-anchor: middle;
          dominant-baseline: middle;
        }
      `}</style>

      <svg className="loader" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Central Chip */}
        <rect className="chip-body" x="35" y="35" width="30" height="30" rx="4" />
        <text className="chip-text" x="50" y="50">UDX3</text>

        {/* Trace Paths Definitions */}
        <defs>
           <path id="trace-1" d="M 50 35 L 50 10" />
           <path id="trace-2" d="M 65 35 L 65 20 L 80 20 L 80 10" />
           <path id="trace-3" d="M 65 65 L 65 80 L 80 80 L 80 90" />
           <path id="trace-4" d="M 50 65 L 50 90" />
           <path id="trace-5" d="M 35 65 L 35 80 L 20 80 L 20 90" />
           <path id="trace-6" d="M 35 35 L 35 20 L 20 20 L 20 10" />
           <path id="trace-7" d="M 35 50 L 10 50" />
           <path id="trace-8" d="M 65 50 L 90 50" />
        </defs>

        {/* Background Traces */}
        <use href="#trace-1" className="trace-bg" />
        <use href="#trace-2" className="trace-bg" />
        <use href="#trace-3" className="trace-bg" />
        <use href="#trace-4" className="trace-bg" />
        <use href="#trace-5" className="trace-bg" />
        <use href="#trace-6" className="trace-bg" />
        <use href="#trace-7" className="trace-bg" />
        <use href="#trace-8" className="trace-bg" />

        {/* Animated Flow Traces */}
        <use href="#trace-1" className="trace-flow blue" style={{animationDelay: '0s'}} />
        <use href="#trace-2" className="trace-flow purple" style={{animationDelay: '0.2s'}} />
        <use href="#trace-3" className="trace-flow red" style={{animationDelay: '0.4s'}} />
        <use href="#trace-4" className="trace-flow yellow" style={{animationDelay: '0.6s'}} />
        <use href="#trace-5" className="trace-flow green" style={{animationDelay: '0.8s'}} />
        <use href="#trace-6" className="trace-flow blue" style={{animationDelay: '1.0s'}} />
        <use href="#trace-7" className="trace-flow purple" style={{animationDelay: '1.2s'}} />
        <use href="#trace-8" className="trace-flow red" style={{animationDelay: '1.4s'}} />

        {/* Chip Pins */}
        <circle cx="40" cy="35" r="1" fill="#64748b" />
        <circle cx="50" cy="35" r="1" fill="#64748b" />
        <circle cx="60" cy="35" r="1" fill="#64748b" />
        
        <circle cx="40" cy="65" r="1" fill="#64748b" />
        <circle cx="50" cy="65" r="1" fill="#64748b" />
        <circle cx="60" cy="65" r="1" fill="#64748b" />

        <circle cx="35" cy="40" r="1" fill="#64748b" />
        <circle cx="35" cy="50" r="1" fill="#64748b" />
        <circle cx="35" cy="60" r="1" fill="#64748b" />

        <circle cx="65" cy="40" r="1" fill="#64748b" />
        <circle cx="65" cy="50" r="1" fill="#64748b" />
        <circle cx="65" cy="60" r="1" fill="#64748b" />
      </svg>
    </div>
  );
};

export default Loader;
