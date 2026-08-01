import { Metadata } from "next";
import PricingPageView from "@/components/Pricing/view";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing Plans | LetHerBloom - Ladies Upper Body Gym & Gymnastics",
  description: "Find the perfect virtual plan for ladies' upper body gymnastics, calisthenics, and posture correction training. Flexible individual and group subscriptions.",
  keywords: [
    "ladies upper body gym pricing",
    "women's calisthenics plans",
    "female gymnastics membership online",
    "virtual ladies gym price",
    "women posture correction training cost"
  ],
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing Plans | LetHerBloom - Ladies Upper Body Gym & Gymnastics",
    description: "Find the perfect virtual plan for ladies' upper body gymnastics, calisthenics, and posture correction training. Flexible individual and group subscriptions.",
    url: "https://www.lhbloom.org/pricing",
    siteName: "LetHerBloom",
    images: [
      {
        url: "/images/Gemini_Generated_Image_f95rxvf95rxvf95r.png",
        width: 1200,
        height: 630,
        alt: "LetHerBloom Pricing Plans",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans | LetHerBloom - Ladies Upper Body Gym & Gymnastics",
    description: "Flexible virtual training plans for ladies' upper body gymnastics, calisthenics, and posture correction.",
    images: ["/images/Gemini_Generated_Image_251cny251cny251c.png"],
  },
};

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.lhbloom.org/pricing/#webpage",
        "url": "https://www.lhbloom.org/pricing",
        "name": "Pricing Plans | LetHerBloom",
        "description": "Find the perfect virtual plan for ladies' upper body gymnastics, calisthenics, and posture correction training.",
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
            }
          ]
        }
      },
      {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": "15",
        "highPrice": "39.99",
        "offerCount": "4",
        "url": "https://www.lhbloom.org/pricing"
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />

      <main className="flex-grow w-[95%] sm:w-[98%] max-w-7xl mx-auto py-6 md:py-10">
        <PricingPageView />
      </main>

      <Footer />
    </div>
  );
}
