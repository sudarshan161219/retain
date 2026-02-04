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
  ExternalLink,
  ChevronRight,
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
    if (user) {
      navigate(`/dashboard/${user.id}`);
    } else {
      navigate("/auth");
    }
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
            className={styles.linkButton}
          >
            <Github size={18} />
            <span className={styles.hideMobile}>Star on GitHub</span>
          </a>

          <Button onClick={handleCTA} className="cursor-pointer">
            {user ? <LayoutDashboard size={18} /> : <ChevronRight size={18} />}
            {user ? "Dashboard" : "Get Started"}
          </Button>
        </div>
      </nav>

      {/* HERO SECTION  */}
      <main className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.badgeSuccess}>
            <Server size={14} />
            <span>v1.0.0 is now live</span>
          </div>

          <h1 className={styles.heroTitle}>
            The open-source <br />
            <span className={styles.gradientText}>
              retainer tracker for creators.
            </span>
          </h1>

          <p className={styles.subtitle}>
            Stop wrestling with spreadsheets. <strong>Retain</strong> gives you
            and your clients a beautiful, real-time look at project hours and
            burn rates. Complete privacy, hosted by you.
          </p>

          <div className={styles.heroActions}>
            <a
              href="https://retain-frontend-gamma.vercel.app"
              target="_blank"
              rel="noreferrer"
              className={styles.linkButton}
            >
              <ExternalLink size={20} />
              Try Live Demo
            </a>

            <a
              href="https://github.com/sudarshan161219/retain"
              target="_blank"
              rel="noreferrer"
              className={styles.buttonSecondary}
            >
              <Github size={20} />
              View Repository
            </a>
          </div>

          <p className={styles.disclaimer}>
            No credit card. No cloud fees. Your data, your rules.
          </p>
        </div>
      </main>

      {/* DOCKER SECTION */}
      <section className={styles.dockerSection}>
        <div className={styles.darkCard}>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Deploy in seconds.</h3>
            <p className={styles.cardText}>
              Prefer to host it yourself? Retain is built to be portable. Drop
              our image into your favorite orchestrator and you're ready to go.
            </p>

            <div className={styles.techStack}>
              <div className={styles.iconGroup}>
                <div className={`${styles.techIcon} ${styles.blueIcon}`}>
                  DKR
                </div>
                <div className={`${styles.techIcon} ${styles.greenIcon}`}>
                  K8S
                </div>
              </div>
              <span className={styles.techLabel}>Image size: ~45MB</span>
            </div>
          </div>

          <div className={styles.cardTerminalWrapper}>
            <div className={styles.heroTerminal}>
              <div className={styles.terminalHeader}>
                <div className={styles.dots}>
                  <div className={styles.dotRed} />
                  <div className={styles.dotYellow} />
                  <div className={styles.dotGreen} />
                </div>
                <div className={styles.terminalLabel}>Quick Deployment</div>
              </div>

              <div className={styles.terminalBody}>
                <div className={styles.commandRow}>
                  <code className={styles.comment}>
                    # Standard Docker Install
                  </code>
                  <button onClick={copyCommand} className={styles.copyBtn}>
                    {copied ? (
                      <Check size={14} className={styles.checkIcon} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
                <div className={styles.codeBlock}>{dockerCommand}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE & FEATURES */}
      <section className={styles.audienceSection}>
        <div className={styles.audienceGrid}>
          <div className={styles.audienceContent}>
            <h2 className={styles.sectionHeading}>
              Built for the <br />
              modern freelancer.
            </h2>
            <ul className={styles.checkList}>
              {[
                "Freelancers managing multiple clients",
                "Agency owners tired of SaaS overhead",
                "Developers who value data sovereignty",
                "Designers needing clear burn-down charts",
              ].map((item, idx) => (
                <li key={idx} className={styles.checkItem}>
                  <div className={styles.checkIconWrapper}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.featuresList}>
            <Feature
              icon={<ShieldCheck />}
              title="Privacy First"
              text="Your client data never leaves your server. Period."
            />
            <Feature
              icon={<Zap />}
              title="Lightweight"
              text="Optimized for low-resource environments and fast loads."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.finalCTA}>
        <div className={styles.ctaContent}>
          <h2>Take full control of your client retainers.</h2>
          <p>
            Professional tracking, transparent reporting, and total data
            sovereignty.
          </p>
          <Button onClick={handleCTA} className="cursor-pointer">
            Get Started
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Box className={styles.footerIcon} size={20} />
            <span className={styles.footerLogo}>Retain</span>
          </div>
          <span className={styles.copyright}>
            Released under the MIT License.
          </span>
          <a
            href="https://x.com/buildwithSud"
            target="_blank"
            rel="noreferrer"
            className={styles.creatorLink}
          >
            Created by @buildwithSud
          </a>
        </div>
      </footer>
    </div>
  );
};
