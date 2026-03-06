"use client";

import DockerContainerCard from "@/app/components/docker/docker-container";
import { BackgroundBeams } from "@/app/components/background/background-beams";
import SystemResourceCard from "@/app/components/server/server-resouse";
import { useEffect, useState } from "react";

import { ChevronDown, ChevronUp, RefreshCw, FileText, X } from "lucide-react";

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
    
    // Log Viewer State
    const [selectedLogContainerId, setSelectedLogContainerId] = useState<string | null>(null);
    const [logData, setLogData] = useState<string>("");
    const [logLoading, setLogLoading] = useState(false);
    const [autoRefreshLogs, setAutoRefreshLogs] = useState(false);

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

    const fetchLogs = async (containerId: string) => {
        if (!containerId) return;
        setLogLoading(true);
        try {
            const res = await fetch(`/api/docker/containers/logs?containerId=${containerId}`);
            const data = await res.json();
            if (data.logs !== undefined) {
                setLogData(data.logs);
            } else {
                setLogData("Failed to load logs or container has no logs.");
            }
        } catch (error) {
            console.error("Failed to fetch logs", error);
            setLogData("Error fetching logs.");
        } finally {
            setLogLoading(false);
        }
    };

    useEffect(() => {
        let logInterval: NodeJS.Timeout;
        if (autoRefreshLogs && selectedLogContainerId) {
            logInterval = setInterval(() => {
                fetchLogs(selectedLogContainerId);
            }, 3000);
        }
        return () => clearInterval(logInterval);
    }, [autoRefreshLogs, selectedLogContainerId]);

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

    const handleViewLogs = (id: string, name: string) => {
        setLogData("");
        setSelectedLogContainerId(id);
        fetchLogs(id);
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
                                                    onViewLogs={handleViewLogs}
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

            {/* Log Viewer Modal */}
            {selectedLogContainerId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/50 gap-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-semibold text-neutral-200 flex items-center gap-2 whitespace-nowrap">
                                    <FileText size={18} className="text-blue-400" />
                                    Container Logs
                                </h3>
                                
                                <select 
                                    className="bg-neutral-800 border border-neutral-700 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 text-neutral-300 w-full md:w-auto"
                                    value={selectedLogContainerId}
                                    onChange={(e) => {
                                        setLogData("");
                                        setSelectedLogContainerId(e.target.value);
                                        fetchLogs(e.target.value);
                                    }}
                                >
                                    {runningContainers.map(c => (
                                        <option key={c.ID} value={c.ID}>{c.Names}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-3 self-end md:self-auto">
                                <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer hover:text-neutral-200 transition">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-neutral-700 bg-neutral-900 text-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-neutral-900"
                                        checked={autoRefreshLogs}
                                        onChange={(e) => setAutoRefreshLogs(e.target.checked)}
                                    />
                                    Auto-refresh (3s)
                                </label>
                                
                                <button 
                                    onClick={() => fetchLogs(selectedLogContainerId)}
                                    className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition"
                                    title="Refresh logs"
                                >
                                    <RefreshCw size={16} className={logLoading ? "animate-spin text-blue-400" : ""} />
                                </button>

                                <div className="w-px h-6 bg-neutral-800 mx-1"></div>

                                <button 
                                    onClick={() => {
                                        setSelectedLogContainerId(null);
                                        setAutoRefreshLogs(false);
                                    }}
                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                    title="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-[#0c0c0c] overflow-y-auto p-4 font-mono text-xs md:text-sm leading-relaxed text-neutral-300 whitespace-pre-wrap break-all relative">
                            {logLoading && !logData && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#0c0c0c]/80 backdrop-blur-sm z-10">
                                    <div className="flex flex-col items-center gap-3">
                                        <RefreshCw size={24} className="animate-spin text-blue-500" />
                                        <span className="text-neutral-400">Fetching logs...</span>
                                    </div>
                                </div>
                            )}
                            {logData || "No logs available."}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;