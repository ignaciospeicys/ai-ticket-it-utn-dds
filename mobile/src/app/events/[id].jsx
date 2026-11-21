import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image } from "react-native";
import { api } from "../../api";
import { useResource } from "../../useResource";
import { useSession } from "../../session";
import { Action, Card, Copy, ErrorText, Field, Screen, Title, dateLabel, money } from "../../ui";

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useSession();
  const event = useResource(id ? `/events/${id}` : null);
  const favorites = useResource(user?.role === "buyer" ? "/favorites" : null, user);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const data = event.data;
  const saved = favorites.data?.some((item) => item.id === id);
  const selected = data?.tickets.find((item) => item.id === ticketId);
  const count = /^\d+$/.test(quantity.trim()) ? Number(quantity) : 0;

  async function reserve() {
    setError("");
    setSaving(true);
    try {
      const purchase = await api(`/events/${id}/purchases`, {
        user, method: "POST", body: { ticketId, quantity: count },
      });
      router.push(`/purchases/${purchase.id}`);
    } catch (failure) {
      setError(failure.message);
      event.reload();
    } finally {
      setSaving(false);
    }
  }

  async function toggleFavorite() {
    setError("");
    setSaving(true);
    try {
      await api(`/favorites/${id}`, { user, method: saved ? "DELETE" : "PUT" });
      favorites.reload();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      {event.loading && <Copy>Cargando evento…</Copy>}
      <ErrorText error={event.error || favorites.error || error} />
      {data && <>
        <Title>{data.title}</Title>
        <Copy>{data.category} · {dateLabel(data.date)}</Copy>
        <Copy>{data.organizerName}</Copy>
        <Copy>{data.description}</Copy>
        {data.imageUrl && <Image source={{ uri: data.imageUrl }} style={{ width: "100%", height: 190, borderRadius: 12 }} />}
        {favorites.data && <Action secondary disabled={saving} onPress={toggleFavorite}>{saved ? "Quitar de favoritos" : "Guardar en favoritos"}</Action>}
        <Title>Entradas</Title>
        {data.tickets.map((ticket) => (
          <Card key={ticket.id}>
            <Copy>{ticket.name} · {money(ticket.price)} · {ticket.available} disponibles</Copy>
            {user?.role === "buyer" && data.salesOpen && (
              <Action secondary={ticket.id !== ticketId} disabled={ticket.available <= 0} onPress={() => setTicketId(ticket.id)}>
                {ticket.id === ticketId ? "Seleccionada" : "Seleccionar"}
              </Action>
            )}
          </Card>
        ))}
        {selected && data.salesOpen && user?.role === "buyer" && <>
          <Field label="Cantidad" value={quantity} onChangeText={setQuantity} keyboardType="number-pad" />
          <Copy>Total {money(count * selected.price)}</Copy>
          <Action disabled={saving || count < 1 || count > selected.available} onPress={reserve}>Reservar entradas</Action>
        </>}
        <Title>Reseñas del organizador</Title>
        {data.reviews.length === 0 && <Copy>Todavía no hay reseñas de eventos anteriores.</Copy>}
        {data.reviews.map((review) => (
          <Card key={review.id}>
            <Copy>{review.eventTitle} · {review.rating}/5</Copy>
            <Copy>{review.comment}</Copy>
            <Copy>{review.authorName}</Copy>
          </Card>
        ))}
      </>}
    </Screen>
  );
}
