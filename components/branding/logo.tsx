"use client";

export function VitalityBridgeLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`${sizeMap[size]} relative flex items-center justify-center`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for heart */}
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B4A" /> {/* Orange */}
            <stop offset="50%" stopColor="#FF4A7F" /> {/* Pink */}
            <stop offset="100%" stopColor="#6D5EF8" /> {/* Purple */}
          </linearGradient>

          {/* Gradient for bridge */}
          <linearGradient
            id="bridgeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" opacity="0.95" />
            <stop offset="100%" stopColor="#F5F1FF" opacity="0.95" />
          </linearGradient>

          {/* Filter for shadow */}
          <filter id="logoShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodOpacity="0.15"
            />
          </filter>
        </defs>

        {/* Heart shape background */}
        <path
          d="M50,95 C25,75 10,60 10,45 C10,30 20,20 30,20 C35,20 42,25 50,32 C58,25 65,20 70,20 C80,20 90,30 90,45 C90,60 75,75 50,95 Z"
          fill="url(#heartGradient)"
          filter="url(#logoShadow)"
        />

        {/* Bridge structure inside heart */}
        <g opacity="0.95">
          {/* Left tower */}
          <rect
            x="28"
            y="35"
            width="4"
            height="25"
            fill="url(#bridgeGradient)"
            rx="2"
          />

          {/* Right tower */}
          <rect
            x="68"
            y="35"
            width="4"
            height="25"
            fill="url(#bridgeGradient)"
            rx="2"
          />

          {/* Bridge deck - curved */}
          <path
            d="M 32 45 Q 50 40 68 45"
            stroke="url(#bridgeGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Support cables */}
          <path
            d="M 32 45 L 40 55 M 68 45 L 60 55"
            stroke="url(#bridgeGradient)"
            strokeWidth="2"
            opacity="0.7"
            strokeLinecap="round"
          />
        </g>

        {/* Glow effect */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#heartGradient)"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}

export function VitalityBridgeWordmark() {
  return (
    <div className="flex items-baseline gap-1">
      <span className="font-serif text-xl font-semibold">
        <span className="text-[#FF6B4A]">Vitality</span>
        <span className="text-[#6D5EF8]">Bridge</span>
      </span>
    </div>
  );
}

export function VitalityBridgeLogotype() {
  return (
    <div className="flex items-center gap-3">
      <VitalityBridgeLogo size="md" />
      <div>
        <VitalityBridgeWordmark />
        <p className="text-[10px] text-[#7d748e]">
          AI for life's real moments
        </p>
      </div>
    </div>
  );
}
