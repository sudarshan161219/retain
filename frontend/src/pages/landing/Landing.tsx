import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { Feature } from "@/components/feature/Feature";
import { useUser } from "@/hooks/user/useUser";
import { Button } from "@/components/ui/button";
import {
  Github,
  Server,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  Box,
  Copy,
  Check,
  Link,
} from "lucide-react";
import { useState } from "react";

export const Landing = () => {
  const navigate = useNavigate();

  const { data: user } = useUser();
  const [copied, setCopied] = useState(false);

  const dockerCommand = `docker run -d -p 3000:3000 \\
  -e DATABASE_URL=postgresql://... \\
  ghcr.io/sudarshan161219/retain:latest`;

  const copyCommand = () => {
    navigator.clipboard.writeText(dockerCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCTA = () => {
    navigate(user ? "/dashboard" : "/login");
  };

  return (
    <div className={styles.page}>
      {/* NAVBAR */}
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <Box className={styles.icon} size={24} strokeWidth={3} />
          <span className={styles.heading}>Retain</span>
          <span className={styles.brandTag}>Self-Hosted</span>
        </div>

        <div className={styles.navActions}>
          <a
            href="https://github.com/sudarshan161219/retain"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-medium hover:text-black transition-colors"
          >
            <Github size={18} />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>

          {user ? (
            <Button
              onClick={() => navigate("/dashboard")}
              className={styles.buttonSecondary}
            >
              <LayoutDashboard size={16} />
              Open Demo Dashboard
            </Button>
          ) : (
            <a
              href="https://github.com/sudarshan161219/retain"
              target="_blank"
              rel="noreferrer"
              className={styles.buttonSmall}
            >
              <Link size={20} />
              Try Live Demo
            </a>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className={styles.heroSection}>
        {/* Left: Copy */}
        <div className="flex flex-col gap-6 text-left">
          <div className={styles.badgesuccess}>
            <Server size={14} />
            <span>MIT Licensed & Open Source</span>
          </div>

          <h1 className={styles.herotitle}>
            Client retainers, <br />
            <span className={styles.gradientText}>
              on your own infrastructure.
            </span>
          </h1>

          <p className={styles.subtitle}>
            Stop paying monthly fees for simple retainer tracking.
            <strong>Retain</strong> is a lightweight, Dockerized tool you host
            yourself. Give clients a real-time burn chart without giving away
            your data.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <a
              href="https://github.com/sudarshan161219/retain"
              target="_blank"
              rel="noreferrer"
              className={styles.buttonLg}
            >
              <Github size={20} />
              View Repository
            </a>
            <Button
              variant="default"
              className="cursor-pointer"
              size="lg"
              onClick={() => navigate("/login")}
            >
              <Link size={20} /> Try the Live Demo
            </Button>
          </div>

          <p className="text-sm text-(--label) mt-1.5">*Live demo no login.</p>
        </div>

        {/* Right: Code Block */}
        <div className={styles.heroTerminalWrapper}>
          <div className={styles.heroGlow}></div>
          {/* The Terminal Window */}
          <div className={styles.heroTerminal}>
            {/* Terminal Header */}
            <div className={styles.terminalHeader}>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="text-xs text-white/30 font-mono">bash</div>
            </div>

            {/* Terminal Body */}
            <div className={styles.terminalBody}>
              <div className="flex justify-between items-start">
                <code className="block mb-4 text-emerald-400">
                  # Pull and run in seconds
                </code>
                <button
                  onClick={copyCommand}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  {copied ? (
                    <Check size={16} className="text-emerald-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>

              <div className="whitespace-pre text-gray-100">
                {dockerCommand}
              </div>

              <div className="mt-6 text-gray-500">
                <span className="text-blue-400">➜</span> ~ Container started:
                <span className="text-emerald-400"> 0.0.0.0:3000</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className={styles.audience}>
        <h2>Perfect for:</h2>
        <ul>
          <li>Freelancers just starting out</li>
          <li>Developers working on monthly retainers</li>
          <li>Designers managing client hours</li>
          <li>Anyone tired of tracking in spreadsheets</li>
        </ul>
      </section>

      {/* TECH FEATURES */}
      <section className="bg-gray-50 py-24 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why self-host?</h2>
            <p className="text-gray-500">
              Built for developers who prefer owning their stack.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <Feature
              icon={<Box />}
              title="Docker Ready"
              text="Ships as a lightweight container. Run it on a $5 VPS, your Raspberry Pi, or Coolify."
            />
            <Feature
              icon={<ShieldCheck />}
              title="Data Sovereignty"
              text="Your client data never leaves your server. No tracking pixels, no third-party analytics."
            />
            <Feature
              icon={<Zap />}
              title="Zero Overhead"
              text="Built with React, Node, and Postgres. Fast, minimal resource usage, and easy to maintain."
            />
          </div>
        </div>
      </section>

      <section className={styles.finalCTA}>
        <h2>Stop worrying about how many hours are left.</h2>
        <p>Focus on delivering great work. Retain handles the tracking.</p>
        <button onClick={handleCTA} className={styles.buttonLg}>
          Create Free Account
        </button>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className="flex flex-col items-center gap-4">
          <span className="text-sm text-gray-500">
            Open Source under MIT License.
          </span>

          <div className="flex gap-6 opacity-60 hover:opacity-100 transition-opacity">
            <a
              href="https://x.com/buildwithSud"
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-sm font-semibold hover:underline">
                Created by @buildwithSud
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
