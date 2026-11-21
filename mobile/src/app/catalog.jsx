import { useState } from "react";
import { EventCard } from "../eventCard";
import { useResource } from "../useResource";
import { Action, Copy, ErrorText, Field, Screen, Title } from "../ui";

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
    <Screen>
      <Title>Explorar eventos</Title>
      <Field label="Buscar por título o descripción" value={query} onChangeText={setQuery} onSubmitEditing={() => setSearch(query)} />
      <Action onPress={() => setSearch(query)}>Buscar</Action>
      <Copy>Categoría</Copy>
      <ErrorText error={categories.error} />
      {["", ...(categories.data ?? [])].map((value) => (
        <Action key={value} secondary={category !== value} onPress={() => setCategory(value)}>{value || "Todas"}</Action>
      ))}
      <Copy>Ordenar por</Copy>
      {orders.map(([key, label]) => <Action key={key} secondary={order !== key} onPress={() => setOrder(key)}>{label}</Action>)}
      {events.loading && <Copy>Cargando eventos…</Copy>}
      <ErrorText error={events.error} />
      {events.error && <Action secondary onPress={events.reload}>Reintentar</Action>}
      {events.data?.length === 0 && <Copy>No hay eventos para estos filtros.</Copy>}
      {events.data?.map((event) => <EventCard key={event.id} event={event} />)}
    </Screen>
  );
}
