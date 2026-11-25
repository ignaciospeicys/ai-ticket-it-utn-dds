import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { api } from "../../api";
import { useResource } from "../../useResource";
import { useRedirect, useSession } from "../../session";
import { Action, Badge, Card, Copy, ErrorText, Grow, Heading, IconButton, Muted, Row, Screen, Stepper, colors, dateLabel, money } from "../../ui";

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useSession();
  const redirect = useRedirect();
  const event = useResource(id ? `/events/${id}` : null);
  const favorites = useResource(user?.role === "buyer" ? "/favorites" : null, user);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  if (redirect) return redirect;

  const data = event.data;
  const saved = favorites.data?.some((item) => item.id === id);
  const canBuy = user.role === "buyer" && data?.salesOpen;
  const selected = canBuy ? data.tickets.find((item) => item.id === ticketId) : null;
  const count = selected ? Math.min(quantity, selected.available) : 0;

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

  const footer = selected && <>
    <View>
      <Muted>Total</Muted>
      <Text style={styles.total}>{money(count * selected.price)}</Text>
    </View>
    <View style={styles.reserve}>
      <Action disabled={saving || count < 1} onPress={reserve}>Reservar entradas</Action>
    </View>
  </>;

  return (
    <Screen footer={footer}>
      {event.loading && <Copy>Cargando evento…</Copy>}
      <ErrorText error={event.error || favorites.error || error} />
      {data && <>
        {data.imageUrl && <Image source={{ uri: data.imageUrl }} style={styles.image} />}
        <Row>
          <Grow><Badge tone="green">{data.category}</Badge></Grow>
          {favorites.data && (
            <IconButton icon={saved ? "heart" : "heart-outline"} active={saved} disabled={saving} onPress={toggleFavorite}
              label={saved ? "Quitar de favoritos" : "Guardar en favoritos"} />
          )}
        </Row>
        <Text accessibilityRole="header" style={styles.title}>{data.title}</Text>
        <Copy>{dateLabel(data.date)}</Copy>
        <Copy>Organiza {data.organizerName}</Copy>
        <Copy>{data.description}</Copy>

        <Heading>Entradas</Heading>
        {!data.salesOpen && <Muted>La venta de este evento cerró.</Muted>}
        {data.tickets.map((ticket) => {
          const checked = ticket.id === selected?.id;
          const info = <>
            <Grow>
              <Copy strong>{ticket.name}</Copy>
              <Muted>{ticket.available > 1 ? `${ticket.available} disponibles` : ticket.available === 1 ? "1 disponible" : "Agotada"}</Muted>
            </Grow>
            <Copy strong>{money(ticket.price)}</Copy>
          </>;
          if (!canBuy || ticket.available <= 0) return <Card key={ticket.id}><Row>{info}</Row></Card>;
          return (
            <Card key={ticket.id} selected={checked} accessibilityRole="radio" accessibilityState={{ checked }}
              onPress={() => { setTicketId(ticket.id); setQuantity(1); }}>
              <Row>
                <Ionicons name={checked ? "radio-button-on" : "radio-button-off"} size={22} color={checked ? colors.primary : colors.muted} />
                {info}
              </Row>
            </Card>
          );
        })}
        {selected && (
          <Row>
            <Grow><Copy>Cantidad</Copy></Grow>
            <Stepper value={count} max={selected.available} onChange={setQuantity} />
          </Row>
        )}

        <Heading>Reseñas del organizador</Heading>
        {data.reviews.length === 0 && <Muted>Todavía no hay reseñas de eventos anteriores.</Muted>}
        {data.reviews.map((review) => (
          <Card key={review.id}>
            <Row>
              <Grow><Copy strong>{review.eventTitle}</Copy></Grow>
              <Badge tone="green">{review.rating}/5</Badge>
            </Row>
            <Copy>{review.comment}</Copy>
            <Muted>{review.authorName}</Muted>
          </Card>
        ))}
      </>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { width: "100%", height: 190, borderRadius: 16 },
  title: { color: colors.ink, fontSize: 28, lineHeight: 34, fontWeight: "700", letterSpacing: -0.4 },
  total: { color: colors.ink, fontSize: 20, fontWeight: "700" },
  reserve: { flex: 1 },
});
