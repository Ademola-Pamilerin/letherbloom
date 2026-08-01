import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import OrganizationPricingForm from "@/components/Pricing/OrganizationPricingForm";

export const metadata: Metadata = {
  title: "Corporate & Organization Plans | LetHerBloom - Ladies Upper Body Gym",
  description: "Empower your female workforce or group with custom virtual gymnastics, calisthenics, and posture training. Manage organization seats and licenses.",
  keywords: [
    "corporate ladies upper body gym",
    "organization fitness subscription",
    "group gymnastics training online",
    "women team wellness plans",
    "virtual workplace wellness for women"
  ],
  alternates: {
    canonical: "/pricing/organization",
  },
  openGraph: {
    title: "Corporate & Organization Plans | LetHerBloom",
    description: "Empower your female workforce with custom virtual upper body gymnastics, calisthenics, and posture training. Manage organization seats and licenses.",
    url: "https://www.lhbloom.org/pricing/organization",
    siteName: "LetHerBloom",
    images: [
      {
        url: "/images/Gemini_Generated_Image_n8am4in8am4in8am.png",
        width: 1200,
        height: 630,
        alt: "LetHerBloom Organization Plans",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate & Organization Plans | LetHerBloom",
    description: "Empower your team with virtual gymnastics, calisthenics, and posture training for women.",
    images: ["/images/Gemini_Generated_Image_251cny251cny251c.png"],
  },
};

export default function OrganizationPricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.lhbloom.org/pricing/organization/#webpage",
        "url": "https://www.lhbloom.org/pricing/organization",
        "name": "Corporate & Organization Plans | LetHerBloom",
        "description": "Empower your female workforce or group with custom virtual gymnastics, calisthenics, and posture training.",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.lhbloom.org"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Pricing",
              "item": "https://www.lhbloom.org/pricing"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Organization",
              "item": "https://www.lhbloom.org/pricing/organization"
            }
          ]
        }
      },
      {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": "29.99",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "29.99",
          "priceCurrency": "USD",
          "unitText": "seat/month"
        },
        "url": "https://www.lhbloom.org/pricing/organization"
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            Organization Plan
          </h1>
          <p className="text-xl text-zinc-600">
            Empower your entire team with access to live training sessions
          </p>
        </div>

        <OrganizationPricingForm />

        <div className="mt-8 text-center text-sm text-zinc-500">
          <p>
            Already have an organization?{" "}
            <a
              href="/admin/dashboard"
              className="font-semibold text-rose-600 hover:text-rose-700"
            >
              Admin Login
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
