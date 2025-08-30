import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { fmtHNL } from "../utils/constants";
import type { Transaction } from "../types";

type Props = {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
};

export default function TransactionDetailsModal({ open, transaction, onClose }: Props) {
  return (
    <Modal isOpen={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }} placement="center">
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">Detalle de transacción</ModalHeader>
          <ModalBody>
            {transaction ? (
              <div className="space-y-2 text-foreground/80">
                <div className="flex items-center justify-between"><span className="font-medium">ID</span><span>{transaction.id}</span></div>
                <div className="flex items-center justify-between"><span className="font-medium">Fecha</span><span>{new Date(transaction.date).toLocaleString("es-HN")}</span></div>
                <div className="flex items-center justify-between"><span className="font-medium">Descripción</span><span>{transaction.description}</span></div>
                <div className="flex items-center justify-between"><span className="font-medium">Monto</span><span className={transaction.amount < 0 ? "text-danger" : "text-success"}>{fmtHNL.format(transaction.amount)}</span></div>
                <div className="flex items-center justify-between"><span className="font-medium">Método</span><span>{transaction.method}</span></div>
                <div className="flex items-center justify-between"><span className="font-medium">Referencia</span><span>{transaction.reference}</span></div>
              </div>
            ) : (
              <p>No hay datos para mostrar.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Cerrar</Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
