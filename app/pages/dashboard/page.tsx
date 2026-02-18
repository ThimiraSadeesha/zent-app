"use client";

import DockerContainerCard from "@/app/components/docker/docker-container";
import { BackgroundBeams } from "@/app/components/background/background-beams";
import SystemResourceCard from "@/app/components/server/server-resouse";
import { useEffect, useState } from "react";
import { dockerService } from "@/lib/services/docker.service";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [containers, setContainers] = useState<Container[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAllContainers, setShowAllContainers] = useState(false);

    const fetchData = async () => {

    };

    useEffect(() => {
        const eventSource = new EventSource("/api/server/stream-stats");

        eventSource.onopen = () => {
            console.log("SSE Connection opened");
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.system) setStats(data.system);
                if (data.docker && Array.isArray(data.docker.containers)) {
                    setContainers(data.docker.containers);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to parse SSE data", err);
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE Connection Error", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const handleLogout = async () => {
        await fetch("/api/server/logout");
        window.location.href = "/login";
    };

    const handleContainerAction = async (action: "start" | "stop" | "restart", id: string) => {
        try {
            switch (action) {
                case "start":
                    await dockerService.startContainer(id);
                    break;
                case "stop":
                    await dockerService.stopContainer(id);
                    break;
                case "restart":
                    await dockerService.restartContainer(id);
                    break;
            }
            // Refresh data after action - although stream will update it shortly
            // setTimeout(fetchData, 1000); 
        } catch (error) {
            console.error(`Failed to ${action} container`, error);
        }
    };

    const runningContainers = containers.filter(c => c.State === "running");
    const otherContainers = containers.filter(c => c.State !== "running");

    return (
        <div className="min-h-screen w-full relative overflow-x-hidden antialiased text-neutral-200 font-sans">
            <div className="fixed inset-0 bg-neutral-950 z-0" />
            <BackgroundBeams />
            <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center backdrop-blur-md bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 sticky top-4 z-50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                            <span className="font-bold text-white">Z</span>
                        </div>
                        <h1 className="text-2xl font-bold text-neutral-100">
                            Z E N T
                        </h1>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-medium text-green-500 uppercase tracking-wider">Live</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={fetchData} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-all text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* System Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                        <p className="text-neutral-400 text-sm font-medium">Server Info</p>
                        <div className="mt-4 space-y-3">
                            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                                <span className="text-neutral-500 text-sm">User</span>
                                <span className="text-neutral-200 font-mono text-sm">{stats?.user || "—"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-500 text-sm">Uptime</span>
                                <span className="text-neutral-200 font-mono text-xs">
                                    {(() => {
                                        if (!stats?.uptime) return "—";
                                        const timeStr = stats.uptime;

                                        const years = timeStr.match(/(\d+)\s*year/);
                                        const months = timeStr.match(/(\d+)\s*month/);
                                        const weeks = timeStr.match(/(\d+)\s*week/);
                                        const days = timeStr.match(/(\d+)\s*day/);
                                        const hours = timeStr.match(/(\d+)\s*hour/);
                                        const minutes = timeStr.match(/(\d+)\s*minute/);

                                        let formatted = [];
                                        if (years) formatted.push(`${years[1]}y`);
                                        if (months) formatted.push(`${months[1]}m`);
                                        if (weeks) formatted.push(`${weeks[1]}w`);
                                        if (days) formatted.push(`${days[1]}d`);

                                        if (formatted.length === 0) {
                                            if (hours) formatted.push(`${hours[1]}h`);
                                            if (minutes) formatted.push(`${minutes[1]}m`);
                                            if (formatted.length === 0) return timeStr;
                                        }

                                        return formatted.join(" ");
                                    })()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <SystemResourceCard title="CPU Usage" usage={Math.round(stats?.cpu?.usage || 0)} />
                    <SystemResourceCard title="Memory Usage" usage={Math.round(stats?.memory?.usage || 0)} />
                    <SystemResourceCard title="Disk Usage" usage={stats?.disk ? parseInt(stats.disk.percent) : 0} />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Docker Section */}
                    <div className="rounded-3xl bg-neutral-900/40 border border-neutral-800/50 backdrop-blur-md overflow-hidden">
                        <div className="p-6 border-b border-neutral-800/50 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-neutral-200 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                Docker Containers
                            </h2>
                            <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-400 text-xs font-medium border border-neutral-700">
                                {containers.length} Total
                            </span>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Running (Priority) */}
                            {runningContainers.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider ml-1">Running</h3>
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
                            )}

                            {/* Collapsible Area for Others */}
                            {(otherContainers.length > 0) && (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowAllContainers(!showAllContainers)}
                                        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors w-full py-2"
                                    >
                                        {showAllContainers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        {showAllContainers ? "Hide Stopped Containers" : `Show ${otherContainers.length} Stopped Containers`}
                                    </button>

                                    {showAllContainers && (
                                        <div className="space-y-3 pl-2 border-l-2 border-neutral-800/50">
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
                                    )}
                                </div>
                            )}

                            {containers.length === 0 && !loading && (
                                <div className="text-center py-12 text-neutral-500">
                                    No containers found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <BackgroundBeams />
        </div>
    );
};

export default Dashboard;
