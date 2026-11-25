import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import { api } from "../../api";
import { useResource } from "../../useResource";
import { useRedirect, useSession } from "../../session";
import { statuses, statusTones } from "../../purchaseStatus";
import { Action, Badge, Card, Copy, ErrorText, Grow, Heading, Muted, Row, Screen, colors } from "../../ui";

export default function Sales() {
  const { id } = useLocalSearchParams();
  const { user } = useSession();
  const redirect = useRedirect("organizer");
  const sales = useResource(user?.role === "organizer" && id ? `/organizer/events/${id}/sales` : null, user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  if (redirect) return redirect;

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
      {sales.loading && <Copy>Cargando ventas…</Copy>}
      <ErrorText error={sales.error || error} />
      {sales.data && <>
        <Text accessibilityRole="header" style={{ color: colors.ink, fontSize: 24, lineHeight: 30, fontWeight: "700" }}>{sales.data.title}</Text>
        <Heading>Disponibilidad</Heading>
        <Card>
          {sales.data.tickets.map((ticket) => (
            <Row key={ticket.id}>
              <Grow><Copy strong>{ticket.name}</Copy></Grow>
              <Copy>{ticket.available} de {ticket.capacity} disponibles</Copy>
            </Row>
          ))}
        </Card>
        <Heading>Ventas</Heading>
        {sales.data.purchases.length === 0 && <Muted>Sin compras para este evento.</Muted>}
        {sales.data.purchases.map((purchase) => (
          <Card key={purchase.id}>
            <Row>
              <Grow>
                <Copy strong>{purchase.buyerName}</Copy>
                <Muted>{purchase.quantity} × {purchase.ticketName}</Muted>
              </Grow>
              <Badge tone={statusTones[purchase.status]}>{statuses[purchase.status]}</Badge>
            </Row>
            {purchase.canUse && <Action disabled={saving} onPress={() => markTicketUsed(purchase.id)}>Marcar utilizada</Action>}
            <Action secondary icon="chatbubble-outline" onPress={() => router.push(`/messages/${purchase.id}`)}>Ver mensajes</Action>
          </Card>
        ))}
      </>}
    </Screen>
  );
}
