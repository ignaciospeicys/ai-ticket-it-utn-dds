import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { api } from "../../api";
import { useResource } from "../../useResource";
import { useSession } from "../../session";
import { statuses } from "../../purchaseStatus";
import { Action, Card, Copy, ErrorText, Screen, Title, dateLabel, money } from "../../ui";

export default function PurchaseDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useSession();
  const purchase = useResource(user && id ? `/purchases/${id}` : null, user);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const data = purchase.data;

  async function submit(action) {
    setError("");
    setSaving(true);
    try {
      await api(`/purchases/${id}/${action}`, { user, method: "POST" });
      setConfirmCancel(false);
      purchase.reload();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      {!user && <Copy>Elegí una cuenta de demo en el inicio.</Copy>}
      {purchase.loading && <Copy>Cargando compra…</Copy>}
      <ErrorText error={purchase.error || error} />
      {data && <>
        <Title>{data.eventTitle}</Title>
        <Card>
          <Copy>{statuses[data.status]}</Copy>
          <Copy>{data.quantity} × {data.ticketName} · {money(data.total)}</Copy>
          <Copy>{dateLabel(data.eventDate)}</Copy>
          {data.daysLeft !== null && <Copy>Faltan {data.daysLeft} días para el evento.</Copy>}
        </Card>
        {user.role === "buyer" && data.status === "PENDING" && data.canCancel && (
          <Action disabled={saving} onPress={() => submit("pay")}>Simular pago</Action>
        )}
        {user.role === "buyer" && data.canCancel && (
          confirmCancel ? <Card>
            <Copy>La entrada vuelve a estar disponible. Si ya pagaste, se registra un reembolso simulado.</Copy>
            <Action disabled={saving} onPress={() => submit("cancel")}>Confirmar cancelación</Action>
            <Action secondary disabled={saving} onPress={() => setConfirmCancel(false)}>Conservar compra</Action>
          </Card> : <Action secondary disabled={saving} onPress={() => setConfirmCancel(true)}>Cancelar compra</Action>
        )}
        <Action secondary onPress={() => router.push(`/messages/${id}`)}>Ver mensajes</Action>
      </>}
    </Screen>
  );
}
