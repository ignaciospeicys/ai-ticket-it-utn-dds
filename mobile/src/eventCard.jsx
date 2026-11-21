import { router } from "expo-router";
import { Action, Card, Copy, Title, dateLabel, money } from "./ui";

export function EventCard({ event }) {
  return (
    <Card>
      <Copy>{event.category} · {dateLabel(event.date)}</Copy>
      <Title>{event.title}</Title>
      <Copy>{event.organizerName} · Desde {money(event.minPrice)}</Copy>
      {event.organizerRating !== null && <Copy>Puntaje del organizador {event.organizerRating.toFixed(1)}/5</Copy>}
      <Action secondary onPress={() => router.push(`/events/${event.id}`)}>Ver evento</Action>
    </Card>
  );
}
