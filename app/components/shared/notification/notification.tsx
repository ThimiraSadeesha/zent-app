
"use client";

import React, { useEffect } from "react";

type NotificationType = "success" | "error" | "warning";

interface NotificationProps {
    type: NotificationType;
    message: string;
    isVisible: boolean;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDuration?: number;
}

export function Notification({
                                 type,
                                 message,
                                 isVisible,
                                 onClose,
                                 autoClose = true,
                                 autoCloseDuration = 3000,
                             }: NotificationProps) {
    useEffect(() => {
        if (isVisible && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDuration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, autoClose, autoCloseDuration, onClose]);

    if (!isVisible) return null;

    const styles = {
        success: {
            bg: "bg-emerald-500/10",
            border: "border-emerald-500",
            text: "text-emerald-400",
            icon: "✓",
        },
        error: {
            bg: "bg-red-500/10",
            border: "border-red-500",
            text: "text-red-400",
            icon: "✕",
        },
        warning: {
            bg: "bg-amber-500/10",
            border: "border-amber-500",
            text: "text-amber-400",
            icon: "⚠",
        },
    };

    const currentStyle = styles[type];

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <div
                className={`flex items-center gap-3 rounded-lg border ${currentStyle.border} ${currentStyle.bg} px-4 py-3 shadow-lg min-w-[300px]`}
            >
        <span className={`text-xl ${currentStyle.text}`}>
          {currentStyle.icon}
        </span>
                <span className={`flex-1 ${currentStyle.text}`}>{message}</span>
                <button
                    onClick={onClose}
                    className={`${currentStyle.text} hover:opacity-70 transition`}
                >
                    ✕
                </button>
            </div>
        </div>
    );
}