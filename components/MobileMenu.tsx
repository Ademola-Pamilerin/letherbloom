"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Trainings", href: "#trainings" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contacts", href: "#contacts" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="h-6 w-6 text-zinc-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Backdrop with blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
          >
            <div className="fixed left-0 top-0 z-50 h-screen w-64 bg-white shadow-2xl md:hidden">
              <div className="flex flex-col p-6">
                {/* Close Button */}
                <button
                  className="mb-8 self-end active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    className="h-6 w-6 text-zinc-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Navigation Items */}
                <nav className="space-y-4">
                  {navItems.map((item, index) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className="block text-lg font-semibold text-zinc-900 transition hover:text-rose-600"
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}
                </nav>

                {/* CTA Button */}
                <div
                  className="animate-in slide-in-from-bottom-5 fade-in duration-500"
                >
                  <button className="mt-8 w-full rounded-full bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700">
                    Join Today
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
