import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Transaction = {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number; // negative = egreso, positive = ingreso
  method: string;
  reference: string;
};

export type TabKey = "request" | "history" | "account";

export type Offer = {
  id: string;
  amount: number;          // Monto que recibe el solicitante
  monthlyPayment: number;  // Cuota mensual
  months: number;          // Nº de meses
  taza: number;            // % anual (dejé "taza" para compatibilidad; puedes renombrar a "tasa" o "apr")
  serviceFee: number;      // Comisión de servicio (HNL)
  firstPaymentDate: string;
  lastPaymentDate: string;
  lender?: string;
  verified?: boolean;
  tag?: string;
};
