"use client";

import DockerContainerCard from "@/app/components/docker/docker-container";
import { BackgroundBeams } from "@/app/components/background/background-beams";
import SystemResourceCard from "@/app/components/server/server-resouse";
import { useEffect, useState } from "react";

import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

interface SystemStats {
    cpu: { usage: number };
    memory: { total: number; used: number; usage: number };
    disk: { total: string; used: string; percent: string };
    uptime: string;
    user: string;
}

interface Container {
    ID: string;
    Names: string;
    Image: string;
    State: string;
    Status: string;
}

const Dashboard = () => {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [containers, setContainers] = useState<Container[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllContainers, setShowAllContainers] = useState(false);
    const [isDockerVisible, setIsDockerVisible] = useState(false);

    const fetchData = async () => {
        try {
            const [statsRes, conts] = await Promise.all([
                fetch("/api/server/stats").then((res) => res.json()),
                fetch("/api/docker/containers").then((res) => res.json()),
            ]);

            setStats(statsRes);
            setContainers(Array.isArray(conts) ? conts : []);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        await fetch("/api/server/logout");
        window.location.href = "/";
    };

    const handleContainerAction = async (action: "start" | "stop" | "restart", id: string) => {
        try {
            await fetch("/api/docker/containers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, containerId: id }),
            });
            setTimeout(fetchData, 1000);
        } catch (error) {
            console.error(`Failed to ${action} container`, error);
        }
    };

    const runningContainers = containers.filter(c => c.State === "running");
    const otherContainers = containers.filter(c => c.State !== "running");

    return (
        <div className="min-h-screen w-full relative overflow-x-hidden antialiased text-neutral-200 font-sans">
            <div className="fixed inset-0 bg-neutral-950 z-0" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950 to-neutral-950 z-0" />
            <BackgroundBeams />

            <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
                    <button onClick={fetchData} className="p-2.5 backdrop-blur-md bg-neutral-900/60 hover:bg-neutral-800/80 rounded-xl border border-neutral-800/50 transition-all hover:scale-105 active:scale-95">
                        <RefreshCw size={18} className={loading ? "animate-spin text-neutral-400" : "text-neutral-400"} />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2.5 rounded-xl backdrop-blur-md bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all hover:scale-105 active:scale-95 text-sm font-medium"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 backdrop-blur-sm shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <p className="text-neutral-500 text-sm font-medium relative z-10">Server Info</p>
                        <div className="mt-4 space-y-3 relative z-10">
                            <div className="flex justify-between items-center bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/50">
                                <span className="text-neutral-400 text-xs uppercase tracking-wider">User</span>
                                <span className="text-indigo-400 font-mono text-sm font-bold shadow-indigo-500/20 drop-shadow-sm">{stats?.user || "—"}</span>
                            </div>
                            <div className="flex justify-between items-center bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/50">
                                <span className="text-neutral-400 text-xs uppercase tracking-wider">Uptime</span>
                                <span className="text-purple-400 font-mono text-xs font-bold shadow-purple-500/20 drop-shadow-sm">
                                    {stats?.uptime
                                        ? stats.uptime.split(",").slice(0, 2).join(",")
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <SystemResourceCard title="CPU Usage" usage={Math.round(stats?.cpu?.usage || 0)} />
                    <SystemResourceCard title="Memory Usage" usage={Math.round(stats?.memory?.usage || 0)} />
                    <SystemResourceCard title="Disk Usage" usage={stats?.disk ? parseInt(stats.disk.percent) : 0} />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsDockerVisible(!isDockerVisible)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900/50 border border-neutral-800/50 hover:bg-neutral-800/50 hover:border-neutral-700 transition-all text-sm text-neutral-400 hover:text-neutral-200"
                        >
                            {isDockerVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {isDockerVisible ? "Hide Docker Containers" : "Manage Docker Containers"}
                        </button>
                    </div>

                    {isDockerVisible && (
                        <div className="rounded-3xl bg-neutral-900/40 border border-neutral-800/50 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="p-6 border-b border-neutral-800/50 flex justify-between items-center bg-neutral-900/50">
                                <h2 className="text-xl font-semibold text-neutral-200 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                    Docker Containers
                                </h2>
                                <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs font-medium border border-neutral-700">
                                    {containers.length} Total
                                </span>
                            </div>

                            <div className="p-6 space-y-4">
                                {runningContainers.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1 opacity-70">Running</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {runningContainers.map((container) => (
                                                <DockerContainerCard
                                                    key={container.ID}
                                                    id={container.ID}
                                                    name={container.Names}
                                                    image={container.Image}
                                                    status={container.Status}
                                                    state={container.State}
                                                    onAction={handleContainerAction}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {otherContainers.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 my-2">
                                            <div className="h-px flex-1 bg-neutral-800/50" />
                                            <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">Stopped</span>
                                            <div className="h-px flex-1 bg-neutral-800/50" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {otherContainers.map((container) => (
                                                <DockerContainerCard
                                                    key={container.ID}
                                                    id={container.ID}
                                                    name={container.Names}
                                                    image={container.Image}
                                                    status={container.Status}
                                                    state={container.State}
                                                    onAction={handleContainerAction}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {containers.length === 0 && !loading && (
                                    <div className="text-center py-12 text-neutral-500">
                                        No containers found.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;