"use client";

import Link from "next/link";
import { useState } from "react";

const domains = [
  {
    id: "personal",
    icon: "♡",
    title: "Personal",
    description: "Relationships, feelings, decisions",
    color: "bg-[#f2b7c9]",
  },
  {
    id: "family",
    icon: "⌂",
    title: "Family & Parenting",
    description: "Parenting, family matters, children",
    color: "bg-[#a6d5d2]",
  },
  {
    id: "work",
    icon: "○",
    title: "Work",
    description: "Career, boss, team & workplace",
    color: "bg-[#5eb3d6]",
  },
  {
    id: "friendships",
    icon: "◌",
    title: "Friendships",
    description: "Friends, trust, conflict",
    color: "bg-[#b9a5df]",
  },
  {
    id: "other",
    icon: "✦",
    title: "Other",
    description: "Anything else on your mind",
    color: "bg-[#f5d67a]",
  },
];

const focusTasks = [
  { id: 1, task: "Write down what matters most", time: "5 min", done: false },
  { id: 2, task: "Practice your conversation", time: "10 min", done: false },
  { id: 3, task: "Take one real step", time: "Today", done: false },
];

const journeyItems = [
  {
    id: 1,
    title: "Talking to my partner about money",
    lastUpdated: "Last updated 2 hours ago",
    type: "continue",
  },
  {
    id: 2,
    title: "Prepare for a difficult conversation",
    description: "Get ready with confidence",
    type: "suggested",
  },
];

export default function DashboardPage() {
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set());

  const toggleTask = (id: number) => {
    const newChecked = new Set(checkedTasks);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedTasks(newChecked);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#625d73]">
            🌙 Good evening, George
          </p>
          <h1 className="mt-1 font-serif text-3xl font-medium">
            You&apos;re not alone.
          </h1>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="text-right">
            <div className="text-2xl">🔥</div>
            <div className="text-xs text-[#625d73]">Streak</div>
            <div className="font-semibold">3 days</div>
          </div>

          <button className="rounded-full bg-white p-3 text-lg shadow-sm">
            🔔
          </button>

          <button className="rounded-full bg-white p-3 text-lg shadow-sm">
            ⚙️
          </button>
        </div>
      </div>

      {/* HERO CARD */}
      <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#e9d5ff] via-[#d4b3ff] to-[#a78bfa] p-8 text-white">
        <h2 className="font-serif text-3xl font-semibold">
          Let&apos;s navigate this together.
        </h2>

        <p className="mt-3 max-w-md text-sm text-white/90">
          Share what&apos;s on your mind, and I&apos;ll help you make sense of
          it and find your next step.
        </p>

        <Link
          href="/app/conversation"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#7c3aed] transition hover:scale-105"
        >
          💬 Start a Conversation
        </Link>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* TODAY'S FOCUS */}
          <div className="rounded-[24px] border border-[#ebe5ef] bg-white p-6">
            <h3 className="font-semibold text-[#191735]">Today&apos;s Focus</h3>

            <p className="mt-1 text-sm text-[#706a7e]">
              Small steps today create a better tomorrow.
            </p>

            <div className="mt-6 space-y-3">
              {focusTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg bg-[#f6efff] p-4 transition hover:bg-[#ede4ff]"
                >
                  <input
                    type="checkbox"
                    checked={checkedTasks.has(task.id)}
                    onChange={() => toggleTask(task.id)}
                    className="h-5 w-5 rounded border-[#c8b8e0] text-[#6845d8]"
                  />

                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        checkedTasks.has(task.id)
                          ? "line-through text-[#a89ab3]"
                          : "text-[#403b52]"
                      }`}
                    >
                      {task.task}
                    </p>
                  </div>

                  <span className="text-xs text-[#9a91a3]">{task.time}</span>
                </div>
              ))}
            </div>

            <Link
              href="/app/7day-plan"
              className="mt-4 inline-flex text-sm font-medium text-[#6845d8] transition hover:underline"
            >
              View 7-Day Plan →
            </Link>
          </div>

          {/* LIFE MAP DOMAINS */}
          <div>
            <h3 className="font-semibold text-[#191735]">
              How can I help you today?
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {domains.map((domain) => (
                <Link
                  key={domain.id}
                  href={`/app/conversation?domain=${domain.id}`}
                  className="group overflow-hidden rounded-[20px] border border-[#ebe5ef] bg-white p-6 transition hover:shadow-lg hover:shadow-purple-100"
                >
                  <div className="text-3xl">{domain.icon}</div>

                  <h4 className="mt-3 font-semibold text-[#191735]">
                    {domain.title}
                  </h4>

                  <p className="mt-1 text-sm text-[#706a7e]">
                    {domain.description}
                  </p>

                  <div className="mt-4 flex items-center text-xs font-medium text-[#6845d8] transition group-hover:translate-x-1">
                    Start talking →
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* YOUR JOURNEY */}
          <div>
            <h3 className="font-semibold text-[#191735]">Your Journey</h3>

            <div className="mt-4 space-y-3">
              {journeyItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-[20px] border border-[#ebe5ef] bg-white p-4 transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {item.type === "continue" ? "⭐" : "💡"}
                    </span>

                    <div>
                      <p className="font-medium text-[#403b52]">
                        {item.title}
                      </p>

                      {item.type === "continue" ? (
                        <p className="text-xs text-[#9a91a3]">
                          {item.lastUpdated}
                        </p>
                      ) : (
                        <p className="text-xs text-[#9a91a3]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-lg">→</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* PROGRESS CARD */}
          <div className="rounded-[24px] border border-[#ebe5ef] bg-white p-6">
            <h3 className="font-semibold text-[#191735]">Your Progress</h3>

            <p className="mt-1 text-sm text-[#706a7e]">
              Conversations this week
            </p>

            <div className="mt-6 text-center">
              <div className="font-serif text-4xl font-semibold text-[#6845d8]">
                4
              </div>

              <p className="mt-2 text-xs text-[#9a91a3]">Keep the streak going</p>
            </div>

            {/* MINI CHART */}
            <div className="mt-6 flex items-end justify-between gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, i) => (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <div
                      className="w-3 rounded-full bg-[#6845d8] transition"
                      style={{
                        height: `${[2, 3, 1, 4, 2, 0, 0][i] * 12}px`,
                      }}
                    />

                    <span className="text-[9px] text-[#9a91a3]">{day}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* INSIGHT CARD */}
          <div className="rounded-[24px] border border-[#ebe5ef] bg-gradient-to-br from-[#f6efff] to-[#ede4ff] p-6">
            <div className="text-2xl">💭</div>

            <p className="mt-4 font-serif text-lg text-[#403b52]">
              It&apos;s okay to have hard days. You&apos;re here, and that
              matters.
            </p>
          </div>

          {/* PRIVACY CARD */}
          <div className="rounded-[24px] border border-[#ebe5ef] bg-white p-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <p className="text-sm font-medium text-[#403b52]">
                Your space is private and safe
              </p>
            </div>

            <p className="mt-2 text-xs text-[#706a7e]">
              Everything you share stays between us.
            </p>

            <Link
              href="/app/privacy"
              className="mt-3 inline-flex text-xs font-medium text-[#6845d8] transition hover:underline"
            >
              Private by design →
            </Link>
          </div>

          {/* JUST TALK BUTTON */}
          <button className="w-full rounded-[20px] border-2 border-[#6845d8] bg-white p-4 font-semibold text-[#6845d8] transition hover:bg-[#f0e9ff]">
            ❤️ Just Talk
          </button>

          <p className="text-center text-xs text-[#9a91a3]">
            Sometimes you just need someone to listen. I&apos;m here for you.
          </p>
        </div>
      </div>
    </div>
  );
}
