import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { EventCard } from "../../eventCard";
import { useResource } from "../../useResource";
import { Action, Chip, Copy, ErrorText, IconButton, Muted, Row, Screen, Segmented, colors } from "../../ui";

const orders = [["date", "Fecha"], ["price", "Precio"], ["rating", "Puntaje"]];

export default function Catalog() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState("date");
  const categories = useResource("/categories");
  const params = new URLSearchParams({ q: search, category, sort: order });
  const events = useResource(`/events?${params}`);

  return (
    <Screen title="Explorar">
      <Row>
        <TextInput accessibilityLabel="Buscar por título o descripción" placeholder="Buscar eventos" placeholderTextColor="#687a71"
          returnKeyType="search" style={styles.search} value={query} onChangeText={setQuery} onSubmitEditing={() => setSearch(query)} />
        <IconButton icon="search" label="Buscar" onPress={() => setSearch(query)} />
      </Row>
      <ErrorText error={categories.error} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {["", ...(categories.data ?? [])].map((value) => (
          <Chip key={value} selected={category === value} onPress={() => setCategory(value)}>{value || "Todas"}</Chip>
        ))}
      </ScrollView>
      <Row>
        <Muted>Ordenar</Muted>
        <View style={styles.order}><Segmented label="Ordenar por" options={orders} value={order} onChange={setOrder} /></View>
      </Row>
      {events.loading && <Copy>Cargando eventos…</Copy>}
      <ErrorText error={events.error} />
      {events.error && <Action secondary onPress={events.reload}>Reintentar</Action>}
      {events.data?.length === 0 && <Copy>No hay eventos para estos filtros.</Copy>}
      {events.data?.map((event) => <EventCard key={event.id} event={event} />)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { flex: 1, minHeight: 46, borderWidth: 1, borderColor: colors.inputLine, borderRadius: 12, paddingHorizontal: 12, fontSize: 16, color: colors.ink, backgroundColor: colors.surface },
  chips: { gap: 8 },
  order: { flex: 1 },
});
