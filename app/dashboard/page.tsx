"use client";

import SystemResourceCard from "@/app/components/server/server-resouse";
import SystemInfoCard from "@/app/components/dashboard/system-info-card";
import CollapsibleSection from "@/app/components/ui/collapsible-section";
import DockerDetailCard from "@/app/components/docker/docker-detail-card";
import { BackgroundBeams } from "@/app/components/background/background-beams";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { serverAPI } from "@/lib/services/server.service";
import { dockerService } from "@/lib/services/docker.service";
import { Loading } from "@/app/components/shared/loading/loading";
import { Notification } from "@/app/components/shared/notification/notification";

const Dashboard = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [notification, setNotification] = useState({
        isVisible: false,
        type: "success" as "success" | "error" | "warning",
        message: "",
    });

    const [systemData, setSystemData] = useState({
        ram: {
            used_mb: "0",
            total_mb: "0",
            percent: "0"
        },
        disk: {
            used: "0G",
            total: "0G",
            percent: "0"
        },
        cpu: {
            percent: "0"
        },
        threads: {
            count: "0"
        },
        uptime: {
            uptime: "Loading..."
        },
        os: {
            name: "Loading",
            version: ""
        }
    });

    const [dockerData, setDockerData] = useState({
        docker_installed: false,
        total_containers: 0,
        running_containers: 0,
        containers: [] as any[]
    });

    const showNotification = (
        type: "success" | "error" | "warning",
        message: string
    ) => {
        setNotification({ isVisible: true, type, message });
    };

    const closeNotification = () => {
        setNotification({ ...notification, isVisible: false });
    };

    // Fetch system stats
    const fetchSystemStats = async () => {
        try {
            const storedInfo = localStorage.getItem("serverInfo");
            if (storedInfo) {
                const serverInfo = JSON.parse(storedInfo);
                if (serverInfo.data) {
                    setSystemData(serverInfo.data);
                } else if (serverInfo) {
                    setSystemData(serverInfo);
                }
            }
            // Then fetch fresh data from API (this will update the display)
            // You can call your backend endpoint here if you have one for refreshing
            // const response = await serverAPI.getStats();
            // if (response?.data?.data) {
            //     setSystemData(response.data.data);
            //     localStorage.setItem("serverInfo", JSON.stringify(response.data));
            // }
        } catch (err: any) {
            console.error("Failed to fetch system stats:", err);
            showNotification("error", "Failed to load system statistics");
        }
    };

    // Fetch Docker stats
    const fetchDockerStats = async () => {
        try {
            const response = await dockerService.getStats();
            if (response.status === 200) {
                setDockerData(response.data);
            } else if (response?.data) {
                setDockerData(response.data);
            }
        } catch (err: any) {
            console.error("Failed to fetch Docker stats:", err);
            showNotification("error", "Failed to load Docker statistics");
        }
    };

    // Initial data load
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchSystemStats(),
                    fetchDockerStats()
                ]);
            } catch (err) {
                showNotification("error", "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);


    useEffect(() => {
        const interval = setInterval(async () => {
            setRefreshing(true);
            try {
                await Promise.all([
                    fetchSystemStats(),
                    fetchDockerStats()
                ]);
            } catch (err) {
                console.error("Auto-refresh failed:", err);
            } finally {
                setRefreshing(false);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        try {
            await serverAPI.logout();
            localStorage.removeItem("serverInfo"); // Clear stored data
            showNotification("success", "Logged out successfully");
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (err: any) {
            showNotification("error", "Logout failed");
            localStorage.removeItem("serverInfo"); // Clear anyway
            // Navigate anyway after a short delay
            setTimeout(() => {
                router.push("/");
            }, 1500);
        }
    };

    const handleStart = async (containerName: string) => {
        try {
            setRefreshing(true);
            await dockerService.startContainer(containerName);
            showNotification("success", `Container "${containerName}" started successfully`);
            await fetchDockerStats();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to start container";
            showNotification("error", errorMessage);
        } finally {
            setRefreshing(false);
        }
    };

    const handleStop = async (containerName: string) => {
        try {
            setRefreshing(true);
            await dockerService.stopContainer(containerName);
            showNotification("success", `Container "${containerName}" stopped successfully`);
            await fetchDockerStats();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to stop container";
            showNotification("error", errorMessage);
        } finally {
            setRefreshing(false);
        }
    };

    const handleRestart = async (containerName: string) => {
        try {
            setRefreshing(true);
            await dockerService.restartContainer(containerName);
            showNotification("success", `Container "${containerName}" restarted successfully`);
            await fetchDockerStats();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to restart container";
            showNotification("error", errorMessage);
        } finally {
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                fetchSystemStats(),
                fetchDockerStats()
            ]);
            showNotification("success", "Data refreshed successfully");
        } catch (err) {
            showNotification("error", "Failed to refresh data");
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return <Loading isLoading={true} message="Loading dashboard..." />;
    }

    return (
        <>
            <Loading isLoading={refreshing} message="Refreshing data..." />

            <Notification
                type={notification.type}
                message={notification.message}
                isVisible={notification.isVisible}
                onClose={closeNotification}
            />

            <div className="min-h-screen w-full relative overflow-hidden antialiased">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-indigo-950" />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 min-h-screen p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                                Z E N T
                            </h1>
                            <p className="text-neutral-400 mt-2">Monitor your server resources and containers in real-time</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {refreshing ? "Refreshing..." : "Refresh"}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* System Resources */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <SystemResourceCard
                                title="RAM"
                                usage={parseFloat(systemData.ram.percent)}
                                used={`${systemData.ram.used_mb}MB`}
                                total={`${systemData.ram.total_mb}MB`}
                            />
                            <SystemResourceCard
                                title="Disk"
                                usage={parseInt(systemData.disk.percent)}
                                used={systemData.disk.used}
                                total={systemData.disk.total}
                            />
                            <SystemResourceCard
                                title="CPU"
                                usage={parseFloat(systemData.cpu.percent)}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SystemInfoCard
                                title="Operating System"
                                value={`${systemData.os.name} ${systemData.os.version}`}
                                icon="💻"
                            />
                            <SystemInfoCard
                                title="Uptime & Load"
                                value={systemData.uptime.uptime}
                                icon="⏱️"
                            />
                            <SystemInfoCard
                                title="Threads"
                                value={`${systemData.threads.count} threads`}
                                icon="🧵"
                            />
                        </div>
                    </div>

                    <CollapsibleSection
                        title="Docker"
                        icon="🐳"
                        badge={`${dockerData.running_containers} / ${dockerData.total_containers} Running`}
                        defaultExpanded={true}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 rounded-lg bg-neutral-800/50">
                                <p className="text-neutral-400 text-sm">Docker Status</p>
                                <p className={`text-xl font-semibold mt-1 ${dockerData.docker_installed ? "text-teal-500" : "text-red-500"}`}>
                                    {dockerData.docker_installed ? "Installed ✓" : "Not Installed"}
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-neutral-800/50">
                                <p className="text-neutral-400 text-sm">Total Containers</p>
                                <p className="text-xl font-semibold mt-1 text-neutral-200">{dockerData.total_containers}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-neutral-800/50">
                                <p className="text-neutral-400 text-sm">Running Containers</p>
                                <p className="text-xl font-semibold mt-1 text-green-500">{dockerData.running_containers}</p>
                            </div>
                        </div>

                        {dockerData.containers.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {dockerData.containers.map((container) => (
                                    <DockerDetailCard
                                        key={container.name}
                                        {...container}
                                        onStart={() => handleStart(container.name)}
                                        onStop={() => handleStop(container.name)}
                                        onRestart={() => handleRestart(container.name)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-neutral-400">
                                <p className="text-lg">No containers found</p>
                                <p className="text-sm mt-2">Docker containers will appear here once they are created</p>
                            </div>
                        )}
                    </CollapsibleSection>
                </div>

                <BackgroundBeams />
            </div>
        </>
    );
};

export default Dashboard;