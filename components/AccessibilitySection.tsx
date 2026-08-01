"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AccessibilitySection() {
  return (
    <section id="about" className="bg-white py-20">
      <div className="mx-auto w-[95%] sm:w-[98%] max-w-7xl px-2 sm:px-4">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-rose-600">
              Our Philosophy
            </p>
            <h2 className="mt-2 text-4xl font-bold text-zinc-900">
              Fitness Should Be{" "}
              <span className="text-rose-600">Accessible</span> to Everyone
            </h2>
            <p className="mt-6 text-lg text-zinc-700">
              Whether you're a complete beginner or an experienced lifter, we
              use a variety of techniques and classes to build your skills. Join
              a thriving community dedicated to your success.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Expert coaches with years of experience",
                "Flexible schedules that work with your life",
                "Form-first approach to prevent injury",
                "Supportive community of women empowering eachother",

              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white text-sm font-bold">
                      ✓
                    </div>
                    <span className="text-zinc-700">{item}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 p-12 text-center flex flex-col items-center justify-center">
              <Image
                src="/images/replace.jpeg"
                alt="Woman doing upper body training"
                width={500}
                height={500}
                className="h-60 w-60 object-contain mb-4"
              />
              <p className="text-zinc-700">
                Build the strength and confidence to achieve your goals anytime, anywhere.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

