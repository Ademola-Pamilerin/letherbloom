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
  renewCode?: string;
}

export default function PaymentStep({ plan, onBack, renewCode }: PaymentStepProps) {
  const [checkoutInitiated, setCheckoutInitiated] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // User form data state
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    address: "",
    phone: "",
    email: "",
    signature: "",
    disclaimerAgreed: false,
  });
  const [formError, setFormError] = useState("");

  // Lazy ref — Stripe.js is only loaded when the user clicks "Proceed to Payment"
  const stripePromiseRef = useRef<ReturnType<typeof loadStripe> | null>(null);

  const planDetail = findPlanByName(plan.name);

  const getStripePromise = () => {
    if (!stripePromiseRef.current) {
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!key) throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
      stripePromiseRef.current = loadStripe(key);
    }
    return stripePromiseRef.current;
  };

  useEffect(() => {
    if (!checkoutInitiated) return;

    setLoading(true);
    setError("");
    setClientSecret("");

    // Create a Checkout Session
    fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: plan.priceId,
        planName: plan.name,
        duration: plan.duration,
        uiMode: "embedded",
        userInfo: formData,
        renewCode: renewCode || undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [plan, checkoutInitiated]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (formError) setFormError("");
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.age.trim() ||
      !formData.address.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.signature.trim() ||
      !formData.disclaimerAgreed
    ) {
      setFormError(
        "Please fill in all personal information, sign, and accept the Health Disclaimer before proceeding."
      );
      return;
    }
    setFormError("");
    setCheckoutInitiated(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isSignatureValid =
    formData.signature.trim() !== "" &&
    formData.fullName.trim() !== "" &&
    formData.signature.trim().toLowerCase() === formData.fullName.trim().toLowerCase();

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.age.trim() !== "" &&
    formData.address.trim() !== "" &&
    isSignatureValid &&
    formData.disclaimerAgreed === true;

  if (!checkoutInitiated) {
    return (
      <div className="w-full max-w-5xl mx-auto px-1 sm:px-4 py-4">
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
          <div className="md:w-5/12 bg-zinc-50 p-5 sm:p-8 border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 border border-rose-100 uppercase tracking-wider mb-4">
                Selected Plan
              </span>
              <h2 className="text-3xl font-extrabold text-zinc-950 mb-2">
                {planDetail?.name || plan.name}
              </h2>
              <p className="text-zinc-600 text-sm mb-6">
                {planDetail?.description ||
                  "Empower your body with our virtual gymnastics and upper body strength sessions."}
              </p>

              {planDetail?.features && (
                <div className="space-y-4 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    What's Included:
                  </h4>
                  <ul className="space-y-3">
                    {planDetail.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="text-rose-600 font-bold mt-0.5">✓</span>
                        <span className="text-zinc-700 text-sm leading-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Amount</span>
                  <span className="font-semibold text-zinc-900">
                    ${planDetail?.price || "40.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-zinc-100 pb-2">
                  <span className="text-zinc-500">Billing frequency:</span>
                  <span className="font-semibold text-zinc-900">
                    {planDetail?.priceNote || "per month"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-zinc-900">Total Due Today:</span>
                  <span className="font-bold text-rose-600 text-2xl">
                    ${planDetail?.price || "40.00"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200">
              <p className="text-xs text-zinc-400">
                Need customized group access instead?{" "}
                <a
                  href="/pricing/organization"
                  className="text-rose-600 font-semibold hover:underline"
                >
                  Check corporate plans
                </a>
              </p>
            </div>
          </div>

          {/* Right Column: User Information & Health Disclaimer Form */}
          <div className="md:w-7/12 p-5 sm:p-8">
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {renewCode && (
                <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-2.5 text-xs text-amber-800 font-medium">
                  <span className="text-base">🔄</span>
                  <div>
                    <span className="font-bold text-amber-900 block">Code Renewal Mode</span>
                    Your payment will extend your access code: <code className="font-bold font-mono bg-amber-100 px-1 rounded">{renewCode}</code>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-zinc-950">
                  Registration & Health Disclaimer
                </h3>
                <p className="text-zinc-500 text-sm mt-1">
                  Please provide your personal details and sign the health waiver before proceeding to payment.
                </p>
              </div>

              {/* Personal Information Fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  1. Personal Information
                </h4>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold text-zinc-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                    className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-zinc-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-zinc-700 mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (832) 000-0000"
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="age"
                      className="block text-xs font-semibold text-zinc-700 mb-1"
                    >
                      Age *
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min="16"
                      max="120"
                      required
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="28"
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-xs font-semibold text-zinc-700 mb-1"
                    >
                      Physical Address *
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St, SugarLand, TX 77478"
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Health Disclaimer & Signature */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  2. Health & Safety Disclaimer
                </h4>

                <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4 text-xs text-zinc-600 max-h-32 overflow-y-auto leading-relaxed">
                  <p className="font-semibold text-zinc-800 mb-1">
                    Online Virtual Training Waiver:
                  </p>
                  <p>
                    I hereby declare that I am physically fit and cleared to participate in LetHerBloom online virtual training sessions, including remote gymnastics, calisthenics, and posture correction classes. I acknowledge that engaging in online virtual instruction in my own environment carries inherent risks of exercise, and I voluntarily choose to participate. I assume full responsibility for preparing a safe workout space and for any risks or injuries that may occur during or following these online sessions, and I agree to hold LetHerBloom, its instructors, and affiliates harmless from any liability.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="signature"
                    className="block text-xs font-semibold text-zinc-700 mb-1"
                  >
                    Digital Signature (Type your full legal name) *
                  </label>
                  <input
                    id="signature"
                    name="signature"
                    type="text"
                    required
                    value={formData.signature}
                    onChange={handleInputChange}
                    placeholder="Type full legal name"
                    className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm font-serif italic focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  {formData.signature.trim() !== "" && !isSignatureValid && (
                    <p className="mt-1 text-xs text-red-500">
                      * Digital signature must match your full name ({formData.fullName.trim() || "Full Name"}).
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="disclaimerAgreed"
                    name="disclaimerAgreed"
                    type="checkbox"
                    required
                    checked={formData.disclaimerAgreed}
                    onChange={handleInputChange}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <label
                    htmlFor="disclaimerAgreed"
                    className="text-xs text-zinc-700 leading-snug cursor-pointer select-none"
                  >
                    I have read, understood, and agree to the Health & Safety Disclaimer, and I confirm all details provided above are accurate. *
                  </label>
                </div>
              </div>

              {formError && (
                <div className="rounded-lg bg-red-50 p-3.5 text-xs font-semibold text-red-600 border border-red-200">
                  {formError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-6 shadow-lg shadow-rose-600/10 hover:shadow-rose-600/20 active:scale-[0.98] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-600 disabled:shadow-none disabled:active:scale-100"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Proceed to Payment
                </button>

                {!isFormValid && (
                  <p className="mt-2 text-center text-xs text-zinc-400">
                    * Complete all required fields, digital signature, and check the health disclaimer box to enable payment.
                  </p>
                )}

                <div className="mt-3 flex items-center justify-center gap-6 text-zinc-400 text-xs">
                  <div className="flex items-center gap-1">🔒 Secure SSL</div>
                  <div className="flex items-center gap-1">
                    💳 Powered by Stripe
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-4xl mx-auto px-4">
        <ThreeDotsLoader color="bg-rose-600" />
        <p className="mt-6 text-zinc-500 animate-pulse text-sm sm:text-base text-center">
          Initializing Secure Checkout...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg max-w-xl mx-auto w-[95%]">
        <p className="text-red-600 font-semibold mb-4">
          Error loading checkout: {error}
        </p>
        <button
          onClick={() => {
            setCheckoutInitiated(false);
            setError("");
            setClientSecret("");
          }}
          className="text-rose-600 hover:underline font-semibold"
        >
          ← Edit Information
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <button
        onClick={() => {
          setCheckoutInitiated(false);
          setClientSecret("");
        }}
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
        Edit Information & Waiver
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100">
        <div className="bg-zinc-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div>
            <h3 className="text-xl font-bold text-zinc-900">Checkout</h3>
            <p className="text-sm text-zinc-500 mt-1">
              Completing purchase for{" "}
              <span className="font-semibold text-rose-600">{plan.name}</span>{" "}
              ({formData.fullName})
            </p>
          </div>
          <div className="text-xs font-mono bg-zinc-200 px-2 py-1 rounded text-zinc-600 self-start sm:self-auto mt-2 sm:mt-0">
            Secure SSL
          </div>
        </div>

        <div className="p-0 sm:p-1">
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
