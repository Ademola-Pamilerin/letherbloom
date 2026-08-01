"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlansSection from "@/components/PlansSection";
import PaymentStep from "@/components/Pricing/PaymentStep";
import { findPlanByName } from "./plansData";

export default function PricingWizard() {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedPlan, setSelectedPlan] = useState<{ name: string; priceId: string } | null>(null);
    const [renewCode, setRenewCode] = useState<string | undefined>(undefined);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const planName = params.get("plan");
        const codeParam = params.get("code");
        const isRenew = params.get("renew") === "true";

        if (codeParam && isRenew) {
            setRenewCode(codeParam);
        }

        if (planName) {
            const plan = findPlanByName(planName);
            if (plan) {
                setSelectedPlan({ name: plan.name, priceId: plan.priceId || "" });
                setStep(2);
            }
        }
    }, []);

    const handleSelectPlan = (plan: { name: string; priceId: string }) => {
        setSelectedPlan(plan);
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setStep(1);
        setSelectedPlan(null);
        // Clear query parameter if user goes back
        if (window.history.pushState) {
            const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.pushState({path:newurl}, '', newurl);
        }
    };

    return (
        <div className="">
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <PlansSection onSelect={handleSelectPlan} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {selectedPlan && (
                            <PaymentStep plan={selectedPlan} onBack={handleBack} renewCode={renewCode} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
