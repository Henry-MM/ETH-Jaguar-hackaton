import { useState } from "react";
import RequestForm from "@/components/request-form";
import OffersWizard from "@/components/offers-wizard";
import CreditHistory from "@/components/credit-history";
import AccountCard from "@/components/account-card";
import type { Offer } from "@/types";
import Layout from "@/layouts/layout";
import PaymentWizard from "@/components/payment-wizard";

type Step = "form" | "offers";
type TabKey = "request" | "history" | "account" | "payment";

export default function RequestPage() {
  const [active, setActive] = useState<TabKey>("request");
  const [step, setStep] = useState<Step>("form");
  const [offer, setOffer] = useState<Offer | undefined>(undefined);
  const [draft, setDraft] = useState<any>(null);



  return (
    <Layout active={active} onChange={setActive}>
      <main className="flex min-h-[calc(100dvh-120px)] flex-col items-center pb-28">
        {active === "request" && (
          step === "form" ? (
            <RequestForm
              onContinue={(calc) => {
                setDraft(calc);
                const o: Offer = {
                  id: `offer-${Date.now()}`,
                  amount: calc.amount,
                  monthlyPayment: Number(calc.monthlyPayment.toFixed(2)),
                  months: calc.months,
                  taza:  Number(((calc.interestAmount / calc.amount) * 100).toFixed(2)),
                  serviceFee: 0,
                  firstPaymentDate: new Date().toISOString().slice(0,10),
                  lastPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + calc.months))
                    .toISOString().slice(0,10),
                  verified: true,
                  tag: "Calculada",
                };
                setOffer(o);
                setStep("offers");
              }}
            />
          ) : (
            <OffersWizard
              offer={offer}
              draft={draft}
              onBack={() => setStep("form")}
              onFinish={() => {
                setActive("history");
                setStep("form");
                setDraft(null);
                setOffer(undefined);
              }}
            />
          )
        )}

        {active === "history" && <CreditHistory />}

        {active === "payment" && (
          <PaymentWizard
            onFinish={({ receiptId, amount, newBalance }) => {
              console.log("Pago OK:", { receiptId, amount, newBalance });
              setActive("history"); 
            }}
          />
        )}

        {active === "account" && <AccountCard />}
      </main>

    </Layout>
  );
}
