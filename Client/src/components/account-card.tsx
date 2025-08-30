import { Card, CardBody, CardHeader } from "@heroui/card";

export default function AccountCard() {
  return (
    <section className="w-full max-w-3xl p-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Mi cuenta</h2>
        </CardHeader>
        <CardBody>
          <p className="text-foreground/80"> verificación, métodos de pago, preferencias y seguridad.</p>
        </CardBody>
      </Card>
    </section>
  );
}
