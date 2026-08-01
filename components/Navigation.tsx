"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MobileMenu from "./MobileMenu";

export default function Navigation() {
  const navItems = ["About", "Trainings", "Testimonials", "Contacts"];

  return (
    <nav className="sticky top-0 z-50 border-b border-rose-100 bg-white/95 backdrop-blur">
      <div className="mx-auto w-[95%] sm:w-[98%] max-w-7xl py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center">
              <Image
                src="/logo/logo-full-transparent.png"
                alt="LetHerBloom Logo"
                width={1080}
                height={1080}
                className="h-20 w-auto object-contain rounded-full"
              />
            </div>
            <span className="text-2xl font-bold text-rose-700">LetHerBloom</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item}
                href={item === "About" ? "/about" : `/#${item.toLowerCase()}`}
                className="group"
              >
                <span className="text-xl xl:text-lg font-medium text-zinc-700 transition hover:text-rose-600 block group-hover:scale-105">
                  {item}
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href="/live-training"
              className="rounded-full bg-rose-600 px-6 py-2 text-xl lg:text-lg font-semibold text-white shadow-md transition hover:scale-105 active:scale-95"
            >
              Join Today
            </Link>
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
