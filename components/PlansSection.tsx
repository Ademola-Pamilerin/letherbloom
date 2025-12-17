"use client";

import PlanCard from "./PlanCard";

const plans = [
  {
    name: "Starter",
    description: "Weekly guides and basic programming.",
  },
  {
    name: "Popular",
    description: "Full program, progress tracking, and community.",
    featured: true,
  },
  {
    name: "Coach",
    description: "1:1 coaching and custom plans.",
  },
];

export default function PlansSection() {
  return (
    <section id="plans" className="mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-rose-700">Plans</h2>
        <p className="text-sm text-zinc-600">Cancel anytime · 7-day trial</p>
      </div>

      <div className="mt-6 flex gap-4 items-stretch justify-center">
        <div className="flex gap-4 items-stretch justify-center w-full max-w-3xl min-h-56">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              name={plan.name}
              description={plan.description}
              featured={plan.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
