import React from 'react';

interface SystemResourceCardProps {
    title: string;
    usage: number;
    used?: string;
    total?: string;
}

const SystemResourceCard: React.FC<SystemResourceCardProps> = ({ title, usage, used, total }) => {

    const getStrokeColor = () => {
        if (usage >= 75) return "#ef4444"; // red-500
        if (usage >= 45) return "#eab308"; // yellow-500
        return "#22c55e"; // green-500
    };

    const getBarClass = () => {
        if (usage >= 75) return "bg-red-500";
        if (usage >= 45) return "bg-yellow-500";
        return "bg-green-500";
    };

    // SVG circle calculations — bigger chart
    const radius = 85;
    const svgSize = 200;
    const center = svgSize / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (usage / 100) * circumference;

    return (
        <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-4">
                    <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
                    {used && total && (
                        <span className="text-neutral-500 text-xs font-mono">{used} / {total}</span>
                    )}
                </div>

                {/* Circular Progress Chart */}
                <div className="relative">
                    <svg width={svgSize} height={svgSize} className="transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            stroke="#262626"
                            strokeWidth="14"
                            fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            stroke={getStrokeColor()}
                            strokeWidth="14"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-500 ease-out"
                        />
                    </svg>

                    {/* Percentage in Center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-neutral-200">
                            {usage.toFixed(0)}%
                        </span>
                    </div>
                </div>

                {/* Mini bar at bottom for extra visual hint */}
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-6 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${getBarClass()}`}
                        style={{ width: `${usage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SystemResourceCard;
