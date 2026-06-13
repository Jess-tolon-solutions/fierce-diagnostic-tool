"use client";

export function ConfirmationStage({
  contactName,
  submitState,
  onRetry,
}: {
  contactName: string;
  submitState: "sending" | "ok" | "error";
  onRetry: () => void;
}) {
  const firstName = contactName.split(" ")[0] || "there";

  if (submitState === "sending") {
    return (
      <div className="stage-enter max-w-2xl mx-auto pt-12 text-center">
        <div className="inline-block w-10 h-10 rounded-full border-2 border-fierce-orange/30 border-t-fierce-orange animate-spin mb-6" />
        <p className="text-fierce-cream/70">Saving your answers...</p>
      </div>
    );
  }

  if (submitState === "error") {
    return (
      <div className="stage-enter max-w-2xl mx-auto pt-12 text-center">
        <p className="text-fierce-orange text-xs font-bold tracking-[0.25em] uppercase mb-3">
          Something Went Wrong
        </p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
          We couldn&apos;t save your answers.
        </h2>
        <p className="text-fierce-cream/70 mb-8 leading-relaxed">
          Your answers are still here in this browser. Try once more, and if it
          keeps failing, email{" "}
          <span className="text-fierce-orange">fierceoperations@fierceinc.com</span>{" "}
          and we&apos;ll reach out directly.
        </p>
        <button
          onClick={onRetry}
          className="btn-fierce bg-fierce-gradient text-fierce-black font-bold tracking-wide px-8 py-3.5 rounded-full"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="stage-enter max-w-3xl mx-auto pt-4">
      <p className="text-fierce-orange text-xs font-bold tracking-[0.25em] uppercase mb-3">
        We Got It
      </p>

      <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-6">
        Thanks, {firstName}.{" "}
        <span className="headline-accent">We&apos;re reviewing your answers.</span>
      </h2>

      <p className="text-fierce-cream/75 text-base md:text-lg leading-relaxed mb-10">
        An expert from our team will reach out within{" "}
        <span className="text-fierce-cream font-semibold">24 hours</span> to
        walk you through what we recommend for your team.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <NextStep
          number="01"
          title="We review your answers"
          body="We pinpoint the conversations your team isn't having and the modules that best fit what you're navigating."
        />
        <NextStep
          number="02"
          title="We reach out"
          body="Within 24 hours, an expert from our team gets in touch with the recommendation and answers whatever's on your mind."
        />
        <NextStep
          number="03"
          title="You decide what's next"
          body="Together we land on the right format and the best next step for your team — an honest conversation, not a sales pitch."
        />
      </div>

      <div className="text-center text-fierce-cream/40 text-sm">
        Need to reach us sooner? Email{" "}
        <span className="text-fierce-orange">fierceoperations@fierceinc.com</span>.
      </div>
    </div>
  );
}

function NextStep({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="card-glow rounded-xl p-5 bg-fierce-ink/40 backdrop-blur-sm">
      <p className="text-fierce-orange font-mono text-xs tracking-widest mb-2">
        {number}
      </p>
      <p className="font-bold text-fierce-cream mb-1.5">{title}</p>
      <p className="text-sm text-fierce-cream/60 leading-relaxed">{body}</p>
    </div>
  );
}
