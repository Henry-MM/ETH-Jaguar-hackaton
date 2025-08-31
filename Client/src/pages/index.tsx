
import animationData from "@/animations/Bank Loan.json";
import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { button as buttonStyles } from "@heroui/theme";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Lottie from "lottie-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConnect, useConnections } from "wagmi";

export function BankLoanAnimation() {
  return (
    <div style={{ width: 520, height: 520 }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
}

// request-loan

export default function IndexPage() {

  const { openConnectModal } = useConnectModal();
  const connections = useConnections();
  const navigate = useNavigate();

  const onClickStart = () => {
    if (connections.length) {
      return navigate("/request-loan");
    }

    if (openConnectModal) {
      openConnectModal();
    }
  };

  // useEffect(() => {
  //   if (connections.length) {
  //     navigate("/request-loan");
  //   }
  // }, [connections])


  return (
    <DefaultLayout>
      <section className="relative flex flex-col items-center justify-center gap-6 py-12 md:py-16">
        {/* Decorative gradient blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute -z-10 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-emerald-400/30 to-emerald-200/10 blur-3xl dark:from-emerald-500/20 dark:to-emerald-300/10"
        />

        <header className="text-center">
          <h1 className="inline-block max-w-xl leading-tight">
            <span className={title()}>Prest</span>
            <span className={title({ color: "green" })}>amigo</span>
          </h1>
          <p className={`${subtitle()} mt-2`}>Una experiencia simple y transparente.</p>
        </header>

        <BankLoanAnimation />

        <nav className="flex flex-wrap items-center justify-center gap-3">
          <Button
            aria-label="Comenzar solicitud de préstamo"
            className={`${buttonStyles({ color: "secondary", radius: "full", variant: "shadow" })} bg-gradient-to-t from-[#17c964] to-[#6fee8d]`}
            onClick={onClickStart}
          >
            Comenzar
          </Button>
        </nav>

        {/* Social proof / key points */}
        <ul className="mt-4 grid w-full max-w-3xl grid-cols-1 gap-3 px-4 text-sm text-foreground/80 sm:grid-cols-3">
          <li className="rounded-2xl border border-foreground/10 p-3 text-center">✔︎ Sin letra pequeña</li>
          <li className="rounded-2xl border border-foreground/10 p-3 text-center">✔︎ Tasas claras</li>
          <li className="rounded-2xl border border-foreground/10 p-3 text-center">✔︎ En minutos</li>
        </ul>
      </section>
    </DefaultLayout>
  );
}
