import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Button } from "@heroui/button";
import { fmtHNL } from "../utils/constants";
import type { Transaction } from "../types";

type Props = {
  transactions: Transaction[];
  onSelect: (t: Transaction) => void;
};

export default function TransactionsTable({ transactions, onSelect }: Props) {
  return (
    <Table aria-label="Tabla de transacciones" removeWrapper className="bg-content1 rounded-2xl">
      <TableHeader>
        <TableColumn>Fecha</TableColumn>
        <TableColumn>Descripción</TableColumn>
        <TableColumn className="text-right">Monto</TableColumn>
        <TableColumn>Detalles</TableColumn>
      </TableHeader>
      <TableBody emptyContent="Sin transacciones">
        {transactions.map((t) => (
          <TableRow key={t.id} className="hover:bg-foreground/5">
            <TableCell>{new Date(t.date).toLocaleDateString("es-HN")}</TableCell>
            <TableCell>{t.description}</TableCell>
            <TableCell className={`text-right ${t.amount < 0 ? "text-danger" : "text-success"}`}>{fmtHNL.format(t.amount)}</TableCell>
            <TableCell>
              <Button size="sm" variant="flat" onPress={() => onSelect(t)}>Ver detalles</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
