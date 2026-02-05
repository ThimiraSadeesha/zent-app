"use client";

import SystemResourceCard from "@/app/components/server/server-resouse";
import SystemInfoCard from "@/app/components/dashboard/system-info-card";
import CollapsibleSection from "@/app/components/ui/collapsible-section";
import DockerDetailCard from "@/app/components/docker/docker-detail-card";
import { BackgroundBeams } from "@/app/components/background/background-beams";
import { useState } from "react";
import Link from "next/link";

const Dashboard = () => {
    // Mock system data
    const [systemData] = useState({
        ram: {
            used_mb: "4211",
            total_mb: "7491",
            percent: "56.21"
        },
        disk: {
            used: "40G",
            total: "74G",
            percent: "54"
        },
        cpu: {
            percent: "5.5"
        },
        threads: {
            count: "967"
        },
        uptime: {
            uptime: "68 days, 21:20, | Load: 0.11, 0.08, 0.01"
        },
        os: {
            name: "Rocky Linux",
            version: "9.7 (Blue Onyx)"
        }
    });

    // Mock Docker data
    const [dockerData] = useState({
        docker_installed: true,
        total_containers: 12,
        running_containers: 11,
        containers: [
            {
                name: "zent-api-prod",
                cpu_percent: "0.14%",
                memory_usage: "53.32MiB / 7.316GiB",
                memory_percent: "0.71%",
                network_io: "311kB / 225kB",
                block_io: "127kB / 201kB",
                pids: "5",
                status: "Up 2 days",
                state: "running",
                image: "zent-api-prod"
            },
            {
                name: "zent-api-dev",
                cpu_percent: "0.20%",
                memory_usage: "75.23MiB / 7.316GiB",
                memory_percent: "1.00%",
                network_io: "274kB / 177kB",
                block_io: "0B / 250kB",
                pids: "4",
                status: "Up 2 days",
                state: "running",
                image: "zent-api-dev"
            },
            {
                name: "sqlserver",
                cpu_percent: "1.06%",
                memory_usage: "1008MiB / 7.316GiB",
                memory_percent: "13.46%",
                network_io: "91.6MB / 76.5MB",
                block_io: "597MB / 1.96GB",
                pids: "183",
                status: "Up 9 days (unhealthy)",
                state: "running",
                image: "mcr.microsoft.com/mssql/server:2022-latest"
            },
            {
                name: "mariadb_dev",
                cpu_percent: "0.02%",
                memory_usage: "136.4MiB / 7.316GiB",
                memory_percent: "1.82%",
                network_io: "20.6kB / 4.77kB",
                block_io: "49.7MB / 80.9kB",
                pids: "8",
                status: "Up 9 days (unhealthy)",
                state: "running",
                image: "mariadb:lts"
            },
            {
                name: "pg-primary",
                cpu_percent: "5.21%",
                memory_usage: "85.54MiB / 7.316GiB",
                memory_percent: "1.14%",
                network_io: "26.5MB / 32.5MB",
                block_io: "48.8MB / 147MB",
                pids: "11",
                status: "Up 6 days (healthy)",
                state: "running",
                image: "postgres:16-alpine"
            },
            {
                name: "navoda-api-prod",
                cpu_percent: "0.00%",
                memory_usage: "136.4MiB / 7.316GiB",
                memory_percent: "1.82%",
                network_io: "14MB / 9.19MB",
                block_io: "1MB / 12.3kB",
                pids: "23",
                status: "Up 9 days",
                state: "running",
                image: "fusion-erp-api:prod"
            },
            {
                name: "navoda-api-dev",
                cpu_percent: "0.00%",
                memory_usage: "130.4MiB / 7.316GiB",
                memory_percent: "1.74%",
                network_io: "5.63MB / 8.4MB",
                block_io: "336kB / 8.19kB",
                pids: "23",
                status: "Up 9 days",
                state: "running",
                image: "fusion-erp-api:dev"
            },
            {
                name: "navoda-ui-prod",
                cpu_percent: "0.00%",
                memory_usage: "8.434MiB / 7.316GiB",
                memory_percent: "0.11%",
                network_io: "12MB / 230MB",
                block_io: "3.35MB / 4.1kB",
                pids: "5",
                status: "Up 9 days",
                state: "running",
                image: "navoda-ui:prod"
            },
            {
                name: "navoda-ui-dev",
                cpu_percent: "0.00%",
                memory_usage: "13.41MiB / 7.316GiB",
                memory_percent: "0.18%",
                network_io: "4.55MB / 225MB",
                block_io: "10.6MB / 4.1kB",
                pids: "5",
                status: "Up 9 days",
                state: "running",
                image: "navoda-ui:dev"
            },
            {
                name: "lumiraq_production",
                cpu_percent: "0.54%",
                memory_usage: "452.7MiB / 7.316GiB",
                memory_percent: "6.04%",
                network_io: "880kB / 8.77MB",
                block_io: "18.9MB / 46.2MB",
                pids: "42",
                status: "Up 9 days",
                state: "running",
                image: "mysql:8.0"
            },
            {
                name: "lumiraq_development",
                cpu_percent: "0.35%",
                memory_usage: "409.4MiB / 2GiB",
                memory_percent: "19.99%",
                network_io: "802kB / 682kB",
                block_io: "14.1MB / 19.3MB",
                pids: "42",
                status: "Up 9 days",
                state: "running",
                image: "mysql:8.0"
            },
            {
                name: "pg-replica-1",
                status: "Created",
                state: "created",
                image: "postgres:16-alpine",
                cpu_percent: "N/A",
                memory_usage: "N/A",
                memory_percent: "N/A",
                network_io: "N/A",
                block_io: "N/A",
                pids: "N/A"
            }
        ]
    });

    const handleStart = (containerName: string) => {
        console.log(`Starting container: ${containerName}`);
    };

    const handleStop = (containerName: string) => {
        console.log(`Stopping container: ${containerName}`);
    };

    const handleRestart = (containerName: string) => {
        console.log(`Restarting container: ${containerName}`);
    };

    return (
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
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition"
                    >
                        Logout
                    </Link>
                </div>

                {/* System Resources */}
                <div className="mb-8">
                    {/*<h2 className="text-2xl font-semibold text-neutral-200 mb-4">System</h2>*/}
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
                    {/*<h2 className="text-2xl font-semibold text-neutral-200 mb-4">System</h2>*/}
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
                </CollapsibleSection>
            </div>

            <BackgroundBeams />
        </div>
    );
};

export default Dashboard;
