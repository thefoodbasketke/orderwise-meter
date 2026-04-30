import { useEffect, useState } from "react";
import { Accessibility, Type, Contrast, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "ums-a11y";

interface A11yState {
  fontScale: number; // 1, 1.15, 1.3
  highContrast: boolean;
}

const defaultState: A11yState = { fontScale: 1, highContrast: false };

function applyState(state: A11yState) {
  document.documentElement.style.fontSize = `${state.fontScale * 100}%`;
  if (state.highContrast) {
    document.documentElement.classList.add("a11y-high-contrast");
  } else {
    document.documentElement.classList.remove("a11y-high-contrast");
  }
}

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(defaultState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as A11yState;
        setState(parsed);
        applyState(parsed);
      }
    } catch {}
  }, []);

  const update = (next: Partial<A11yState>) => {
    const merged = { ...state, ...next };
    setState(merged);
    applyState(merged);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {}
  };

  const reset = () => {
    setState(defaultState);
    applyState(defaultState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed left-4 bottom-4 z-40 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
        aria-label="Accessibility options"
      >
        <Accessibility className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed left-4 bottom-20 z-40 w-72 rounded-xl border bg-background shadow-2xl p-4"
            role="dialog"
            aria-label="Accessibility settings"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Accessibility className="h-4 w-4" /> Accessibility
              </h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="p-1 hover:bg-muted rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Type className="h-3.5 w-3.5" /> Text Size
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { label: "A", value: 1 },
                    { label: "A+", value: 1.15 },
                    { label: "A++", value: 1.3 },
                  ].map((opt) => (
                    <Button
                      key={opt.value}
                      size="sm"
                      variant={state.fontScale === opt.value ? "default" : "outline"}
                      onClick={() => update({ fontScale: opt.value })}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1">
                  <Contrast className="h-3.5 w-3.5" /> Contrast
                </p>
                <Button
                  size="sm"
                  variant={state.highContrast ? "default" : "outline"}
                  className="w-full"
                  onClick={() => update({ highContrast: !state.highContrast })}
                >
                  {state.highContrast ? "Disable" : "Enable"} High Contrast
                </Button>
              </div>

              <Button size="sm" variant="ghost" className="w-full" onClick={reset}>
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
