"use client";

import React, {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {Dashboard} from "./dashboard/dashboard";

interface BackgroundBeamsProps {
    className?: string;
    onLogin?: () => void;
}

export const BackgroundBeams = React.memo<BackgroundBeamsProps>(({className = "", onLogin}) => {

            const [host, setHost] = useState("");
            const router = useRouter();
            const [username, setUsername] = useState("");
            const [password, setPassword] = useState("");
            const [port, setPort] = useState("");

        const handleLogin = () => {
            router.push("/dashboard");
            if (onLogin) onLogin();
        };

            const paths = [
                "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
                "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
                "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
                "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
                "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
                "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
                "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
                "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
                "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
                "M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803",
                "M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795",
                "M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787",
                "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
                "M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771",
                "M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763",
                "M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755",
                "M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747",
                "M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739",
                "M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731",
                "M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723",
            ];

            const gradients = useMemo(() => {
                return paths.map((_, index) => {
                    const duration = 10 + (index * 1.7) % 10;
                    const delay = (index * 0.7) % 10;
                    return {duration, delay};
                });
            }, [paths.length]);

            return (
                <>
                    <style jsx>{`
                        .beams-container {
                            position: absolute;
                            inset: 0;
                            display: flex;
                            height: 100%;
                            width: 100%;
                            align-items: center;
                            justify-content: center;
                        }

                        .beams-svg {
                            pointer-events: none;
                            position: absolute;
                            z-index: 0;
                            height: 100%;
                            width: 100%;
                        }

                        .animated-path {
                            stroke-opacity: 0.4;
                            stroke-width: 0.5;
                        }

                        .demo-container {
                            position: relative;
                            width: 100%;
                            max-width: 28rem;
                            padding: 1.5rem;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            z-index: 10;
                            margin: 0 auto;
                        }

                        .content-wrapper {
                            width: 100%;
                        }

                        .title {
                            position: relative;
                            z-index: 10;
                            font-size: 2.5rem;
                            text-align: center;
                            font-weight: bold;
                            letter-spacing: 0.3em;
                            background: linear-gradient(
                                    to bottom,
                                    rgb(229, 229, 229),
                                    rgb(115, 115, 115)
                            );
                            -webkit-background-clip: text;
                            background-clip: text;
                            color: transparent;
                            margin: 0 0 1rem 0;
                        }

                        .description {
                            color: rgb(115, 115, 115);
                            margin: 0 auto 1.5rem;
                            font-size: 0.875rem;
                            line-height: 1.5;
                            text-align: center;
                            position: relative;
                            z-index: 10;
                        }

                        .input-field {
                            border-radius: 0.5rem;
                            border: 1px solid rgb(38, 38, 38);
                            width: 100%;
                            position: relative;
                            z-index: 10;
                            margin-top: 0.75rem;
                            background-color: rgb(10, 10, 10);
                            color: white;
                            padding: 0.75rem 1rem;
                            font-size: 0.875rem;
                        }

                        .input-field::placeholder {
                            color: rgb(64, 64, 64);
                        }

                        .input-field:focus {
                            outline: none;
                            border-color: rgb(20, 184, 166);
                            box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.3);
                        }

                        .login-button {
                            border-radius: 0.5rem;
                            border: 1px solid rgb(20, 184, 166);
                            width: 100%;
                            position: relative;
                            z-index: 10;
                            margin-top: 1rem;
                            background-color: rgb(20, 184, 166);
                            color: rgb(10, 10, 10);
                            padding: 0.75rem 1rem;
                            font-size: 0.875rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease-in-out;
                            border: none;
                        }

                        .login-button:hover {
                            background-color: rgb(13, 148, 136);
                            transform: translateY(-1px);
                        }

                        .login-button:active {
                            transform: translateY(0);
                        }

                        .login-button:focus {
                            outline: none;
                            box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.3);
                        }

                        /* Tablet (768px and up) */
                        @media (min-width: 768px) {
                            .demo-container {
                                position: absolute;
                                top: 2rem;
                                right: 2rem;
                                max-width: 26rem;
                                padding: 2rem;
                                margin: 0;
                            }

                            .title {
                                font-size: 3.5rem;
                            }

                            .description {
                                font-size: 0.9rem;
                            }

                            .input-field {
                                margin-top: 0.875rem;
                            }

                            .login-button {
                                margin-top: 1.25rem;
                            }
                        }

                        /* Desktop (1024px and up) */
                        @media (min-width: 1024px) {
                            .demo-container {
                                max-width: 30rem;
                            }

                            .title {
                                font-size: 4.5rem;
                            }

                            .description {
                                font-size: 1rem;
                            }

                            .input-field {
                                margin-top: 1rem;
                            }
                        }

                        /* Mobile landscape */
                        @media (max-height: 600px) and (orientation: landscape) {
                            .title {
                                font-size: 2rem;
                                margin-bottom: 0.5rem;
                            }

                            .description {
                                font-size: 0.8rem;
                                margin-bottom: 1rem;
                            }

                            .input-field {
                                padding: 0.5rem 0.75rem;
                                margin-top: 0.5rem;
                            }

                            .login-button {
                                padding: 0.5rem 0.75rem;
                                margin-top: 0.75rem;
                            }

                            .demo-container {
                                padding: 1rem;
                            }
                        }
                    `}</style>

                    <div className={`beams-container ${className}`}>
                        <svg
                            className="beams-svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 696 316"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {paths.map((path, index) => (
                                <path
                                    key={`path-${index}`}
                                    d={path}
                                    stroke={`url(#linearGradient-${index})`}
                                    className="animated-path"
                                />
                            ))}

                            <defs>
                                {paths.map((_, index) => {
                                    const {duration, delay} = gradients[index];

                                    return (
                                        <linearGradient
                                            id={`linearGradient-${index}`}
                                            key={`gradient-${index}`}
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="100%"
                                        >
                                            <stop stopColor="#18CCFC" stopOpacity="0">
                                                <animate
                                                    attributeName="offset"
                                                    values="0;1;0"
                                                    dur={`${duration}s`}
                                                    begin={`${delay}s`}
                                                    repeatCount="indefinite"
                                                />
                                            </stop>
                                            <stop stopColor="#18CCFC">
                                                <animate
                                                    attributeName="offset"
                                                    values="0;0.3;0"
                                                    dur={`${duration}s`}
                                                    begin={`${delay}s`}
                                                    repeatCount="indefinite"
                                                />
                                            </stop>
                                            <stop offset="32.5%" stopColor="#6344F5">
                                                <animate
                                                    attributeName="offset"
                                                    values="0.325;0.625;0.325"
                                                    dur={`${duration}s`}
                                                    begin={`${delay}s`}
                                                    repeatCount="indefinite"
                                                />
                                            </stop>
                                            <stop offset="100%" stopColor="#AE48FF" stopOpacity="0">
                                                <animate
                                                    attributeName="offset"
                                                    values="1;1;1"
                                                    dur={`${duration}s`}
                                                    begin={`${delay}s`}
                                                    repeatCount="indefinite"
                                                />
                                            </stop>
                                        </linearGradient>
                                    );
                                })}
                            </defs>
                        </svg>

                        <div className="demo-container">
                            <div className="content-wrapper">
                                <h1 className="title">ZENT</h1>
                                <p className="description">
                                    Monitor servers, track resources, and manage Docker containers in real time with Zent.
                                </p>
                                <input
                                    type="text"
                                    placeholder="Host"
                                    className="input-field"
                                    value={host}
                                    onChange={(e) => setHost(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="input-field"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="input-field"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Port"
                                    className="input-field"
                                    value={port}
                                    onChange={(e) => setPort(e.target.value)}
                                />

                                <button className="login-button" onClick={handleLogin}>
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    )
;

BackgroundBeams.displayName = "BackgroundBeams";