import { useState } from "react";
import Layout from "@/layouts/layout";
import CreditHistory from "@/components/credit-history";
import RequestForm from "@/components/request-form";
import AccountCard from "@/components/account-card";
import OffersWizard from "@/components/offers-wizard";

type Step = "form" | "offers";
type TabKey = "request" | "history" | "account";

export default function RequestPage() {
  const [active, setActive] = useState<TabKey>("request");
  const [step, setStep] = useState<Step>("form");
  const [draft, setDraft] = useState<any>(null);

  return (
    <Layout active={active} onChange={(k) => {
      setActive(k);
      if (k === "request") setStep("form");
    }}>
      <main className="flex min-h-[calc(100dvh-120px)] flex-col items-center justify-start pb-28">
        {active === "request" && (
          step === "form" ? (
            <RequestForm
              onContinue={(form) => {
                setDraft(form);
                setStep("offers");
              }}
            />
          ) : (
            <OffersWizard
              draft={draft}
              onFinish={() => {
                setActive("history");
                setStep("form");
                setDraft(null);
              }}
            />
          )
        )}

        {active === "history" && <CreditHistory />}
        {active === "account" && <AccountCard />}
      </main>
    </Layout>
  );
}
