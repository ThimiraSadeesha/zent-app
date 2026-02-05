"use client";

import React, { useState } from "react";
import {BackgroundBeams} from "@/app/components/background/background-beams";
import { useRouter } from "next/navigation";
import {serverAPI} from "@/lib/services/server.service";



export function BackgroundBeamsDemo() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        host: "",
        username: "",
        password: "",
        port: "22",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await serverAPI.login({
                host: form.host,
                username: form.username,
                password: form.password,
                port: Number(form.port),
            });

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setForm({ host: "", username: "", password: "", port: "" });
    };

    return (
        <div className="h-screen w-full relative overflow-hidden flex items-start justify-end antialiased">
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-indigo-950" />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 max-w-md w-full m-6 mt-16 p-6 rounded-xl text-center">
                <h1 className="text-3xl md:text-7xl font-bold font-sans bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
                    Z E N T
                </h1>
                <p className="text-neutral-400 mt-2 mb-4 text-sm">
                    Monitor servers, track resources, and manage Docker containers in real time.
                </p>

                <div className="space-y-3">
                    <input
                        type="text"
                        name="host"
                        placeholder="Host / IP"
                        value={form.host}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="text"
                        name="port"
                        placeholder="Port"
                        value={form.port}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                <div className="mt-5 flex justify-center gap-3">
                    <button
                        onClick={handleClear}
                        className="w-[calc(50%-0.375rem)] px-6 py-2 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleLogin}
                        className="w-[calc(50%-0.375rem)] px-6 py-2 rounded-lg bg-teal-500 text-black font-semibold hover:bg-teal-400 transition"
                    >
                        Login
                    </button>
                </div>
            </div>
            <BackgroundBeams />
        </div>
    );
}