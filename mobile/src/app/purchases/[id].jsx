import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { api } from "../../api";
import { useResource } from "../../useResource";
import { useRedirect, useSession } from "../../session";
import { statuses, statusTones } from "../../purchaseStatus";
import { ReviewForm } from "../../reviewForm";
import { Action, Badge, Card, Copy, ErrorText, Muted, Screen, Title, dateLabel, money } from "../../ui";

export default function PurchaseDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useSession();
  const redirect = useRedirect();
  const purchase = useResource(user && id ? `/purchases/${id}` : null, user);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reviewSaved, setReviewSaved] = useState(false);
  const data = purchase.data;
  if (redirect) return redirect;

  // Closes the pushed screens (event, purchase) and lands on one of the buyer tabs.
  function goTo(tab) {
    if (router.canDismiss()) router.dismissAll();
    router.navigate(tab);
  }

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
      {purchase.loading && <Copy>Cargando compra…</Copy>}
      <ErrorText error={purchase.error || error} />
      {data && <>
        <Card>
          <Badge tone={statusTones[data.status]}>{statuses[data.status]}</Badge>
          <Title>{data.eventTitle}</Title>
          <Copy>{data.quantity} × {data.ticketName} · {money(data.total)}</Copy>
          <Muted>{dateLabel(data.eventDate)}</Muted>
          {data.daysLeft !== null && <Copy strong>Faltan {data.daysLeft} días para el evento.</Copy>}
        </Card>
        {user.role === "buyer" && data.status === "PENDING" && data.canCancel && (
          <Action icon="card-outline" disabled={saving} onPress={() => submit("pay")}>Simular pago</Action>
        )}
        {user.role === "buyer" && data.status === "CONFIRMED" && <>
          <Copy>Tu compra quedó confirmada. La encontrás en Mis compras.</Copy>
          <Action icon="compass-outline" onPress={() => goTo("/catalog")}>Volver al inicio</Action>
          <Action secondary icon="ticket-outline" onPress={() => goTo("/purchases")}>Ver mis compras</Action>
        </>}
        <Action secondary icon="chatbubble-outline" onPress={() => router.push(`/messages/${id}`)}>Ver mensajes</Action>
        {user.role === "buyer" && data.canCancel && (
          confirmCancel ? <Card>
            <Copy>La entrada vuelve a estar disponible. Si ya pagaste, se registra un reembolso simulado.</Copy>
            <Action disabled={saving} onPress={() => submit("cancel")}>Confirmar cancelación</Action>
            <Action secondary disabled={saving} onPress={() => setConfirmCancel(false)}>Conservar compra</Action>
          </Card> : <Action secondary disabled={saving} onPress={() => setConfirmCancel(true)}>Cancelar compra</Action>
        )}
        {data.canReview && <ReviewForm purchase={data} user={user} onSaved={() => { setReviewSaved(true); purchase.reload(); }} />}
        {reviewSaved && <Copy>Reseña publicada.</Copy>}
      </>}
    </Screen>
  );
}
