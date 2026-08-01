import { Metadata } from "next";
import Image from "next/image";
import OurStorySection from "@/components/about/OurStorySection";
import OurMissionSection from "@/components/about/OurMissionSection";
import OurVisionSection from "@/components/about/OurVisionSection";
import GallerySection from "@/components/GallerySection";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us | LetHerBloom - Ladies Upper Body Gym & Gymnastics",
  description: "Learn about the mission and vision of LetHerBloom, a dedicated virtual gym for ladies' upper body calisthenics, strength, and gymnastics training.",
  keywords: [
    "about ladies upper body gym",
    "women's upper body training story",
    "female calisthenics mission",
    "virtual gymnastics for ladies",
    "women's posture correction coaching",
    "online ladies fitness community"
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | LetHerBloom - Ladies Upper Body Gym & Gymnastics",
    description: "Learn about the mission and vision of LetHerBloom, a dedicated virtual gym for ladies' upper body calisthenics, strength, and gymnastics training.",
    url: "https://www.lhbloom.org/about",
    siteName: "LetHerBloom",
    images: [
      {
        url: "/images/Gemini_Generated_Image_tunm5xtunm5xtunm.png",
        width: 1200,
        height: 630,
        alt: "About LetHerBloom",
      },
    ],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | LetHerBloom - Ladies Upper Body Gym & Gymnastics",
    description: "Learn about the mission and vision of LetHerBloom, a dedicated virtual gym for ladies' upper body calisthenics.",
    images: ["/images/Gemini_Generated_Image_tunm5xtunm5xtunm.png"],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://www.lhbloom.org/about/#webpage",
        "url": "https://www.lhbloom.org/about",
        "name": "About Us | LetHerBloom",
        "description": "Learn about the mission, vision, and story of LetHerBloom - the leading virtual gymnastics and calisthenics space for women.",
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
              "name": "About",
              "item": "https://www.lhbloom.org/about"
            }
          ]
        }
      },
      {
        "@type": "SportsOrganization",
        "@id": "https://www.lhbloom.org/#organization",
        "name": "LetHerBloom",
        "url": "https://www.lhbloom.org",
        "logo": "https://www.lhbloom.org/logo/flower-logo.png"
      }
    ]
  };

  return (
    <div className="bg-white font-sans text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
            <Navigation />

            {/* Hero for About Page */}
            <section className="relative bg-rose-900 py-24 text-white">
                <div className="mx-auto w-[95%] sm:w-[98%] max-w-7xl px-2 sm:px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-black leading-tight md:text-7xl">
                            About <span className="text-rose-400">LetHerBloom</span>
                        </h1>
                        <p className="mt-6 text-xl text-rose-100 md:text-2xl">
                            Empowering women through strength, community, and holistic wellness.
                        </p>
                    </div>
                </div>
                <div className="absolute inset-0 z-0 opacity-10">
                    <Image
                        src="/images/Gemini_Generated_Image_tunm5xtunm5xtunm.png"
                        alt="Background pattern"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-rose-900/80" />
                </div>
            </section>

            <OurStorySection />
            <OurMissionSection />
            <OurVisionSection />

            {/* Gallery as a footer to the about section */}
            <GallerySection />

            <Footer />
        </div>
    );
}
