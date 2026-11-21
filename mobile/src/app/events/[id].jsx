import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image } from "react-native";
import { api } from "../../api";
import { useResource } from "../../useResource";
import { useSession } from "../../session";
import { Action, Card, Copy, ErrorText, Screen, Title, dateLabel, money } from "../../ui";

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useSession();
  const event = useResource(id ? `/events/${id}` : null);
  const favorites = useResource(user?.role === "buyer" ? "/favorites" : null, user);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const data = event.data;
  const saved = favorites.data?.some((item) => item.id === id);

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
        {data.tickets.map((ticket) => <Card key={ticket.id}><Copy>{ticket.name} · {money(ticket.price)}</Copy></Card>)}
      </>}
    </Screen>
  );
}
