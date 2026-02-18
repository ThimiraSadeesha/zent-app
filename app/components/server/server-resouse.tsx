import React, { useId } from 'react';

interface SystemResourceCardProps {
    title: string;
    usage: number;
    used?: string;
    total?: string;
}

const SystemResourceCard: React.FC<SystemResourceCardProps> = ({ title, usage, used, total }) => {
    const id = useId();

    const getColorClass = () => {
        if (usage >= 80) return "text-red-500 shadow-red-500/50";
        if (usage >= 60) return "text-yellow-500 shadow-yellow-500/50";
        return "text-cyan-400 shadow-cyan-400/50";
    };

    const getStrokeColor = () => {
        if (usage >= 80) return "#ef4444"; // red-500
        if (usage >= 60) return "#eab308"; // yellow-500
        return "#22d3ee"; // cyan-400
    };

    // SVG circle calculations
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (usage / 100) * circumference;

    return (
        <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-sm shadow-lg group hover:border-neutral-700 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex flex-col items-center relative z-10">
                <div className="w-full flex justify-between items-center mb-4">
                    <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
                    {used && total && (
                        <span className="text-neutral-500 text-xs font-mono">{used} / {total}</span>
                    )}
                </div>

                {/* Circular Progress Chart */}
                <div className="relative">
                    {/* Glow effect behind */}
                    <div className={`absolute inset-0 rounded-full blur-[20px] opacity-20 ${usage >= 80 ? "bg-red-500" : usage >= 60 ? "bg-yellow-500" : "bg-cyan-500"}`} />

                    <svg width="160" height="160" className="transform -rotate-90 drop-shadow-lg">
                        <defs>
                            <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={getStrokeColor()} stopOpacity="0.5" />
                                <stop offset="100%" stopColor={getStrokeColor()} stopOpacity="1" />
                            </linearGradient>
                        </defs>

                        {/* Background Circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke="#262626"
                            strokeWidth="8"
                            fill="none"
                            className="opacity-50"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke={`url(#gradient-${id})`}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>

                    {/* Percentage in Center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${getColorClass()} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                            {usage.toFixed(0)}%
                        </span>
                    </div>
                </div>

                {/* Mini bar at bottom for extra visual hint */}
                <div className="w-full h-1 bg-neutral-800 rounded-full mt-6 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${usage >= 80 ? "bg-red-500" : usage >= 60 ? "bg-yellow-500" : "bg-cyan-400"}`}
                        style={{ width: `${usage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SystemResourceCard;
