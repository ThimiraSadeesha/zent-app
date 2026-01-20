"use client";

import React, { useMemo } from "react";

interface BackgroundBeamsProps {
    className?: string;
}

export const BackgroundBeams = React.memo<BackgroundBeamsProps>(
    ({ className = "" }) => {
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
                return { duration, delay };
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
                        position: absolute;
                        top: 1rem;
                        right: 1rem;
                        height: 40rem;
                        width: 30rem;
                        border-radius: 0.375rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10;
                        background: rgba(0, 0, 0, 0.6);
                        backdrop-filter: blur(10px);
                    }

                    .content-wrapper {
                        width: 100%;
                        padding: 1.5rem;
                    }

                    .title {
                        text-align: center;
                        font-size: 2.5rem;
                        font-weight: 700;
                        background: linear-gradient(to bottom, #e5e5e5, #737373);
                        -webkit-background-clip: text;
                        background-clip: text;
                        color: transparent;
                    }

                    .description {
                        text-align: center;
                        color: #737373;
                        margin: 1rem 0;
                    }

                    .input-field {
                        width: 100%;
                        margin-top: 0.75rem;
                        padding: 0.75rem 1rem;
                        border-radius: 0.5rem;
                        border: 1px solid #262626;
                        background: #0a0a0a;
                        color: white;
                    }

                    .login-button {
                        width: 100%;
                        margin-top: 1rem;
                        padding: 0.75rem;
                        border-radius: 0.5rem;
                        border: 1px solid #14b8a6;
                        background: #14b8a6;
                        color: #0a0a0a;
                        font-weight: 600;
                        cursor: pointer;
                    }
                `}</style>

                <div className={`beams-container ${className}`}>
                    <svg
                        className="beams-svg"
                        viewBox="0 0 696 316"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {paths.map((path, index) => (
                            <path
                                key={index}
                                d={path}
                                stroke={`url(#linearGradient-${index})`}
                                className="animated-path"
                            />
                        ))}

                        <defs>
                            {paths.map((_, index) => {
                                const { duration, delay } = gradients[index];

                                return (
                                    <linearGradient
                                        key={index}
                                        id={`linearGradient-${index}`}
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
                                        <stop stopColor="#6344F5" />
                                        <stop stopColor="#AE48FF" stopOpacity="0" />
                                    </linearGradient>
                                );
                            })}
                        </defs>
                    </svg>

                    <div className="demo-container">
                        <div className="content-wrapper">
                            <h1 className="title">Z E N T</h1>
                            <p className="description">
                                Monitor servers, track resources, and manage Docker containers.
                            </p>

                            <input className="input-field" placeholder="Host" />
                            <input className="input-field" placeholder="Username" />
                            <input
                                className="input-field"
                                type="password"
                                placeholder="Password"
                            />
                            <input className="input-field" placeholder="Port" />

                            <button className="login-button">Login</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
);

BackgroundBeams.displayName = "BackgroundBeams";
