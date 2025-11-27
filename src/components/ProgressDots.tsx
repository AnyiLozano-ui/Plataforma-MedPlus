import React from "react";

interface ProgressDotsProps {
  totalSteps: number;
  currentStep: number;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ totalSteps, currentStep }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <span
            key={stepNumber}
            className={[
              "h-2.5 w-2.5 rounded-full border transition-all duration-150",
              isCompleted
                ? "bg-emerald-500 border-emerald-500"
                : isActive
                ? "bg-primary border-primary shadow-[0_0_12px_rgba(255,212,56,0.8)] scale-110"
                : "border-white/30 bg-transparent",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        );
      })}
    </div>
  );
};

export default ProgressDots;
