"use client";

import { useState, useEffect } from "react";

interface MiniRobotProps {
  state?: "idle" | "listening" | "thinking" | "speaking" | "happy";
  size?: "sm" | "md" | "lg";
  showExpression?: boolean;
}

export function MiniRobot({
  state = "idle",
  size = "md",
  showExpression = true,
}: MiniRobotProps) {
  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  return (
    <div
      className={`${sizeMap[size]} relative flex items-center justify-center`}
      style={{
        animation:
          state === "speaking"
            ? "robotBounce 0.6s ease-in-out infinite"
            : state === "listening"
              ? "robotListening 1s ease-in-out infinite"
              : "robotFloat 3s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes robotFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes robotBounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes robotListening {
          0%, 100% {
            transform: rotateZ(0deg);
          }
          25% {
            transform: rotateZ(-5deg);
          }
          75% {
            transform: rotateZ(5deg);
          }
        }

        @keyframes robotPulse {
          0%, 100% {
            r: 6;
            filter: drop-shadow(0 0 8px rgba(40, 184, 196, 0.6));
          }
          50% {
            r: 8;
            filter: drop-shadow(0 0 15px rgba(40, 184, 196, 0.9));
          }
        }

        .chest-light-mini {
          animation: robotPulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <svg
        viewBox="0 0 80 100"
        className="w-full h-full"
        style={{
          filter: "drop-shadow(0 8px 12px rgba(99, 70, 160, 0.15))",
        }}
      >
        <defs>
          <linearGradient
            id="miniHeadGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e9e4f1" />
          </linearGradient>
          <linearGradient
            id="miniBodyGrad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f7f4fa" />
            <stop offset="100%" stopColor="#e9e4f1" />
          </linearGradient>
        </defs>

        {/* Head */}
        <rect
          x="20"
          y="8"
          width="40"
          height="28"
          rx="8"
          fill="url(#miniHeadGrad)"
          stroke="#d9d1e6"
          strokeWidth="1"
        />

        {/* Antenna */}
        <line
          x1="40"
          y1="4"
          x2="40"
          y2="10"
          stroke="#7a58cc"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="40" cy="3" r="2.5" fill="#b96fe1" />

        {/* Face screen */}
        <rect
          x="24"
          y="12"
          width="32"
          height="18"
          rx="6"
          fill="#322a4b"
        />

        {/* Eyes */}
        <circle cx="32" cy="18" r="2.5" fill="#c99af1" />
        <circle cx="48" cy="18" r="2.5" fill="#c99af1" />

        {/* Eye shine */}
        <circle cx="32" cy="17.5" r="0.8" fill="#ffffff" opacity="0.7" />
        <circle cx="48" cy="17.5" r="0.8" fill="#ffffff" opacity="0.7" />

        {/* Mouth - changes based on state */}
        {state === "speaking" && (
          <>
            <ellipse cx="40" cy="26" rx="1.5" ry="2" fill="#c99af1" />
          </>
        )}
        {state === "listening" && (
          <path
            d="M 36 26 Q 40 28 44 26"
            stroke="#c99af1"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {state === "happy" && (
          <path
            d="M 36 25 Q 40 27 44 25"
            stroke="#c99af1"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {(state === "idle" || state === "thinking") && (
          <path
            d="M 36 26 L 44 26"
            stroke="#c99af1"
            strokeWidth="1"
            strokeLinecap="round"
          />
        )}

        {/* Body */}
        <rect
          x="24"
          y="38"
          width="32"
          height="32"
          rx="8"
          fill="url(#miniBodyGrad)"
          stroke="#d0c7df"
          strokeWidth="1"
        />

        {/* Chest light */}
        {showExpression && (
          <circle
            cx="40"
            cy="50"
            r="6"
            fill="#78d8d5"
            className="chest-light-mini"
          />
        )}

        {/* Arms - simple */}
        <rect
          x="18"
          y="44"
          width="4"
          height="16"
          rx="2"
          fill="#e2dbea"
          stroke="#cec4dd"
          strokeWidth="0.5"
        />
        <rect
          x="58"
          y="44"
          width="4"
          height="16"
          rx="2"
          fill="#e2dbea"
          stroke="#cec4dd"
          strokeWidth="0.5"
        />

        {/* Legs */}
        <rect
          x="28"
          y="72"
          width="6"
          height="12"
          rx="3"
          fill="#e2dbea"
          stroke="#cec4dd"
          strokeWidth="0.5"
        />
        <rect
          x="46"
          y="72"
          width="6"
          height="12"
          rx="3"
          fill="#e2dbea"
          stroke="#cec4dd"
          strokeWidth="0.5"
        />

        {/* Feet */}
        <ellipse cx="31" cy="85" rx="3" ry="2" fill="#d0c7df" />
        <ellipse cx="49" cy="85" rx="3" ry="2" fill="#d0c7df" />
      </svg>
    </div>
  );
}
