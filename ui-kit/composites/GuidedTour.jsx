import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, ArrowLeft, X, Check, Sparkle, FolderOpen, Tray, ClipboardText, UsersThree, Database, BookOpen, SlidersHorizontal, Gauge, Kanban, Terminal, Megaphone } from '@phosphor-icons/react';

const TOUR_KEY = 'alexbot-tour-done';

/**
 * Step definitions for the guided tour.
 * Each step targets a sidebar link or UI element by selector.
 */
const ROOT_STEPS = [
  {
    target: 'a[href="/"]',
    title: 'Projects',
    icon: FolderOpen,
    description: 'Your home base. All your projects live here. You can create new projects, import from GitHub, tag and filter them. Each project is a self-contained workspace with its own tasks, agents, and settings.',
    position: 'right',
  },
  {
    target: 'a[href="/tasks"]',
    title: 'All Tasks',
    icon: ClipboardText,
    description: 'A cross-project view of every task across all your projects. Switch between list and kanban views, filter by status, assignee, or project. Great for getting a bird\'s-eye view of everything in motion.',
    position: 'right',
  },
  {
    target: 'a[href="/team"]',
    title: 'People',
    icon: UsersThree,
    description: 'Manage your team members here. See who\'s working on what, manage roles and permissions, and invite new collaborators to your workspace.',
    position: 'right',
  },
  {
    target: 'a[href="/knowledge"]',
    title: 'Knowledge Base',
    icon: Database,
    description: 'Your shared knowledge repository. Upload documents, notes, and references that AI agents can use as context when working on tasks. Powered by vector search for intelligent retrieval.',
    position: 'right',
  },
  {
    target: 'a[href="/queue"]',
    title: 'AI Queue',
    icon: Tray,
    description: 'The global task queue for AI agents. See what\'s pending, in progress, or completed. The orchestrator distributes work from this queue to connected workers.',
    position: 'right',
  },
  {
    target: 'a[href="/docs"]',
    title: 'Documentation',
    icon: BookOpen,
    description: 'Everything you need to know about alexbot -- setup guides, workflow docs, API references, and deployment instructions. Always up to date.',
    position: 'right',
  },
  {
    target: 'a[href="/settings"]',
    title: 'Settings',
    icon: SlidersHorizontal,
    description: 'Global configuration: themes, session retention, integrations with Codex CLI and Claude Code, and account management. This is where you connect your AI engines.',
    position: 'right',
  },
];

const PROJECT_STEPS = [
  {
    target: '[data-tour="dashboard"]',
    fallbackSelector: 'a[href$="/"]',
    title: 'Dashboard',
    icon: Gauge,
    description: 'The project overview. See task stats, recent activity, and chat with an AI assistant about your project. Everything at a glance.',
    position: 'right',
  },
  {
    target: '[data-tour="tasks"]',
    fallbackSelector: 'a[href*="/tasks"]',
    title: 'Tasks',
    icon: Kanban,
    description: 'Where the real work happens. Create tasks manually or let AI generate them from a goal. Switch between list and kanban views. Each task can have subtasks, assignees, labels, and due dates.',
    position: 'right',
  },
  {
    target: '[data-tour="agents"]',
    fallbackSelector: 'a[href*="/agents"]',
    title: 'AI Agents',
    icon: Terminal,
    description: 'Your AI workforce. Code workers pick up tasks, write code, and submit for review. QA agents validate the output. Monitor their status, sessions, and configure how they behave.',
    position: 'right',
  },
  {
    target: '[data-tour="alerts"]',
    fallbackSelector: 'a[href*="/alerts"]',
    title: 'Alerts',
    icon: Megaphone,
    description: 'Set up notifications for important events -- task completions, failures, budget alerts. Get notified via the in-app bell, Telegram, or email.',
    position: 'right',
  },
  {
    target: '[data-tour="settings"]',
    fallbackSelector: 'a[href*="/settings"]',
    title: 'Project Settings',
    icon: SlidersHorizontal,
    description: 'Per-project configuration. Set the project path, manage API keys specific to this project, configure the AI model, and customize the project appearance.',
    position: 'right',
  },
];

function TourOverlay({ steps, onComplete, phaseLabel }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const highlightRef = useRef(null);

  const step = steps[currentStep];

  const updateRect = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.target) || (step.fallbackSelector && document.querySelector(step.fallbackSelector));
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      // Scroll element into view if needed
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    updateRect();
    const interval = setInterval(updateRect, 500);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [updateRect, currentStep]);

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else onComplete();
  };
  const prev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const Icon = step?.icon;

  // Position the tooltip card
  const getTooltipStyle = () => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    const pad = 16;
    const cardW = 340;
    const cardH = 220;

    // Default: to the right of the target
    let top = targetRect.top + targetRect.height / 2 - cardH / 2;
    let left = targetRect.right + pad;

    // If overflows right, put left
    if (left + cardW > window.innerWidth - pad) {
      left = targetRect.left - cardW - pad;
    }
    // Clamp vertical
    top = Math.max(pad, Math.min(top, window.innerHeight - cardH - pad));
    left = Math.max(pad, left);

    return { top, left };
  };

  return createPortal(
    <div className="fixed inset-0 z-99999" style={{ pointerEvents: 'none' }}>
      {/* Dark overlay with cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 4}
                width={targetRect.width + 12}
                height={targetRect.height + 8}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#tour-mask)" />
      </svg>

      {/* Highlight ring around target */}
      {targetRect && (
        <div
          ref={highlightRef}
          className="absolute rounded-xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 8,
            boxShadow: '0 0 0 2px var(--color-accent), 0 0 20px 4px rgba(var(--color-accent), 0.2)',
            border: '2px solid var(--color-accent)',
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        className="absolute w-[340px] rounded-2xl bg-surface-raised border border-border-subtle/60 p-5 space-y-3"
        style={{
          ...getTooltipStyle(),
          pointerEvents: 'auto',
          filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.5))',
          animation: 'dropdown-in 200ms ease-out both',
        }}
      >
        {/* Phase indicator */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-semibold text-accent uppercase tracking-wider">{phaseLabel}</span>
          <button
            onClick={onComplete}
            className="p-1 text-text-muted hover:text-text-secondary transition-colors"
          >
            <X size={14} weight="bold" />
          </button>
        </div>

        {/* Icon + title */}
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Icon size={18} weight="duotone" className="text-accent" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-text-primary">{step?.title}</h3>
            <span className="text-[10px] text-text-muted">Step {currentStep + 1} of {steps.length}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary leading-relaxed">{step?.description}</p>

        {/* Progress bar */}
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep ? 'bg-accent' : 'bg-surface-overlay'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={prev}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted hover:text-text-secondary disabled:opacity-30 transition-colors"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <button
            onClick={next}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-[11px] font-semibold hover:bg-accent-hover transition-colors"
          >
            {currentStep < steps.length - 1 ? (
              <>Next <ArrowRight size={12} /></>
            ) : (
              <><Check size={12} weight="bold" /> Done</>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Transition screen between root tour and project tour.
 */
function TransitionScreen({ onContinue, onSkip }) {
  return createPortal(
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/70 backdrop-blur-sm" style={{ animation: 'modal-fade-in 200ms ease-out both' }}>
      <div
        className="w-[400px] rounded-2xl bg-surface-raised border border-border-subtle/60 p-8 text-center space-y-5"
        style={{ animation: 'dropdown-in 250ms ease-out both', filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.5))' }}
      >
        <Sparkle size={32} weight="duotone" className="text-accent mx-auto" />
        <div>
          <h2 className="text-lg font-bold text-text-primary">Great overview!</h2>
          <p className="text-sm text-text-muted mt-1">Now let's dive into a project to see how everything works inside.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-medium text-text-muted hover:text-text-secondary hover:bg-surface-overlay transition-colors"
          >
            I'm good, thanks
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors"
          >
            Show me a project
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * GuidedTour orchestrator.
 * Listens for 'alexbot-start-tour' event, runs through root steps,
 * then optionally navigates into a project for project-scoped steps.
 */
export function GuidedTour() {
  const [phase, setPhase] = useState(null); // null | 'root' | 'transition' | 'project'

  useEffect(() => {
    const done = localStorage.getItem(TOUR_KEY);
    if (done) return;

    function handleStart() {
      setPhase('root');
    }
    window.addEventListener('alexbot-start-tour', handleStart);
    return () => window.removeEventListener('alexbot-start-tour', handleStart);
  }, []);

  const handleRootComplete = () => {
    setPhase('transition');
  };

  const handleGoToProject = () => {
    // Find the first project link in the page and navigate to it
    const projectLink = document.querySelector('a[href^="/projects/"]');
    if (projectLink) {
      projectLink.click();
      // Wait for navigation then start project tour
      setTimeout(() => setPhase('project'), 600);
    } else {
      // No projects, end tour
      finishTour();
    }
  };

  const finishTour = () => {
    setPhase(null);
    localStorage.setItem(TOUR_KEY, 'true');
  };

  if (phase === 'root') {
    return <TourOverlay steps={ROOT_STEPS} onComplete={handleRootComplete} phaseLabel="Workspace Overview" />;
  }

  if (phase === 'transition') {
    return <TransitionScreen onContinue={handleGoToProject} onSkip={finishTour} />;
  }

  if (phase === 'project') {
    return <TourOverlay steps={PROJECT_STEPS} onComplete={finishTour} phaseLabel="Inside a Project" />;
  }

  return null;
}
