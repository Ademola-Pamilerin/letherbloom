"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-white/80 p-8 shadow-lg">
      <div className="absolute -right-24 -top-24 opacity-30 rotate-12">
        <Image src="/flowers-decor.svg" alt="flowers" width={420} height={420} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.section
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-center gap-6"
        >
          <h1 className="text-4xl font-extrabold leading-tight text-rose-700">
            letHerBloom
          </h1>
          <p className="max-w-lg text-lg text-zinc-700">
            Empowering women through focused upper-body strength, mobility,
            and confidence-building workouts. Join a community designed to
            help you grow stronger, feel more capable, and bloom.
          </p>

          <div className="flex flex-wrap gap-3">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="#plans"
              className="inline-flex items-center gap-3 rounded-full bg-rose-600 px-5 py-3 text-white shadow-md"
            >
              Start Your Free Trial
            </motion.a>

            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-3 text-rose-700"
            >
              Learn More
            </a>
          </div>
        </motion.section>

        <motion.figure
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="flex items-center justify-center"
        >
          <Image
            src="/image-hero.png"
            alt="upper body workout illustration"
            width={1520}
            height={1520}
            priority
          />
        </motion.figure>
      </div>
    </header>
  );
}
