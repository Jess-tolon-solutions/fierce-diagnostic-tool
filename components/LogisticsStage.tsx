"use client";

import { useState } from "react";
import type { ScopeAnswers } from "@/lib/types";

const FORMAT_OPTIONS = [
  {
    value: "In-person",
    title: "In-person",
    body: "On-site, at your location.",
  },
  {
    value: "Virtual",
    title: "Virtual",
    body: "Live and facilitated online. Same depth, delivered remotely.",
  },
  {
    value: "Not sure yet",
    title: "Not sure yet",
    body: "Help us recommend the right format based on your situation.",
  },
] as const;

export function LogisticsStage({
  initialScope,
  onSubmit,
  onBack,
}: {
  initialScope?: ScopeAnswers;
  onSubmit: (scope: ScopeAnswers) => void;
  onBack: () => void;
}) {
  const [format, setFormat] = useState<string>(initialScope?.format ?? "");
  const [window, setWindow] = useState<string>(
    initialScope?.preferredWindow ?? ""
  );
  const [notes, setNotes] = useState<string>(initialScope?.notes ?? "");

  const valid = format.length > 0 && window.length > 0;

  return (
    <div className="stage-enter max-w-2xl mx-auto pt-8 pb-12">
      <p className="text-fierce-orange text-xs font-bold tracking-[0.25em] uppercase mb-3">
        One last thing
      </p>

      <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-[1.1] fierce-underline pb-3">
        A few details before we land this.
      </h2>

      <p className="text-fierce-cream/60 text-base md:text-lg mt-6 leading-relaxed">
        We&apos;ve got what we need to make a recommendation. A couple more
        details help us land on the right format and timing for your team.
      </p>

      <div className="mt-10 space-y-8">
        <div>
          <p className="text-xs font-bold tracking-widest text-fierce-cream/50 uppercase mb-3">
            How would you want to run it?
          </p>
          <div className="grid grid-cols-1 gap-3">
            {FORMAT_OPTIONS.map((opt) => {
              const selected = format === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormat(opt.value)}
                  className={`chip card-glow text-left px-5 py-4 rounded-xl ${
                    selected ? "selected" : ""
                  }`}
                >
                  <p className="font-bold text-fierce-cream text-base leading-tight">
                    {opt.title}
                  </p>
                  <p className="text-sm text-fierce-cream/70 mt-1 leading-relaxed">
                    {opt.body}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold tracking-widest text-fierce-cream/50 uppercase mb-3">
            When are you hoping to run it?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "Next 2 weeks",
              "This month",
              "Next month",
              "This quarter",
              "Next quarter",
              "Flexible",
            ].map((w) => (
              <button
                key={w}
                onClick={() => setWindow(w)}
                className={`chip card-glow text-sm py-2.5 px-3 rounded-lg ${
                  window === w ? "selected" : ""
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold tracking-widest text-fierce-cream/50 uppercase mb-3">
            Anything else we should know?{" "}
            <span className="opacity-50 font-medium">(optional)</span>
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="fierce-input card-glow w-full px-5 py-4 rounded-xl text-fierce-cream text-base leading-relaxed resize-none"
            placeholder="A specific outcome you're after, a sensitive topic to avoid, an executive sponsor we should know about..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-12">
        <button
          onClick={onBack}
          className="text-fierce-cream/50 hover:text-fierce-cream/80 text-sm font-medium"
        >
          ← Back
        </button>
        <button
          onClick={() =>
            valid &&
            onSubmit({
              format,
              preferredWindow: window,
              notes: notes.trim(),
            })
          }
          disabled={!valid}
          className="btn-fierce bg-fierce-gradient text-fierce-black font-bold tracking-wide px-8 py-3.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Submit →
        </button>
      </div>
    </div>
  );
}
