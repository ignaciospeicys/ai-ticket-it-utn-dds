import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { api } from "../../api";
import { useResource } from "../../useResource";
import { useSession } from "../../session";
import { statuses } from "../../purchaseStatus";
import { Action, Card, Copy, ErrorText, Screen, Title } from "../../ui";

export default function Sales() {
  const { id } = useLocalSearchParams();
  const { user } = useSession();
  const sales = useResource(user?.role === "organizer" && id ? `/organizer/events/${id}/sales` : null, user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function markTicketUsed(purchaseId) {
    setError("");
    setSaving(true);
    try {
      await api(`/purchases/${purchaseId}/use`, { user, method: "POST" });
      sales.reload();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      {user?.role !== "organizer" && <Copy>Elegí una cuenta de organizador en el inicio.</Copy>}
      {sales.loading && <Copy>Cargando ventas…</Copy>}
      <ErrorText error={sales.error || error} />
      {sales.data && <>
        <Title>{sales.data.title}</Title>
        <Card>
          <Title>Disponibilidad</Title>
          {sales.data.tickets.map((ticket) => (
            <Copy key={ticket.id}>{ticket.name} · {ticket.available} de {ticket.capacity} disponibles</Copy>
          ))}
        </Card>
        <Title>Ventas</Title>
        {sales.data.purchases.length === 0 && <Copy>Sin compras para este evento.</Copy>}
        {sales.data.purchases.map((purchase) => (
          <Card key={purchase.id}>
            <Copy>{purchase.buyerName} · {purchase.quantity} × {purchase.ticketName}</Copy>
            <Copy>{statuses[purchase.status]}</Copy>
            {purchase.canUse && <Action disabled={saving} onPress={() => markTicketUsed(purchase.id)}>Marcar utilizada</Action>}
            <Action secondary onPress={() => router.push(`/messages/${purchase.id}`)}>Ver mensajes</Action>
          </Card>
        ))}
      </>}
    </Screen>
  );
}
