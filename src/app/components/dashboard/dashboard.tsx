"use client";

import React, { useState } from "react";
import { Cpu, Activity, HardDrive, Layers, Clock } from "lucide-react";
import { ResponsiveContainer, AreaChart, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area } from "recharts";
import {BackgroundBeams} from "../login";

interface DashboardProps {
    title?: string;
}

export const Dashboard = React.memo((props: DashboardProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const systemData = {
        ram: { used_mb: "2289", total_mb: "7491", percent: "30.56" },
        disk: { used: "36G", total: "74G", percent: "48%" },
        cpu: { percent: "3" },
        threads: { count: "587" },
        uptime: { uptime: "55 days, 10:52, | Load: 0.08, 0.02, 0.01" },
        os: { name: "Rocky Linux", version: "9.7 (Blue Onyx)" }
    };

    const cpuHistory = [
        { time: '10:00', value: 2.1 },
        { time: '10:15', value: 1.8 },
        { time: '10:30', value: 2.3 },
        { time: '10:45', value: 3.0 },
        { time: '11:00', value: 2.5 },
        { time: '11:15', value: 2.8 },
        { time: '11:30', value: 3.2 },
    ];

    const ramHistory = [
        { time: '10:00', value: 28.5 },
        { time: '10:15', value: 29.2 },
        { time: '10:30', value: 29.8 },
        { time: '10:45', value: 30.1 },
        { time: '11:00', value: 30.3 },
        { time: '11:15', value: 30.4 },
        { time: '11:30', value: 30.56 },
    ];

    return (
        <>
            <style jsx>{`
                .dashboard-container {
                    min-height: 100vh;
                    background: linear-gradient(to bottom, rgb(10, 10, 10), rgb(20, 20, 20));
                    position: relative;
                    overflow-x: hidden;
                }

                .beams-background {
                    position: fixed;
                    inset: 0;
                    opacity: 0.3;
                    pointer-events: none;
                    z-index: 0;
                }

                .beam {
                    position: absolute;
                    width: 2px;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent, #18CCFC, #6344F5, transparent);
                    animation: beam-move 8s linear infinite;
                }

                .beam:nth-child(1) { left: 10%; animation-delay: 0s; }
                .beam:nth-child(2) { left: 30%; animation-delay: 2s; }
                .beam:nth-child(3) { left: 50%; animation-delay: 4s; }
                .beam:nth-child(4) { left: 70%; animation-delay: 6s; }
                .beam:nth-child(5) { left: 90%; animation-delay: 1s; }

                @keyframes beam-move {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100%); opacity: 0; }
                }

                .content-wrapper {
                    position: relative;
                    z-index: 1;
                    padding: 1.5rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .header-title {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .title {
                    font-size: 2rem;
                    font-weight: bold;
                    background: linear-gradient(to right, rgb(229, 229, 229), rgb(115, 115, 115));
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    letter-spacing: 0.1em;
                }

                .subtitle {
                    color: rgb(115, 115, 115);
                    font-size: 0.875rem;
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: rgba(20, 184, 166, 0.1);
                    border: 1px solid rgb(20, 184, 166);
                    border-radius: 0.5rem;
                    color: rgb(20, 184, 166);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .logout-btn:hover {
                    background: rgba(20, 184, 166, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: rgba(38, 38, 38, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    border-color: rgba(20, 184, 166, 0.5);
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(20, 184, 166, 0.2);
                }

                .stat-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }

                .stat-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: rgb(229, 229, 229);
                    font-weight: 600;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .icon-wrapper {
                    width: 2.5rem;
                    height: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 0.5rem;
                    background: linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(99, 68, 245, 0.2));
                }

                .stat-value {
                    font-size: 2.5rem;
                    font-weight: bold;
                    background: linear-gradient(to right, #18CCFC, #6344F5);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    margin-bottom: 0.5rem;
                }

                .stat-detail {
                    color: rgb(115, 115, 115);
                    font-size: 0.875rem;
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    overflow: hidden;
                    margin-top: 1rem;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(to right, #18CCFC, #6344F5);
                    border-radius: 1rem;
                    transition: width 0.5s ease;
                    box-shadow: 0 0 10px rgba(24, 204, 252, 0.5);
                }

                .chart-card {
                    background: rgba(38, 38, 38, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    backdrop-filter: blur(10px);
                    margin-bottom: 2rem;
                }

                .chart-title {
                    color: rgb(229, 229, 229);
                    font-weight: 600;
                    font-size: 1rem;
                    margin-bottom: 1.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                @media (min-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .content-wrapper {
                        padding: 2rem;
                    }

                    .title {
                        font-size: 2.5rem;
                    }
                }

                @media (min-width: 1024px) {
                    .stats-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }

                    .content-wrapper {
                        padding: 3rem;
                    }

                    .title {
                        font-size: 3rem;
                    }
                }
            `}</style>

            <div className="dashboard-container">
                <div className="beams-background">
                    <div className="beam"></div>
                    <div className="beam"></div>
                    <div className="beam"></div>
                    <div className="beam"></div>
                    <div className="beam"></div>
                </div>

                <div className="content-wrapper">
                    <div className="header">
                        <div className="header-title">
                            <h1 className="title">ZENT</h1>
                            <p className="subtitle">{systemData.os.name} {systemData.os.version}</p>
                        </div>
                        <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            Logout
                        </button>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-title">
                                    <div className="icon-wrapper">
                                        <Cpu size={20} color="#18CCFC" />
                                    </div>
                                    CPU Usage
                                </div>
                            </div>
                            <div className="stat-value">{systemData.cpu.percent}%</div>
                            <div className="stat-detail">Processor Activity</div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${systemData.cpu.percent}%` }}></div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-title">
                                    <div className="icon-wrapper">
                                        <Activity size={20} color="#6344F5" />
                                    </div>
                                    RAM Usage
                                </div>
                            </div>
                            <div className="stat-value">{systemData.ram.percent}%</div>
                            <div className="stat-detail">{systemData.ram.used_mb}MB / {systemData.ram.total_mb}MB</div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${systemData.ram.percent}%` }}></div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-title">
                                    <div className="icon-wrapper">
                                        <HardDrive size={20} color="#AE48FF" />
                                    </div>
                                    Disk Usage
                                </div>
                            </div>
                            <div className="stat-value">{systemData.disk.percent}</div>
                            <div className="stat-detail">{systemData.disk.used} / {systemData.disk.total}</div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: systemData.disk.percent }}></div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-title">
                                    <div className="icon-wrapper">
                                        <Layers size={20} color="#18CCFC" />
                                    </div>
                                    Threads
                                </div>
                            </div>
                            <div className="stat-value">{systemData.threads.count}</div>
                            <div className="stat-detail">Active Threads</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-title">
                                    <div className="icon-wrapper">
                                        <Clock size={20} color="#6344F5" />
                                    </div>
                                    Uptime
                                </div>
                            </div>
                            <div className="stat-value" style={{ fontSize: '1.25rem' }}>55 days</div>
                            <div className="stat-detail">{systemData.uptime.uptime}</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-title">
                                    <div className="icon-wrapper">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AE48FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                                            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                                            <line x1="6" y1="6" x2="6.01" y2="6"/>
                                            <line x1="6" y1="18" x2="6.01" y2="18"/>
                                        </svg>
                                    </div>
                                    System
                                </div>
                            </div>
                            <div className="stat-value" style={{ fontSize: '1.5rem' }}>Rocky</div>
                            <div className="stat-detail">{systemData.os.name} {systemData.os.version}</div>
                        </div>
                    </div>

                    <div className="chart-card">
                        <h3 className="chart-title">CPU Usage History</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={cpuHistory}>
                                <defs>
                                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#18CCFC" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#6344F5" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="time" stroke="#737373" />
                                <YAxis stroke="#737373" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(38, 38, 38, 0.95)',
                                        border: '1px solid rgba(20, 184, 166, 0.5)',
                                        borderRadius: '0.5rem',
                                        color: '#e5e5e5'
                                    }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#18CCFC" strokeWidth={2} fill="url(#cpuGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h3 className="chart-title">RAM Usage History</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={ramHistory}>
                                <defs>
                                    <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6344F5" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#AE48FF" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="time" stroke="#737373" />
                                <YAxis stroke="#737373" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(38, 38, 38, 0.95)',
                                        border: '1px solid rgba(99, 68, 245, 0.5)',
                                        borderRadius: '0.5rem',
                                        color: '#e5e5e5'
                                    }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#6344F5" strokeWidth={2} fill="url(#ramGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
});

Dashboard.displayName = "Dashboard";
