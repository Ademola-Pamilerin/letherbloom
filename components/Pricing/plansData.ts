export interface Plan {
  name: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  priceId?: string;
  featured?: boolean;
  isOrganization?: boolean;
}

export const TRAINING_PLANS: Record<"personal" | "group" | "functional", Plan[]> = {
  personal: [
    {
      name: "Personal Training",
      price: "40",
      priceNote: "per session",
      description: "One-on-one sessions tailored specifically to your goals and pace.",
      features: [
        "Custom workout plans",
        "Progress tracking & analytics",
        "Community access",
        "Priority support",
        "Monthly form check-ins",
        "Direct messaging with trainer",
      ],
      priceId: "price_1Elite",
      featured: true,
    },
  ],
  group: [
    {
      name: "Individual Group",
      price: "40",
      priceNote: "per session",
      description: "Join our vibrant community for group training.",
      features: [
        "2-3 Sessions per week",
        "Unlimited group classes",
        "Community events",
        "Group progress tracking",
        "Expert instruction",
      ],
      priceId: "price_group_ind",
      featured: true,
    },
    {
      name: "Corporate Group",
      price: "29.99",
      priceNote: "per session",
      description: "Structured group training for organizations.",
      features: [
        "Dedicated class slots",
        "Team building focus",
        "Usage analytics",
        "Custom onboarding",
      ],
      isOrganization: true,
    },
  ],
  functional: [
    {
      name: "Functional Core",
      price: "49",
      priceNote: "per session",
      description: "Master real-world movement and strength.",
      features: [
        "Mobility workshops",
        "Strength & agility focus",
        "Real-world application guides",
      ],
      priceId: "price_functional_core",
      featured: true,
    },
  ],
};

// Helper to look up a plan by name (case-insensitive)
export function findPlanByName(name: string): Plan | null {
  const normalized = name.toLowerCase().replace(/\s+/g, "");
  for (const category of Object.values(TRAINING_PLANS)) {
    for (const plan of category) {
      if (plan.name.toLowerCase().replace(/\s+/g, "") === normalized) {
        return plan;
      }
    }
  }
  return null;
}
