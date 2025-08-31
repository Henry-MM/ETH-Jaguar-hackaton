import  { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { formatCustomCurrency } from "../utils/constants";
import type { Transaction } from "../types";
import TransactionsTable from "./transactions-table";
import TransactionDetailsModal from "./transaction-details-modal";

const seed: Transaction[] = [
  { date: "2025-08-01", description: "Pago de préstamo", amount: -2500, id: "TX-001", method: "Transferencia", reference: "ABCD1234" },
  { date: "2025-07-15", description: "Depósito", amount: 8000, id: "TX-002", method: "Tarjeta", reference: "EFGH5678" },
  { date: "2025-06-10", description: "Depósito #1", amount: -1250, id: "TX-003", method: "Efectivo", reference: "IJKL9012" },
  { date: "2025-06-10", description: "Depósito #2", amount: -1250, id: "TX-004", method: "Efectivo", reference: "MNOP3456" },
  { date: "2025-06-10", description: "Depósito #3", amount: -1250, id: "TX-005", method: "Efectivo", reference: "QRST7890" },
  { date: "2025-06-10", description: "Depósito #4", amount: -1250, id: "TX-006", method: "Efectivo", reference: "UVWX2345" },
  { date: "2025-06-10", description: "Depósito #5", amount: -1250, id: "TX-007", method: "Efectivo", reference: "YZAB6789" },
  { date: "2025-06-10", description: "Depósito #6", amount: -1250, id: "TX-008", method: "Efectivo", reference: "CDEF0123" },
];

export default function CreditHistory() {
  const [transactions] = useState<Transaction[]>(seed);
  const totalAmount = useMemo(() => transactions.reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);

  return (
    <section className="w-full max-w-3xl p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-col items-start gap-1">
          <h2 className="text-2xl font-bold text-foreground">Historial de transacciones</h2>
          <p className="text-small text-foreground/70">Resumen y movimientos recientes</p>
        </CardHeader>
        <CardBody>
          <div className="mb-4 rounded-2xl border border-foreground/10 p-4">
            <h3 className="text-base font-semibold">Resumen</h3>
            <p className="text-foreground/80">Total: <strong>{formatCustomCurrency(totalAmount, "", "LPC ")}</strong></p>
          </div>

          <TransactionsTable
            transactions={transactions}
            onSelect={(t) => { setSelected(t); setOpen(true); }}
          />
        </CardBody>
      </Card>

      <TransactionDetailsModal open={open} transaction={selected} onClose={() => setOpen(false)} />
    </section>
  );
}
