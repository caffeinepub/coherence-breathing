import {
  Activity,
  ArrowLeft,
  Brain,
  ChevronRight,
  Heart,
  Wind,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type View = "home" | "session" | "completion";
type BreathPhase = "inhale" | "exhale";

interface SessionConfig {
  durationMs: number;
  label: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const INHALE_MS = 5500;
const PHASE_DURATION = INHALE_MS; // inhale and exhale have the same duration

const SESSION_OPTIONS: SessionConfig[] = [
  { durationMs: 5 * 60 * 1000, label: "5 min" },
  { durationMs: 10 * 60 * 1000, label: "10 min" },
  { durationMs: 20 * 60 * 1000, label: "20 min" },
];

// ─── Haptics ─────────────────────────────────────────────────────────────────

function vibrate(pattern: number | number[]) {
  try {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Ignore if API not available
  }
}

// ─── Format time ─────────────────────────────────────────────────────────────

function formatTime(ms: number): string {
  const totalSecs = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSecs / 60);
  const seconds = totalSecs % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ─── HomeView ────────────────────────────────────────────────────────────────

function HomeView({ onStart }: { onStart: (config: SessionConfig) => void }) {
  const benefits = [
    {
      icon: Heart,
      title: "Heart Rate Variability",
      description:
        "Coherence breathing synchronises your heartbeat with your breath, dramatically improving HRV — a key biomarker of cardiovascular health and resilience.",
    },
    {
      icon: Brain,
      title: "Stress Reduction",
      description:
        "By activating the parasympathetic nervous system, this rhythm dissolves cortisol-driven tension and quiets the stress response in minutes.",
    },
    {
      icon: Wind,
      title: "Nervous System Balance",
      description:
        "The 5.5-second rhythm is the resonant frequency of the human body — it creates coherence between brain, heart, and body, restoring autonomic balance.",
    },
    {
      icon: Activity,
      title: "Cardiovascular Benefits",
      description:
        "Regular practice lowers blood pressure, improves circulation, and strengthens baroreflex sensitivity — the body's own blood pressure regulator.",
    },
  ];

  return (
    <div data-ocid="home.page" className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        {/* Subtle mesh gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.78 0.10 210 / 0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-2xl mx-auto px-6 pt-16 pb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Decorative breath ring icon */}
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: "oklch(0.65 0.13 200 / 0.6)",
                  background:
                    "radial-gradient(circle, oklch(0.72 0.12 195 / 0.12), oklch(0.48 0.14 220 / 0.06))",
                  boxShadow: "0 0 20px oklch(0.65 0.14 200 / 0.25)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.72 0.12 195 / 0.5), oklch(0.55 0.14 220 / 0.3))",
                  }}
                />
              </div>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl font-semibold tracking-tight mb-3"
              style={{ color: "oklch(0.22 0.06 230)" }}
            >
              Coherence Breathing
            </h1>
            <p
              className="font-body text-lg leading-relaxed max-w-sm mx-auto"
              style={{ color: "oklch(0.48 0.07 230)" }}
            >
              Find your rhythm. 5.5 seconds in, 5.5 seconds out.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Session duration cards */}
      <main className="max-w-2xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <h2
            className="font-body text-sm font-semibold uppercase tracking-widest mb-4 text-center"
            style={{ color: "oklch(0.55 0.09 220)" }}
          >
            Choose your session
          </h2>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {SESSION_OPTIONS.map((opt, i) => {
              const ocidMap = [
                "session.5min.button",
                "session.10min.button",
                "session.20min.button",
              ];
              const minutes = opt.durationMs / 60000;
              const cycleCount = Math.round(opt.durationMs / 1000 / 11);

              return (
                <motion.button
                  key={opt.label}
                  data-ocid={ocidMap[i]}
                  onClick={() => onStart(opt)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.08,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex flex-col items-center justify-center rounded-2xl border px-4 py-6 sm:py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  style={{
                    background: "oklch(1 0 0 / 0.7)",
                    borderColor: "oklch(0.82 0.04 220)",
                    boxShadow: "0 2px 8px oklch(0.48 0.14 220 / 0.08)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "oklch(0.96 0.015 215)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "oklch(0.62 0.12 210)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 20px oklch(0.48 0.14 220 / 0.16)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "oklch(1 0 0 / 0.7)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "oklch(0.82 0.04 220)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 2px 8px oklch(0.48 0.14 220 / 0.08)";
                  }}
                >
                  <span
                    className="font-display text-3xl sm:text-4xl font-semibold leading-none mb-1"
                    style={{ color: "oklch(0.40 0.12 225)" }}
                  >
                    {minutes}
                  </span>
                  <span
                    className="font-body text-sm font-medium"
                    style={{ color: "oklch(0.52 0.07 225)" }}
                  >
                    minutes
                  </span>
                  <span
                    className="font-body text-xs mt-2 opacity-60"
                    style={{ color: "oklch(0.52 0.07 225)" }}
                  >
                    ~{cycleCount} cycles
                  </span>
                  <ChevronRight
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity"
                    style={{ color: "oklch(0.48 0.12 225)" }}
                  />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Info section */}
        <motion.section
          data-ocid="info.section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          className="mt-14"
        >
          <div className="text-center mb-8">
            <h2
              className="font-display text-2xl font-semibold mb-2"
              style={{ color: "oklch(0.22 0.06 230)" }}
            >
              Why coherence breathing?
            </h2>
            <p
              className="font-body text-base leading-relaxed"
              style={{ color: "oklch(0.48 0.07 230)" }}
            >
              Science-backed benefits of 5.5-second breathing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + i * 0.07,
                    ease: "easeOut",
                  }}
                  className="rounded-2xl border p-5"
                  style={{
                    background: "oklch(0.99 0.005 215 / 0.8)",
                    borderColor: "oklch(0.88 0.025 218)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                      style={{
                        background: "oklch(0.92 0.04 210)",
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: "oklch(0.42 0.13 220)" }}
                      />
                    </div>
                    <div>
                      <h3
                        className="font-body font-semibold text-sm mb-1"
                        style={{ color: "oklch(0.22 0.06 230)" }}
                      >
                        {benefit.title}
                      </h3>
                      <p
                        className="font-body text-sm leading-relaxed"
                        style={{ color: "oklch(0.48 0.07 228)" }}
                      >
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-14 text-center">
          <p
            className="font-body text-xs"
            style={{ color: "oklch(0.65 0.05 225)" }}
          >
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "oklch(0.55 0.10 220)" }}
            >
              Built with ♥ using caffeine.ai
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

// ─── SessionView ─────────────────────────────────────────────────────────────

function SessionView({
  config,
  onEnd,
  onComplete,
}: {
  config: SessionConfig;
  onEnd: () => void;
  onComplete: () => void;
}) {
  // Start as null so the circle renders at neutral scale before the first inhale transition
  const [phase, setPhase] = useState<BreathPhase | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(config.durationMs);

  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCompletedRef = useRef(false);
  // Keep stable refs to avoid effect re-runs
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clearAllTimers = useCallback(() => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  // Phase cycling — uses a ref-based recursive scheduler for stable closure
  const scheduleNextPhaseRef = useRef<
    ((currentPhase: BreathPhase) => void) | null
  >(null);
  scheduleNextPhaseRef.current = (currentPhase: BreathPhase) => {
    phaseTimerRef.current = setTimeout(() => {
      if (isCompletedRef.current) return;
      const nextPhase: BreathPhase =
        currentPhase === "inhale" ? "exhale" : "inhale";
      // Haptic: strong double-pulse for inhale, triple pulse for exhale
      if (nextPhase === "inhale") {
        vibrate([80, 60, 120]);
      } else {
        vibrate([120, 60, 80, 60, 80]);
      }
      setPhase(nextPhase);
      scheduleNextPhaseRef.current?.(nextPhase);
    }, PHASE_DURATION);
  };

  useEffect(() => {
    // Brief pause so circle renders at neutral, then trigger first inhale with full 5.5s transition
    const startDelay = setTimeout(() => {
      // Haptic for first inhale start
      vibrate([80, 60, 120]);
      setPhase("inhale");
      scheduleNextPhaseRef.current?.("inhale");
    }, 100);

    // Start countdown
    countdownRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 100;
        if (next <= 0) {
          isCompletedRef.current = true;
          if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
          if (countdownRef.current) clearInterval(countdownRef.current);
          // Defer onComplete to avoid state update during render
          setTimeout(() => onCompleteRef.current(), 50);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      clearTimeout(startDelay);
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const progress =
    ((config.durationMs - timeRemaining) / config.durationMs) * 100;

  return (
    <div
      data-ocid="session.page"
      className="min-h-screen flex flex-col items-center justify-between"
      style={{ background: "oklch(0.12 0.04 230)" }}
    >
      {/* Top: timer */}
      <div className="w-full flex items-center justify-between px-6 pt-8 pb-4">
        <button
          type="button"
          data-ocid="session.end_button"
          onClick={onEnd}
          className="flex items-center gap-1.5 font-body text-sm font-medium px-3 py-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2"
          style={{
            color: "oklch(0.55 0.07 220)",
            background: "oklch(0.20 0.05 228 / 0.6)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(0.75 0.09 215)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(0.55 0.07 220)";
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          End
        </button>

        <span
          data-ocid="session.timer"
          className="font-display text-3xl font-medium tabular-nums"
          style={{ color: "oklch(0.88 0.06 215)" }}
        >
          {formatTime(timeRemaining)}
        </span>

        <div className="w-16" aria-hidden="true" />
      </div>

      {/* Center: breathing circle */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
        {/* Outer ring */}
        <div className="relative flex items-center justify-center">
          {/* Ambient glow layer */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "280px",
              height: "280px",
              background:
                "radial-gradient(circle, oklch(0.55 0.14 210 / 0.08) 0%, transparent 70%)",
              transition: "opacity 5500ms ease-in-out",
              opacity: phase === "inhale" ? 1 : 0.4,
              // neutral phase falls through to 0.4 (same as exhale)
            }}
          />

          {/* Track ring */}
          <div
            className="absolute rounded-full border"
            style={{
              width: "220px",
              height: "220px",
              borderColor: "oklch(0.35 0.07 225 / 0.4)",
              borderStyle: "dashed",
            }}
          />

          {/* Main breathing circle */}
          <div
            className={`breath-circle rounded-full${phase ? ` ${phase}` : " neutral"}`}
            style={{
              width: "160px",
              height: "160px",
              background:
                "radial-gradient(circle at 35% 35%, oklch(0.72 0.16 195), oklch(0.52 0.18 220), oklch(0.38 0.16 240))",
            }}
          />
        </div>

        {/* Phase label */}
        <AnimatePresence mode="wait">
          {phase && (
            <motion.p
              key={phase}
              data-ocid="session.phase_label"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-display text-2xl font-medium tracking-wide"
              style={{
                color:
                  phase === "inhale"
                    ? "oklch(0.82 0.10 200)"
                    : "oklch(0.70 0.08 230)",
              }}
            >
              {phase === "inhale" ? "Inhale" : "Exhale"}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Subtle instruction */}
        <p
          className="font-body text-sm text-center max-w-xs leading-relaxed"
          style={{ color: "oklch(0.45 0.06 225)" }}
        >
          Breathe naturally, without strain
        </p>
      </div>

      {/* Bottom: progress */}
      <div className="w-full px-6 pb-10">
        <div
          data-ocid="session.progress"
          className="relative h-1.5 rounded-full overflow-hidden"
          style={{ background: "oklch(0.22 0.05 228)" }}
          role="progressbar"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label={`Session progress: ${Math.round(progress)}%`}
        >
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background:
                "linear-gradient(to right, oklch(0.55 0.14 220), oklch(0.72 0.16 195))",
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
        <p
          className="font-body text-xs mt-2 text-center"
          style={{ color: "oklch(0.40 0.05 225)" }}
        >
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  );
}

// ─── CompletionView ───────────────────────────────────────────────────────────

function CompletionView({
  config,
  onHome,
}: { config: SessionConfig; onHome: () => void }) {
  const minutes = config.durationMs / 60000;

  return (
    <div
      data-ocid="completion.page"
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "oklch(0.12 0.04 230)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex flex-col items-center gap-8 max-w-sm"
      >
        {/* Completed circle */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, oklch(0.72 0.16 195), oklch(0.52 0.18 220))",
            boxShadow:
              "0 0 40px oklch(0.65 0.14 200 / 0.4), 0 0 80px oklch(0.55 0.14 220 / 0.2)",
          }}
        >
          <Heart
            className="w-10 h-10"
            style={{
              color: "oklch(0.95 0.04 210)",
              fill: "oklch(0.95 0.04 210 / 0.3)",
            }}
          />
        </div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-sm font-medium uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.55 0.08 210)" }}
          >
            {minutes} minutes complete
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-4"
            style={{ color: "oklch(0.88 0.06 215)" }}
          >
            Well done.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-body text-base leading-relaxed"
            style={{ color: "oklch(0.62 0.06 220)" }}
          >
            Take a moment to notice how you feel. Your nervous system has found
            its rhythm.
          </motion.p>
        </div>

        <motion.button
          data-ocid="completion.home_button"
          onClick={onHome}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="font-body font-medium px-8 py-3.5 rounded-2xl text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: "oklch(0.52 0.16 215)",
            color: "oklch(0.97 0.02 210)",
            boxShadow: "0 4px 20px oklch(0.52 0.16 215 / 0.35)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(0.58 0.16 210)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "oklch(0.52 0.16 215)";
          }}
        >
          Return home
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("home");
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(
    null,
  );

  const handleStart = useCallback((config: SessionConfig) => {
    setSessionConfig(config);
    setView("session");
    document.body.classList.add("session-active");
  }, []);

  const handleEnd = useCallback(() => {
    setView("home");
    setSessionConfig(null);
    document.body.classList.remove("session-active");
  }, []);

  const handleComplete = useCallback(() => {
    setView("completion");
    document.body.classList.remove("session-active");
  }, []);

  const handleHome = useCallback(() => {
    setView("home");
    setSessionConfig(null);
    document.body.classList.remove("session-active");
  }, []);

  return (
    <AnimatePresence mode="wait">
      {view === "home" && (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <HomeView onStart={handleStart} />
        </motion.div>
      )}

      {view === "session" && sessionConfig && (
        <motion.div
          key="session"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SessionView
            config={sessionConfig}
            onEnd={handleEnd}
            onComplete={handleComplete}
          />
        </motion.div>
      )}

      {view === "completion" && sessionConfig && (
        <motion.div
          key="completion"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CompletionView config={sessionConfig} onHome={handleHome} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
