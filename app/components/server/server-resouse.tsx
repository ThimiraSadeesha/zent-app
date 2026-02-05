interface SystemResourceCardProps {
    title: string;
    usage: number;
    used?: string;
    total?: string;
}

const SystemResourceCard: React.FC<SystemResourceCardProps> = ({ title, usage, used, total }) => {
    const getColor = () => {
        if (usage >= 80) return "text-red-500";
        if (usage >= 60) return "text-yellow-500";
        return "text-teal-500";
    };

    const getStrokeColor = () => {
        if (usage >= 80) return "#ef4444"; // red-500
        if (usage >= 60) return "#eab308"; // yellow-500
        return "#14b8a6"; // teal-500
    };

    // SVG circle calculations
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (usage / 100) * circumference;

    return (
        <div className="p-6 rounded-lg bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
            <div className="flex flex-col items-center">
                {/* Circular Progress Chart */}
                <div className="relative mb-4">
                    <svg width="160" height="160" className="transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke="#374151"
                            strokeWidth="10"
                            fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke={getStrokeColor()}
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                        />
                    </svg>
                    {/* Percentage in Center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-4xl font-bold ${getColor()}`}>
                            {usage.toFixed(1)}%
                        </span>
                    </div>
                </div>

                {/* Title and Values */}
                <h3 className="text-neutral-400 text-sm font-medium mb-1">{title}</h3>
                {used && total && (
                    <p className="text-neutral-500 text-xs">
                        {used} / {total}
                    </p>
                )}

                {/* Progress Bar (secondary visual) */}
                <div className="w-full bg-neutral-800 rounded-full h-2 mt-3">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${usage >= 80 ? "bg-red-500" : usage >= 60 ? "bg-yellow-500" : "bg-teal-500"
                            }`}
                        style={{ width: `${usage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default SystemResourceCard;
