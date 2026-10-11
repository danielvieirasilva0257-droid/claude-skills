"use client";

import * as React from "react";
import { Compose, type ComposeMention, type ComposeCommand } from "@/components/ui/compose";

const AVATAR_BG = "e8b84b,4c8c9b,c0532f,8e7cc3,3f7f6f,d98b8b";
const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
    seed,
  )}&backgroundColor=${AVATAR_BG}&backgroundType=solid&radius=50&scale=115`;

const MENTIONS: ComposeMention[] = [
  { id: "laziedev", label: "laziedev", sublabel: "you · founder", avatar: avatarUrl("laziedev") },
  { id: "shiawase", label: "shiawase", sublabel: "design", avatar: avatarUrl("shiawase22") },
  { id: "khushi", label: "khushi", sublabel: "engineering", avatar: avatarUrl("khushi") },
];

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const COMMANDS: ComposeCommand[] = [
  {
    id: "summarize",
    label: "summarize",
    hint: "Condense the thread",
    icon: (
      <svg {...iconProps}>
        <circle cx="4.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
        <path d="M8 7h12" />
        <circle cx="4.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
        <path d="M8 12h9" />
        <circle cx="4.5" cy="17" r="1.1" fill="currentColor" stroke="none" />
        <path d="M8 17h6" />
      </svg>
    ),
  },
  {
    id: "rewrite",
    label: "rewrite",
    hint: "Improve tone & clarity",
    icon: (
      <svg {...iconProps}>
        <path d="M15.5 5.5 18.5 8.5" />
        <path d="M13.5 3.5a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8L8 17.2l-3.7.9.9-3.7z" />
        <path d="M4.3 18.1 20 18.1" />
      </svg>
    ),
  },
  {
    id: "translate",
    label: "translate",
    hint: "To another language",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17" />
        <path d="M12 3.5c2.3 2.3 3.5 5.3 3.5 8.5s-1.2 6.2-3.5 8.5c-2.3-2.3-3.5-5.3-3.5-8.5s1.2-6.2 3.5-8.5z" />
      </svg>
    ),
  },
  {
    id: "todo",
    label: "todo",
    hint: "Create a task",
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="5" width="16" height="16" rx="3.2" />
        <path d="M9 2.8h6a1 1 0 0 1 1 1V6a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1z" fill="currentColor" stroke="none" />
        <path d="M8.5 14l2.3 2.3 4.7-5" />
      </svg>
    ),
  },
  {
    id: "remind",
    label: "remind",
    hint: "Set a reminder",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="13" r="7.5" />
        <path d="M12 9.5V13l2.3 1.6" />
        <path d="M4.5 4 2.3 6" />
        <path d="M19.5 4l2.2 2" />
      </svg>
    ),
  },
];

export default function ComposeDemo() {
  const [sent, setSent] = React.useState<string[]>([]);

  return (
    <div className="flex min-h-[560px] w-full items-center justify-center bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="w-full max-w-[540px]">
        {sent.length > 0 && (
          <div className="mb-4 space-y-2">
            {sent.map((m, i) => (
              <div
                key={i}
                className="ml-auto max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-zinc-900 px-3.5 py-2 text-[14px] text-white dark:bg-white dark:text-zinc-900"
              >
                {m}
              </div>
            ))}
          </div>
        )}
        <Compose
          mentions={MENTIONS}
          commands={COMMANDS}
          maxLength={500}
          defaultValue="Kicking off the redesign - @shiawase can you /summarize the thread for @khushi?"
          placeholder="Message your team…  press @ to mention, / for commands"
          onSubmit={(v) => setSent((s) => [...s, v])}
          onCommand={(c) => console.log("command:", c.label)}
          aria-label="Team message"
        />
      </div>
    </div>
  );
}
