// src/components/PaymentWizard.tsx
import  { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { RadioGroup, Radio } from "@heroui/radio";
import { HiCheck, HiCalendar } from "react-icons/hi";

const fmtHNL = new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL" });

type LoanSummary = {
  loanId: string;
  borrowerName?: string;
  originalAmount: number;
  nextDueAmount: number;   // Monto de la próxima cuota
  nextDueDate: string;     // ISO
  totalBalance: number;    // Saldo total pendiente
  minPayment: number;      // Pago mínimo permitido
};

type PaymentDraft = {
  amount: number;
  mode: "cuota" | "total";
  method: "tarjeta" | "efectivo";
  bank?: string | null;
};

type Props = {
  loan?: LoanSummary;
  onFinish?: (r: { receiptId: string; amount: number; method: string; bank?: string | null; newBalance: number }) => void;
};



type Step = 1 | 2 | 3;

export default function PaymentWizard({ loan = DEFAULT_LOAN, onFinish }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<PaymentDraft>(() => ({
    amount: loan.nextDueAmount,
    mode: "cuota",
    method: "tarjeta",
    bank: null,
  }));
  const [receiptId, setReceiptId] = useState<string>("");

  const newBalance = useMemo(() => Math.max(loan.totalBalance - (draft.amount || 0), 0), [loan.totalBalance, draft.amount]);

  return (
    <div className="w-full">
      <Stepper step={step} />
      <LoanInfoBar loan={loan} />

      {step === 1 && (
        <SelectPaymentStep
          loan={loan}
          draft={draft}
          onChange={setDraft}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <ConfirmPaymentStep
          loan={loan}
          draft={draft}
          newBalance={newBalance}
          onBack={() => setStep(1)}
          onConfirm={() => {
            const id = `RCPT-${Date.now().toString().slice(-6)}`;
            setReceiptId(id);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <SuccessStep
          loan={loan}
          draft={draft}
          receiptId={receiptId}
          newBalance={newBalance}
          onFinish={() => onFinish?.({
            receiptId,
            amount: draft.amount,
            method: draft.method,
            bank: draft.bank ?? undefined,
            newBalance,
          })}
        />
      )}
    </div>
  );
}

/* ---------- Paso 1: Seleccionar pago ---------- */
function SelectPaymentStep({
  loan, draft, onChange, onContinue,
}: {
  loan: LoanSummary;
  draft: PaymentDraft;
  onChange: (d: PaymentDraft) => void;
  onContinue: () => void;
}) {
  const { amount, mode } = draft;

  // Reglas de validación
  const min = loan.minPayment;
  const max = loan.totalBalance;
  const isValidAmount = amount >= min && amount <= max;

  return (
    <section className="w-full flex items-center justify-center p-6">
      <Card className="w-full p-6 max-w-md md:max-w-xl rounded-3xl shadow-2xl">
        <CardHeader className="text-center">
          <h3 className="text-lg font-semibold">Seleccionar pago</h3>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="rounded-2xl border border-foreground/10 p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Próxima cuota</span>
              <strong>{fmtHNL.format(loan.nextDueAmount)}</strong>
            </div>
            <div className="flex items-center justify-between text-sm pt-3 text-foreground/70">
              <span>Fecha máxima de próximo pago</span>
              <span className="inline-flex items-center gap-1">
                <HiCalendar /> {formatDate(loan.nextDueDate)}
              </span>
            </div>
          </div>

          <RadioGroup
            label="Modo de pago"
            orientation="horizontal"
            value={mode}
            onValueChange={(v) => {
              const newMode = v as PaymentDraft["mode"];
              let newAmount = amount;
              if (newMode === "cuota") newAmount = loan.nextDueAmount;
              if (newMode === "total") newAmount = loan.totalBalance;
              onChange({ ...draft, mode: newMode, amount: newAmount });
            }}
          >
            <Radio value="cuota">Cuota</Radio>
            <Radio value="cuota-parcial">Cuota parcial</Radio>
            <Radio value="total">Total</Radio>
          </RadioGroup>

          <Input
            type="number"
            label="Monto a pagar"
            value={String(amount)}
            onChange={(e) => onChange({ ...draft, amount: Number(e.target.value) })}
            min={min}
            max={max}
            startContent={<span className="text-foreground/60">HNL</span>}
            description={`Mínimo ${fmtHNL.format(min)} • Máximo ${fmtHNL.format(max)}`}
            validationState={isValidAmount ? "valid" : "invalid"}
            errorMessage={!isValidAmount ? "Monto fuera de rango" : undefined}
          />


          <div className="flex justify-end">
            <Button
              className="bg-[#22c2ab] text-white font-bold"
              isDisabled={!isValidAmount}
              onPress={onContinue}
            >
              Continuar
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}

/* ---------- Paso 2: Confirmar ---------- */
function ConfirmPaymentStep({
  loan, draft, newBalance, onBack, onConfirm,
}: {
  loan: LoanSummary;
  draft: PaymentDraft;
  newBalance: number;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <section className="w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md md:max-w-xl rounded-3xl shadow-2xl">
        <CardHeader className="text-center">
          <h3 className="text-lg font-semibold">Confirmar pago</h3>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="text-center space-y-1">
            <p className="text-base text-foreground/80">
              Vas a pagar <strong>{fmtHNL.format(draft.amount)}</strong>
            </p>
         
          </div>

          <div className="rounded-2xl border border-foreground/10 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span>Saldo actual</span>
              <strong>{fmtHNL.format(loan.totalBalance)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Monto a pagar</span>
              <strong>-{fmtHNL.format(draft.amount)}</strong>
            </div>
            <div className="mt-2 h-px w-full bg-foreground/10" />
            <div className="flex items-center justify-between mt-2">
              <span>Nuevo saldo</span>
              <strong>{fmtHNL.format(newBalance)}</strong>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="flat" onPress={onBack}>Volver</Button>
            <Button  className="bg-[#22c2ab] text-white font-bold" onPress={onConfirm}>Confirmar pago</Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}

/* ---------- Paso 3: Éxito / Recibo ---------- */
function SuccessStep({
  loan, draft, receiptId, newBalance, onFinish,
}: {
  loan: LoanSummary;
  draft: PaymentDraft;
  receiptId: string;
  newBalance: number;
  onFinish: () => void;
}) {
  return (
    <section className="w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md md:max-w-xl rounded-3xl shadow-2xl">
        <CardBody className="py-10 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <HiCheck className="text-[#22c2ab]" size={32} />
          </div>
          <h2 className="text-2xl font-semibold">¡Pago realizado!</h2>
          <p className="text-foreground/70">
            Recibo <strong>{receiptId}</strong>. Monto: <strong>{fmtHNL.format(draft.amount)}</strong>.
          </p>

          <div className="mx-auto mt-4 w-full max-w-sm text-left space-y-2 text-sm">
            <div className="flex justify-between"><span>Nuevo saldo</span><strong>{fmtHNL.format(newBalance)}</strong></div>
            <div className="flex justify-between"><span>Próxima cuota</span><strong>{fmtHNL.format(loan.nextDueAmount)}</strong></div>
            <div className="flex justify-between"><span>Fecha próxima cuota</span><strong>{formatDate(loan.nextDueDate)}</strong></div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Button as={"a"} href="/request?tab=history" variant="flat">Ver historial</Button>
            <Button  className="bg-[#22c2ab] text-white font-bold" onPress={onFinish}>Finalizar</Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}

/* ---------- Stepper ---------- */
function Stepper({ step }: { step: Step }) {
  const labels = ["Seleccionar pago", "Confirmación", "Pago realizado"];
  const pct = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-6">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-foreground/70">
        {labels.map((l, i) => (
          <div key={l} className="flex items-center gap-2">
            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-white text-xs ${i + 1 <= step ? "bg-[#22c2ab]" : "bg-foreground/30"}`}>
              {i + 1}
            </span>
            <span className={`${i + 1 === step ? "text-foreground" : ""}`}>{l}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-foreground/10 overflow-hidden">
        <div className="h-full bg-[#22c2ab] transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */
const DEFAULT_LOAN: LoanSummary = {
  loanId: "LN-001",
  borrowerName: "Francisco Madrid",
  nextDueAmount: 1350,
  originalAmount: 10000,
  nextDueDate: "2025-10-05",
  totalBalance: 8650,
  minPayment: 1350,
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function LoanInfoBar({ loan }: { loan: LoanSummary }) {
  const paid = Math.max(loan.originalAmount - loan.totalBalance, 0);
  const pct = loan.originalAmount > 0 ? Math.min(100, Math.round((paid / loan.originalAmount) * 100)) : 0;
  const remainingAmount = loan.originalAmount - paid;

  return (
    <div className="w-full max-w-xl mx-auto px-6 pt-4">
      <div className="rounded-2xl   p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm sm:text-base">
            Te faltan <strong>{fmtHNL.format(remainingAmount)}</strong> para saldar tu préstamo de <strong>{fmtHNL.format(loan.originalAmount)}</strong>.
          </p>
        </div>

        <div className="mt-3 h-2 w-full rounded-full bg-foreground/10 overflow-hidden">
          <div className="h-full bg-[#22c2ab] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

