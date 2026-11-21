import { useLocalSearchParams } from "expo-router";
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
  const data = purchase.data;

  async function pay() {
    setError("");
    setSaving(true);
    try {
      await api(`/purchases/${id}/pay`, { user, method: "POST" });
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
        {user.role === "buyer" && data.status === "PENDING" && <Action disabled={saving} onPress={pay}>Simular pago</Action>}
      </>}
    </Screen>
  );
}
