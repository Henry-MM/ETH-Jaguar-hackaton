import React, { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { HiCalendar, HiReceiptRefund, HiTag, HiShieldCheck, HiCheck } from "react-icons/hi";
import { Offer } from "@/types";
import { useWriteContract } from 'wagmi'
import { abi as PrestamigoAbi } from "../smartContracts/Prestamigo.json";

export type RequestDraft = {
  amount: number;
  months: number;
  maxMonthly: number;
};

const fmtHNL = new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL" });

const DUMMY_OFFERS: Offer[] = [
  { id: "offer-1", amount: 100,  monthlyPayment: 34,  months: 4,  taza: 20, serviceFee: 4,   firstPaymentDate: "2025-09-29", lastPaymentDate: "2025-12-29", lender: "Prestamista A", verified: true,  tag: "Rápida aprobación" },
  { id: "offer-2", amount: 1500, monthlyPayment: 135, months: 12, taza: 18, serviceFee: 50,  firstPaymentDate: "2025-10-15", lastPaymentDate: "2026-09-15", lender: "Finanzas B",    verified: true,  tag: "Baja tasa" },
  { id: "offer-3", amount: 5000, monthlyPayment: 480, months: 12, taza: 24, serviceFee: 120, firstPaymentDate: "2025-10-01", lastPaymentDate: "2026-09-01", lender: "Tu Amigo C",    verified: false, tag: "Mayor monto" },
];

function OfferRecommendations({
  offers = DUMMY_OFFERS,
  onSelect,
  onSkip,
}: {
  offers?: Offer[];
  onSelect: (offer: Offer) => void;
  onSkip?: (nextOffer: Offer) => void;
}) {
  const [index, setIndex] = useState(0);
  const current = offers[index];
  const title = useMemo(() => `Recibe tus ${fmtHNL.format(current.amount)} por`, [current.amount]);
  const next = () => {
    const i = (index + 1) % offers.length;
    setIndex(i);
    onSkip?.(offers[i]);
  };

  return (
    <section className="w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md md:max-w-xl overflow-hidden rounded-3xl shadow-2xl">
        <div className="relative">
          <div className="h-5 md:h-12 bg-gradient-to-tr from-emerald-400 to-emerald-600" />
          {current.tag && (
            <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow">
              {current.tag}
            </span>
          )}
        </div>

        <CardBody className="pt-12 md:pt-14 pb-8 md:pb-10">
          <div className="text-center space-y-1">
            <p className="text-base md:text-lg text-foreground/80">{title}</p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
              {fmtHNL.format(current.monthlyPayment)}{" "}
              <span className="text-foreground/70 text-xl md:text-2xl font-normal">al mes</span>
            </h2>
            <p className="text-default-500">por {current.months} meses</p>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Chip icon={<HiTag />} label={`${current.taza}% Tasa de interés`} />
            <Chip icon={<HiReceiptRefund />} label={`Comisión {${fmtHNL.format(current.serviceFee)}}`.replace("{", "").replace("}", "")} />
          </div>

          <div className="my-6 h-px w-full bg-foreground/10" />

          <ul className="px-12 text-base md:text-lg text-foreground/80">
            <DetailRow icon={<HiCalendar />} label="Primer pago" value={formatDate(current.firstPaymentDate)} />
            <DetailRow icon={<HiCalendar />} label="Último pago" value={formatDate(current.lastPaymentDate)} />
          </ul>

          <div className="mt-8 flex justify-center items-center">
            <div className="flex gap-3 text-foreground/80">
              <Button variant="flat" onPress={next}>Seguir buscando</Button>
              <Button className="text-white font-semibold" color="success" onPress={() => onSelect(current)}>
                Seleccionar
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}

function ConfirmScreen({
  offer,
  draft,
  onBack,
  onConfirm,
}: {
  offer: Offer;
  draft?: RequestDraft | null;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <section className="w-full flex items-center justify-center p-6">
      <Card className="w-full p-6 max-w-md md:max-w-xl rounded-3xl shadow-2xl">
        <CardHeader className="text-center">
          <h3 className="text-lg font-semibold">Confirmar solicitud</h3>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="text-center space-y-1">
            <p className="text-base text-foreground/80">
              Recibe <strong>{fmtHNL.format(offer.amount)}</strong>
            </p>
            <h2 className="text-4xl font-semibold">
              {fmtHNL.format(offer.monthlyPayment)}{" "}
              <span className="text-foreground/70 text-xl font-normal">al mes</span>
            </h2>
            <p className="text-default-500">por {offer.months} meses</p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-base">
            <DetailRow icon={<HiCalendar />} label="Primer pago" value={formatDate(offer.firstPaymentDate)} />
            <DetailRow icon={<HiCalendar />} label="Último pago" value={formatDate(offer.lastPaymentDate)} />
            <DetailRow label="Tasa de interés" value={`${offer.taza}%`} />
            <DetailRow label="Comisión de servicio" value={fmtHNL.format(offer.serviceFee)} />
          </div>

          <div className="rounded-2xl bg-foreground/[0.05] p-3 text-sm text-foreground/80 ring-1 ring-foreground/10">
            <div className="flex items-center gap-2 font-medium">
              <HiShieldCheck className="text-success" />
              Verificación y términos
            </div>
            <p className="mt-1">
              Al confirmar, autorizas la verificación y aceptas los términos del préstamo. Podrás cancelar antes del desembolso.
            </p>
          </div>

          <div className="flex justify-between">
            <Button variant="flat" onPress={onBack}>Volver</Button>
            <Button className="text-white font-semibold" color="success" onPress={onConfirm}>Confirmar</Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}

function DepositSuccess({
  offer,
  onFinish,
}: {
  offer: Offer;
  draft?: RequestDraft | null;
  onFinish: () => void;
}) {
  return (
    <section className="w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md md:max-w-xl rounded-3xl shadow-2xl">
        <CardBody className="py-10 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <HiCheck className="text-emerald-600" size={32} />
          </div>
          <h2 className="text-2xl font-semibold">¡Depósito confirmado!</h2>
          <p className="text-foreground/70">
            Se han depositado <strong>{fmtHNL.format(offer.amount)}</strong>
          </p>

          <div className="mx-auto mt-4 w-full max-w-sm text-left space-y-2 text-sm">
            <div className="flex justify-between"><span>Cuota mensual</span><strong>{fmtHNL.format(offer.monthlyPayment)}</strong></div>
            <div className="flex justify-between"><span>Plazo</span><strong>{offer.months} meses</strong></div>
            <div className="flex justify-between"><span>Primer pago</span><strong>{formatDate(offer.firstPaymentDate)}</strong></div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Button as={"a"} href="/request?tab=history" variant="flat">Ver historial</Button>
            <Button color="success" className="text-white font-semibold" onPress={onFinish}>Finalizar</Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const labels = ["Elegir oferta", "Confirmación", "Depósito"];
  const pct = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-6">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-foreground/70">
        {labels.map((l, i) => (
          <div key={l} className="flex items-center gap-2">
            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-white text-xs ${i + 1 <= step ? "bg-emerald-500" : "bg-foreground/30"}`}>
              {i + 1}
            </span>
            <span className={`${i + 1 === step ? "text-foreground" : ""}`}>{l}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-foreground/10 overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function OffersWizard({
  offers = DUMMY_OFFERS,
  draft,
  onFinish,
}: {
  offers?: Offer[];
  draft?: RequestDraft | null;
  onFinish?: (payload: { offer: Offer; draft?: RequestDraft | null }) => void;
}) {
  const { data: hash, writeContract, isPending } = useWriteContract();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleConfirmLoan = () => {
    writeContract({
      address: import.meta.env.VITE_PRESTAMIGO_CONTRACT_ADDRESS as `0x${string}`,
      abi: PrestamigoAbi,
      functionName: "createLoan",
      args: [500, 100, false],
    });
  }

  console.log(hash, isPending);

  return (
    <div className="w-full">
      <Stepper step={step} />

      {step === 1 && (
        <OfferRecommendations
          offers={offers}
          onSelect={(offer) => { setSelectedOffer(offer); setStep(2); }}
        />
      )}

      {step === 2 && selectedOffer && (
        <ConfirmScreen
          offer={selectedOffer}
          draft={draft}
          onBack={() => setStep(1)}
          onConfirm={handleConfirmLoan}
        />
      )}

      {step === 3 && selectedOffer && (
        <DepositSuccess
          offer={selectedOffer}
          draft={draft}
          onFinish={() => onFinish?.({ offer: selectedOffer, draft })}
        />
      )}
    </div>
  );
}

function Chip({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-foreground/[0.06] px-3 py-1 text-xs font-medium ring-1 ring-foreground/10">
      {icon && <span className="text-foreground/70">{icon}</span>}
      {label}
    </span>
  );
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon && <span className="text-foreground/60">{icon}</span>}
        <span className="font-semibold">{label}</span>
      </div>
      <span>{value}</span>
    </li>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
