"use client";

import { useState } from "react";
import PlanCard from "./PlanCard";
import { TRAINING_PLANS } from "./Pricing/plansData";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const trainingOptions = [
  {
    type: "personal" as const,
    label: "Personal Training",
    description: "One-on-one sessions tailored to your goals",
    icon: "💪",
  },
  {
    type: "group" as const,
    label: "Group Fitness Classes",
    description: "Train with community for extra motivation",
    icon: "👥",
  },
  {
    type: "functional" as const,
    label: "Functional Training",
    description: "Build real-world strength and mobility",
    icon: "🎯",
  },
];

export default function PlansSection({
  onSelect,
}: {
  onSelect?: (plan: { name: string; priceId: string }) => void;
}) {
  const [trainingType, setTrainingType] = useState<"personal" | "group" | "functional">("personal");
  const router = useRouter();

  const currentPlans = TRAINING_PLANS[trainingType] || [];

  const handlePlanSelect = (plan: { name: string; priceId: string }) => {
    if (onSelect) {
      onSelect(plan);
    } else {
      // Programmatic navigation — no full page refresh
      router.push(`/pricing?plan=${encodeURIComponent(plan.name)}&priceId=${encodeURIComponent(plan.priceId)}`);
    }
  };

  return (
    <section id="plans" className="mt-8 mb-12">
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-rose-600 mb-2">
          Training Options
        </p>
        <h2 className="text-4xl font-bold text-zinc-900 md:text-5xl">Choose Your Journey</h2>
        <p className="mt-4 text-zinc-600 text-center max-w-2xl px-4">
          Choose a category to view tailored plans. Billed per month.
        </p>
      </div>

      {/* Dark card training type selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-5xl mx-auto px-2 sm:px-4 mb-12">
        {trainingOptions.map((opt, index) => {
          const isActive = trainingType === opt.type;
          return (
            <motion.div
              key={opt.type}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => setTrainingType(opt.type)}
              className={`cursor-pointer rounded-2xl p-7 flex flex-col justify-between border-2 transition-all duration-300 shadow-lg ${
                isActive
                  ? "bg-gradient-to-br from-rose-500 to-rose-700 border-rose-400 text-white scale-[1.03] z-10"
                  : "bg-zinc-800 border-zinc-700 text-white hover:border-zinc-500 opacity-80 hover:opacity-100"
              }`}
            >
              <div>
                <div className="text-4xl mb-4">{opt.icon}</div>
                <h3 className="text-xl font-bold leading-snug">{opt.label}</h3>
                <p className="mt-2 text-sm opacity-85 leading-relaxed">{opt.description}</p>
              </div>
              <div className={`mt-6 inline-flex items-center text-sm font-bold ${isActive ? "text-white" : "text-rose-400"}`}>
                {isActive ? "Selected" : "Select Training"}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Plan cards — full width container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={trainingType}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="w-full px-2 sm:px-4"
        >
          <div className={`grid gap-8 w-full ${
            currentPlans.length === 1
              ? "grid-cols-1 max-w-lg mx-auto"
              : "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
          }`}>
            {currentPlans.map((plan) => (
              <div key={plan.name} className="h-full w-full">
                {/* @ts-ignore */}
                <PlanCard
                  {...plan}
                  onSelect={handlePlanSelect}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
