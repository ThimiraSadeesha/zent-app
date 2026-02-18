"use client";

import React from "react";

interface LoadingProps {
    isLoading: boolean;
    message?: string;
}

export function Loading({ isLoading, message = "Loading..." }: LoadingProps) {
    if (!isLoading) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="rounded-lg bg-neutral-900 p-6 shadow-xl border border-neutral-800">
                <div className="flex items-center gap-3">
                    <span className="relative flex size-5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex size-5 rounded-full bg-teal-500"></span>
                    </span>
                    <span className="text-neutral-200">{message}</span>
                </div>
            </div>
        </div>
    );
}