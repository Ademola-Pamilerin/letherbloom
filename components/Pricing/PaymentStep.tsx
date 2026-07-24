"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import ThreeDotsLoader from "@/components/ThreeDotsLoader";
import { findPlanByName } from "./plansData";

interface PaymentStepProps {
  plan: { name: string; priceId: string; duration?: number };
  onBack: () => void;
}

export default function PaymentStep({ plan, onBack }: PaymentStepProps) {
  const [checkoutInitiated, setCheckoutInitiated] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Lazy ref — Stripe.js is only loaded when the user clicks "Proceed to Payment"
  const stripePromiseRef = useRef<ReturnType<typeof loadStripe> | null>(null);

  const planDetail = findPlanByName(plan.name);

  const getStripePromise = () => {
    if (!stripePromiseRef.current) {
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!key) throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
      stripePromiseRef.current = loadStripe(key);
      console.log("Stripe Promise:", stripePromiseRef.current);
    }
    return stripePromiseRef.current;
  };
  useEffect(() => {
    if (!checkoutInitiated) return;

    setLoading(true);
    setError("");

    // Create a Checkout Session as soon as the component loads
    fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: plan.priceId,
        planName: plan.name,
        duration: plan.duration,
        uiMode: "embedded",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          console.log("Client secret:", data.clientSecret);
          setClientSecret(data.clientSecret);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [plan, checkoutInitiated]);

  if (!checkoutInitiated) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-sm font-medium text-zinc-500 hover:text-rose-600 transition-colors"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Plans
        </button>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden md:flex">
          {/* Left Column: Plan Information */}
          <div className="md:w-1/2 bg-zinc-50 p-8 border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 border border-rose-100 uppercase tracking-wider mb-4">
                Selected Plan
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-950 mb-2">
                {planDetail?.name || plan.name}
              </h2>
              <p className="text-zinc-600 text-sm mb-6">
                {planDetail?.description || "Empower your body with our virtual gymnastics and upper body strength sessions."}
              </p>

              {planDetail?.features && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">What's Included:</h4>
                  <ul className="space-y-3">
                    {planDetail.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="text-rose-600 font-bold mt-0.5">✓</span>
                        <span className="text-zinc-700 text-sm leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200">
              <p className="text-xs text-zinc-400">
                Need customized group access instead?{" "}
                <a href="/pricing/organization" className="text-rose-600 font-semibold hover:underline">
                  Check corporate plans
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: Review Details & Proceed */}
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-zinc-950">Review Details</h3>
              <p className="text-zinc-500 text-sm">
                Please review your selected plan summary. Pressing "Proceed to Payment" will open Stripe secure checkout.
              </p>

              <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Plan:</span>
                  <span className="font-semibold text-zinc-900">{planDetail?.name || plan.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Amount per session:</span>
                  <span className="font-semibold text-zinc-900">
                    ${planDetail?.price || "40.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-zinc-200 pb-3">
                  <span className="text-zinc-500">Billing frequency:</span>
                  <span className="font-semibold text-zinc-900">
                    {planDetail?.priceNote || "per session"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-zinc-900">Total Due Today:</span>
                  <span className="font-bold text-rose-600 text-2xl">
                    ${planDetail?.price || "40.00"}
                  </span>
                </div>
              </div>

              <div className="text-xs text-zinc-400 space-y-1">
                <p>• Sessions are typically scheduled 3 to 4 times a month.</p>
                <p>• Cancel or reschedule sessions directly through your dashboard.</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={() => setCheckoutInitiated(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-6 shadow-lg shadow-rose-600/10 hover:shadow-rose-600/20 active:scale-[0.98] transition"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Proceed to Payment
              </button>

              <div className="flex items-center justify-center gap-6 text-zinc-400 text-xs">
                <div className="flex items-center gap-1">
                  🔒 Secure SSL
                </div>
                <div className="flex items-center gap-1">
                  💳 Powered by Stripe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <ThreeDotsLoader color="bg-rose-600" />
        <p className="mt-4 text-zinc-500 animate-pulse">
          Initializing Secure Checkout...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 font-semibold mb-4">
          Error loading checkout: {error}
        </p>
        <button onClick={onBack} className="text-rose-600 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-sm font-medium text-zinc-500 hover:text-rose-600 transition-colors"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Plans
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100">
        <div className="bg-zinc-50 px-8 py-6 border-b border-zinc-200 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-zinc-900">Checkout</h3>
            <p className="text-sm text-zinc-500">
              Completing purchase for{" "}
              <span className="font-semibold text-rose-600">{plan.name}</span>
            </p>
          </div>
          <div className="text-xs font-mono bg-zinc-200 px-2 py-1 rounded text-zinc-600">
            Secure SSL
          </div>
        </div>

        <div className="p-1">
          {clientSecret && (
            <EmbeddedCheckoutProvider
              stripe={getStripePromise()}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout className="min-h-125" />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </div>
    </div>
  );
}
