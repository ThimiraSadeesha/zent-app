import React, { useState } from "react";
import { Play, Square, RotateCw } from "lucide-react";

interface DockerContainerProps {
    id: string;
    name: string;
    image: string;
    status: string;
    state: string;
    onAction: (action: "start" | "stop" | "restart", id: string) => Promise<void>;
}

const DockerContainerCard: React.FC<DockerContainerProps> = ({ id, name, image, status, state, onAction }) => {
    const [loading, setLoading] = useState(false);
    const isRunning = state === "running";

    const handleAction = async (action: "start" | "stop" | "restart") => {
        if (loading) return;
        setLoading(true);
        try {
            await onAction(action, id);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm group hover:border-neutral-700 transition">
            <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${isRunning ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
                <div>
                    <h3 className="text-neutral-200 font-medium">{name}</h3>
                    <p className="text-neutral-500 text-xs">{image} • {status}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isRunning && (
                    <button
                        onClick={() => handleAction("start")}
                        disabled={loading}
                        className="p-2 rounded-md bg-green-500/10 text-green-500 hover:bg-green-500/20 transition disabled:opacity-50"
                        title="Start"
                    >
                        <Play size={16} />
                    </button>
                )}
                {isRunning && (
                    <button
                        onClick={() => handleAction("stop")}
                        disabled={loading}
                        className="p-2 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition disabled:opacity-50"
                        title="Stop"
                    >
                        <Square size={16} />
                    </button>
                )}
                <button
                    onClick={() => handleAction("restart")}
                    disabled={loading}
                    className="p-2 rounded-md bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition disabled:opacity-50"
                    title="Restart"
                >
                    <RotateCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
            </div>
        </div>
    );
};

export default DockerContainerCard;
