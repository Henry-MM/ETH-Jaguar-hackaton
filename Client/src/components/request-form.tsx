import { useMemo, useState } from "react";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { formatCustomCurrency } from "../utils/constants";

type ContinuePayload = {
  amount: number;
  maxMonthly: number;
  tasa: number;              // el valor que uses (porcentaje o monto)
  interestAmount: number;    // HNL
  total: number;             // HNL
  months: number;            // # de meses
  monthlyPayment: number;    // HNL/mes
};

type Props = {
  onContinue: (payload: ContinuePayload) => void;
};

export default function RequestForm({ onContinue }: Props) {
  const [amount, setAmount] = useState(10_000);
  const [maxMonthly, setMaxMonthly] = useState(Math.round(10_000 * 0.05));
  const [accept, setAccept] = useState(false);

  const MIN = 1_000; // HNL
  const MAX = 100_000;
  const taza = 30; 

  const interestAmount = useMemo(() => {
    return amount * (taza / 100)
  }, [amount, taza]);

  const total = useMemo(() => amount + interestAmount, [amount, interestAmount]);

  const months = useMemo(() => {
    const safeMax = Math.max(1, maxMonthly); 
    return Math.max(1, Math.ceil(total / safeMax));
  }, [total, maxMonthly]);

  const monthlyPayment = useMemo(() => {
    return total / months;
  }, [total, months]);

  const valid = useMemo(() => {
    const base = amount >= MIN && amount <= MAX && !!maxMonthly && accept;
    return base;
  }, [amount, maxMonthly, accept]);

  return (
    <section id="request-form" className="w-full max-w-2xl p-4 md:p-6">
      <Card className="py-10 mx-[10%]">
        <CardHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Solicitar préstamo</h2>
          <p className="text-small text-foreground/70">Completa los campos</p>
        </CardHeader>

        <CardBody className="grid grid-cols-1 gap-5 md:grid-cols-1 px-6">
          <div className="space-y-4">
            <Input
              type="number"
              label="¿Cuánto necesitas?"
              value={String(amount)}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={MIN}
              max={MAX}
              startContent={<span className="text-foreground/60">LPC</span>}
              description={`Entre ${formatCustomCurrency(MIN, "", "LPC ")} y ${formatCustomCurrency(MAX, "", "LPC ")}`}
            />

            <Input
              type="number"
              label="Monto máximo que puedes pagar mensualmente"
              value={String(maxMonthly)}
              onChange={(e) => setMaxMonthly(Number(e.target.value))}
              min={Math.round(MIN * 0.05)}
              max={Math.round(MAX * 0.5)}
              startContent={<span className="text-foreground/60">LPC</span>}
              description={`Sugerido: ${formatCustomCurrency(Math.round(amount * 0.05), "", "LPC ")} (≈ 5% de tu monto)`}
            />

            <Switch className="mt-4 text-[#22c2ab]" isSelected={accept} onValueChange={setAccept}>
              Acepto los <Link href="/terms" className="underline">términos</Link> y autorizo revisión de historial.
            </Switch>

            <Button
              className="bg-[#22c2ab] text-white font-bold w-full"
              variant="shadow"
              radius="full"
              isDisabled={!valid}
              onPress={() =>
                onContinue({
                  amount,
                  maxMonthly,
                  tasa: taza,
                  interestAmount,
                  total,
                  months,
                  monthlyPayment,
                })
              }
            >
              Continuar
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
