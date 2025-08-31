import { useState } from "react";
import Layout from "@/layouts/layout";
import CreditHistory from "@/components/credit-history";
import RequestForm from "@/components/request-form";
import AccountCard from "@/components/account-card";
import OffersWizard from "@/components/offers-wizard";      
import PaymentWizard from "@/components/payment-wizard";  
import type { TabKey } from "@/types";

type Step = "form" | "offers";

export default function RequestPage() {
  const [active, setActive] = useState<TabKey>("request");
  const [step, setStep] = useState<Step>("form");
  const [draft, setDraft] = useState<any>(null);



  return (
    <Layout active={active} onChange={setActive}>
      <main className="flex min-h-[calc(100dvh-120px)] flex-col items-center justify-start pb-28">
        {active === "request" && (
          step === "form" ? (
            <RequestForm onContinue={(form) => { 
              setDraft(form); 
              setStep("offers"); 
            }} />
          ) : (
            <OffersWizard
              draft={draft}
              onFinish={({ offer }) => {
                console.log("Solicitud finalizada:", offer);
                setActive("history");
                setStep("form");
                setDraft(null);
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
