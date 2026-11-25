import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Action, Card, Chevron, Copy, DateBlock, Grow, Muted, Row, Title, colors, money } from "./ui";

export function EventCard({ event, organizer = false }) {
  const summary = (
    <Row>
      <DateBlock date={event.date} />
      <Grow>
        <Text style={styles.category}>{event.category}</Text>
        <Title>{event.title}</Title>
        <Muted>
          {event.organizerName}{event.organizerRating !== null ? ` · ${event.organizerRating.toFixed(1)}/5` : ""}
        </Muted>
        <Copy strong>Desde {money(event.minPrice)}</Copy>
      </Grow>
      {!organizer && <Chevron />}
    </Row>
  );

  if (!organizer) return <Card onPress={() => router.push(`/events/${event.id}`)}>{summary}</Card>;
  return (
    <Card>
      {summary}
      <Row>
        <View style={styles.half}><Action onPress={() => router.push(`/sales/${event.id}`)}>Ver ventas</Action></View>
        <View style={styles.half}><Action secondary onPress={() => router.push(`/events/${event.id}`)}>Ver evento</Action></View>
      </Row>
    </Card>
  );
}

const styles = StyleSheet.create({
  category: { color: colors.primary, fontSize: 13, fontWeight: "600" },
  half: { flex: 1 },
});
