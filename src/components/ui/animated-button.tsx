import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";

interface AnimatedButtonProps extends ButtonProps {
  isLoading?: boolean;
  isSuccess?: boolean;
  ripple?: boolean;
}

interface RippleType {
  x: number;
  y: number;
  id: number;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, isLoading, isSuccess, ripple = true, onClick, disabled, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<RippleType[]>([]);
    const [showSuccess, setShowSuccess] = React.useState(false);

    React.useEffect(() => {
      if (isSuccess) {
        setShowSuccess(true);
        const timer = setTimeout(() => setShowSuccess(false), 2000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !isLoading) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        
        setRipples((prev) => [...prev, { x, y, id }]);
        
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }
      
      if (onClick && !disabled && !isLoading) {
        onClick(e);
      }
    };

    return (
      <Button
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        onClick={handleClick}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute rounded-full bg-white/30 pointer-events-none"
              style={{
                left: ripple.x - 10,
                top: ripple.y - 10,
                width: 20,
                height: 20,
              }}
            />
          ))}
        </AnimatePresence>

        {/* Button content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </motion.span>
          ) : showSuccess ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
              >
                <Check className="h-4 w-4" />
              </motion.div>
              <span>Success!</span>
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
