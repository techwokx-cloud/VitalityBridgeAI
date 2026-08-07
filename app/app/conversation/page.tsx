"use client";

import { useState, useRef, useEffect } from "react";
import { MiniRobot } from "@/components/robot/mini-robot";

type CompanionState = "idle" | "listening" | "thinking" | "speaking";

export default function ConversationPage() {
  const [companionState, setCompanionState] = useState<CompanionState>("idle");
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [mood, setMood] = useState(1);
  const moods = ["😢", "😐", "🙂", "😊", "🤗"];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setCompanionState("thinking");
    setTimeout(() => {
      setCompanionState("idle");
    }, 1500);
    setInputValue("");
  };

  const handleStartRecording = () => {
    setIsListening(true);
    setCompanionState("listening");
  };

  const handleStopRecording = () => {
    setIsListening(false);
    setCompanionState("thinking");
    setTimeout(() => {
      setInputValue(
        "I guess I could just ask before I decide, instead of after."
      );
      setCompanionState("idle");
    }, 800);
  };

  return (
    <div className="flex min-h-full bg-[#fbf9fc]">
      {/* MAIN CONVERSATION */}
      <div className="flex-1 border-r border-[#e8e1ed] px-8 py-6">
        {/* TOPIC HEADER */}
        <div className="mb-6 flex items-center justify-between border-b border-[#e8e1ed] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#7d748e]">
              Talking about
            </p>
            <h1 className="text-2xl font-medium text-[#302842]">
              Partner & money
            </h1>
          </div>
          <button className="text-sm text-[#6d5ef8] font-medium">
            Change topic ✎
          </button>
        </div>

        {/* ROBOT + REFLECTION */}
        <div className="mb-8 flex gap-8">
          {/* ROBOT */}
          <div className="flex flex-col items-center">
            <MiniRobot state={companionState} size="md" showExpression={true} />
            <p className="mt-3 text-xs text-[#7d748e]">
              {companionState === "listening" && "Listening..."}
              {companionState === "thinking" && "Thinking..."}
              {companionState === "speaking" && "Speaking..."}
              {companionState === "idle" && "Ready"}
            </p>
          </div>

          {/* REFLECTION BOX */}
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#e8a2c1] via-[#b58ad4] to-[#7760bb] p-8 text-white">
            <p className="text-xs opacity-80">VitalityBridge • just now</p>
            <h2 className="mt-4 font-serif text-3xl font-medium leading-tight">
              What would it look like to ask her opinion earlier next time?
            </h2>
          </div>
        </div>

        {/* USER THOUGHT */}
        <div className="mb-8 flex items-start gap-3 rounded-2xl bg-[#faf7fc] border border-[#eee7f1] p-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e8a2c1] to-[#b58ad4] text-sm text-white">
            ◡
          </div>
          <div>
            <p className="text-sm text-[#554d67]">
              "I guess I could just ask before I decide, instead of after."
            </p>
            <p className="mt-1 text-xs text-[#7d748e]">You • a moment ago</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-8 grid grid-cols-4 gap-3">
          {[
            ["✏️", "Put it in words"],
            ["🌱", "Sit with it"],
            ["🎯", "Practice it"],
            ["🔄", "Change topic"],
          ].map(([icon, label]) => (
            <button
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[#e8e1ed] bg-white p-4 text-center text-xs font-medium text-[#544a66] transition hover:bg-[#fbf8fe]"
            >
              <span className="text-xl">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* VOICE INPUT */}
        <div className="space-y-4">
          <button
            onMouseDown={handleStartRecording}
            onMouseUp={handleStopRecording}
            className={`w-full rounded-full py-4 font-semibold transition ${
              isListening
                ? "bg-red-500 text-white"
                : "bg-gradient-to-r from-[#d943a1] to-[#6d5ef8] text-white"
            }`}
          >
            {isListening ? "■ Listening — tap to stop" : "◉ Speak your reply"}
          </button>
          <button className="block w-full text-center text-xs text-[#9a91a3]">
            or type instead
          </button>
        </div>

        {/* TEXT INPUT */}
        <div className="mt-6 flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type here..."
            className="flex-1 rounded-full border border-[#ddd5e8] bg-[#f8f6fb] px-5 py-3 text-sm focus:outline-none focus:border-[#6d5ef8]"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="rounded-full bg-[#6d5ef8] px-6 py-3 text-white font-medium transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {/* RIGHT CONTEXT PANEL */}
      <aside className="w-80 space-y-4 overflow-auto bg-[#fbf9fc] p-6">
        {/* COMPANION STATUS */}
        <div className="rounded-2xl bg-white border border-[#e8e1ed] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7d748e]">
            Companion
          </p>
          <p className="mt-3 text-sm font-medium text-[#6d5ef8]">Listening</p>
          <p className="text-xs text-[#7d748e]">I&apos;m here with you.</p>
        </div>

        {/* THINGS I'M NOTICING */}
        <div className="rounded-2xl bg-white border border-[#e8e1ed] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7d748e]">
            Things I'm noticing
          </p>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex gap-2">
              <span className="text-sm">💬</span>
              <p className="text-[#554d67]">Communication keeps appearing in our talks.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-sm">💰</span>
              <p className="text-[#554d67]">Money decisions feel stressful when they happen quickly.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-sm">✨</span>
              <p className="text-[#554d67]">You usually feel better after discussing things first.</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#7d748e]">These are patterns, not labels.</p>
        </div>

        {/* CURRENT JOURNEY */}
        <div className="rounded-2xl bg-white border border-[#e8e1ed] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7d748e]">
            Current journey
          </p>
          <h3 className="mt-3 font-medium text-[#302842]">Partner & Money</h3>
          <p className="mt-1 text-xs text-[#7d748e]">Started yesterday</p>
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-[#302842]">Next step</p>
            <p className="text-xs text-[#7d748e]">Practice the conversation</p>
          </div>
          <button className="mt-4 w-full rounded-full border border-[#6d5ef8] bg-white px-4 py-2 text-xs font-medium text-[#6d5ef8] transition hover:bg-[#f8f4fc]">
            Continue thread →
          </button>
        </div>

        {/* MOOD SELECTOR */}
        <div className="rounded-2xl bg-white border border-[#e8e1ed] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7d748e]">
            Your mood
          </p>
          <p className="mt-2 text-sm font-medium text-[#302842]">How are you feeling?</p>
          <div className="mt-3 flex justify-between">
            {moods.map((m, i) => (
              <button
                key={i}
                onClick={() => setMood(i)}
                className={`text-2xl transition ${mood === i ? "scale-125" : ""}`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#7d748e]">You're feeling thoughtful.</p>
        </div>
      </aside>
    </div>
  );
}

