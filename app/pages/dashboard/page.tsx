"use client";

import DockerContainerCard from "@/app/components/docker/docker-container";
import { BackgroundBeams } from "@/app/components/background/background-beams";
import SystemResourceCard from "@/app/components/server/server-resouse";
import { useState } from "react";

const dashbaord = () => {
    const [form, setForm] = useState({
        host: "127.0.0.1",
        username: "admin",
        port: "8080",
    });

    const handleLogout = () => {
        console.log("Logout clicked");
    };

    return (
        <div className="h-screen w-full relative overflow-hidden antialiased">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-indigo-950" />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 h-full p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                        Z E N T
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Server Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Server", value: form.host },
                        { label: "User", value: form.username },
                        { label: "Port", value: form.port },
                        { label: "Status", value: "Connected", isStatus: true },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm"
                        >
                            <p className="text-neutral-400 text-sm">{item.label}</p>
                            <p
                                className={`text-xl font-semibold mt-1 ${
                                    item.isStatus ? "text-teal-500" : "text-neutral-200"
                                }`}
                            >
                                {item.value || "N/A"}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 rounded-lg bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-neutral-200 mb-4">System</h2>
                        <div className="space-y-4">
                            <SystemResourceCard title="CPU Usage" usage={45} />
                            <SystemResourceCard title="Memory Usage" usage={68} />
                            <SystemResourceCard title="Disk Usage" usage={52} />
                        </div>
                    </div>

                    {/* Docker Containers */}
                    <div className="p-6 rounded-lg bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-neutral-200 mb-4">Docker</h2>
                        <div className="space-y-3">
                            <DockerContainerCard name="nginx-proxy" status="Running" />
                            <DockerContainerCard name="postgres-db" status="Running" />
                            <DockerContainerCard name="redis-cache" status="Stopped" />
                        </div>
                    </div>
                </div>
            </div>
            <BackgroundBeams />
        </div>
    );
};

export default dashbaord;
