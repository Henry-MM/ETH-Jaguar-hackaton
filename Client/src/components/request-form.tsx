import React, { useMemo, useState } from "react";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { fmtHNL, banks } from "../utils/constants";

type Props = {
  onContinue: (form: {
    amount: number;
    months: number;
    maxMonthly: number;
    bank: string | null;
  }) => void;
};

export default function RequestForm({ onContinue }: Props) {
  const [amount, setAmount] = useState(10000);
  const [months, setMonths] = useState(12);
  const [maxMonthly, setMaxMonthly] = useState(Math.round(10000 * 0.05));
  const [bank, setBank] = useState<string | null>(null);
  const [accept, setAccept] = useState(false);

  const MIN = 1000; // HNL
  const MAX = 100000;

  const valid = useMemo(() => {
    const base = amount >= MIN && amount <= MAX && months >= 3 && months <= 36 && !!bank && accept;
    return base;
  }, [amount, months, bank, accept]);

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
              startContent={<span className="text-foreground/60">HNL</span>}
              description={`Entre ${fmtHNL.format(MIN)} y ${fmtHNL.format(MAX)}`}
            />

            <Input
              type="number"
              label="Monto máximo que puedes pagar mensualmente"
              value={String(maxMonthly)}
              onChange={(e) => setMaxMonthly(Number(e.target.value))}
              min={Math.round(MIN * 0.05)}
              max={Math.round(MAX * 0.5)}
              startContent={<span className="text-foreground/60">HNL</span>}
              description={`Sugerido: ${fmtHNL.format(Math.round(amount * 0.05))} (≈ 5% de tu monto)`}
            />

            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Select
                selectedKeys={bank ? [bank] : []}
                onSelectionChange={(keys) => {
                  const k = Array.from(keys)[0] as string | undefined;
                  setBank(k ?? null);
                }}
                className="max-w-xs"
                label="Banco donde lo deseas recibir"
                placeholder="Selecciona un banco"
              >
                {banks.map((b) => (
                  <SelectItem key={b.key}>{b.label}</SelectItem>
                ))}
              </Select>
            </div>

            <Switch className="mt-4" isSelected={accept} onValueChange={setAccept}>
              Acepto los <Link href="/terms" className="underline">términos</Link> y autorizo revisión de historial.
            </Switch>

            <Button color="success" variant="shadow" radius="full" isDisabled={!valid} className="w-full" onPress={() => onContinue({ amount, months, maxMonthly, bank })}>
              Continuar
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
