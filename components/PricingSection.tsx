import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlanCard from "./PlanCard";
import { TRAINING_PLANS } from "./Pricing/plansData";

export default function PricingSection({
  selectedType,
  onTypeChange
}: {
  selectedType: "personal" | "group" | "functional";
  onTypeChange: (type: "personal" | "group" | "functional") => void;
}) {

  const tiers = TRAINING_PLANS[selectedType] || [];

  return (
    <section id="plans" className="bg-gradient-to-b from-white to-rose-50 py-20 pb-24">
      <div className="mx-auto w-[95%] sm:w-[98%] max-w-7xl px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
              Pricing Plans
            </p>
            <h2 className="mt-2 text-4xl font-bold text-zinc-900 md:text-5xl">
              Investment for <span className="capitalize">{selectedType}</span>
            </h2>
            <p className="mt-4 text-zinc-600">
              Billed per session. Sessions are typically scheduled 3 to 4 times a month.
            </p>
          </div>
        </motion.div>

        <div className="flex justify-center mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedType}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`grid gap-8 w-full max-w-6xl place-items-center ${tiers.length === 1 ? "md:grid-cols-1 max-w-md" : "md:grid-cols-2 lg:grid-cols-2 max-w-4xl"
                }`}
            >
              {tiers.map((tier) => (
                <div key={tier.name} className="h-full w-full">
                  {/* @ts-ignore - PlanCard props mismatch with tiers object */}
                  <PlanCard
                    {...tier}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}


