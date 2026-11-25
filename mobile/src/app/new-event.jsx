import { router } from "expo-router";
import { useState } from "react";
import { api } from "../api";
import { useRedirect, useSession } from "../session";
import { Action, Card, Copy, ErrorText, Field, Heading, Screen } from "../ui";

const fields = [["title", "Título"], ["description", "Descripción"], ["category", "Categoría"], ["date", "Fecha y hora local"], ["imageUrl", "URL HTTPS de imagen (opcional)"]];
const ticketFields = [["name", "Nombre"], ["price", "Precio en pesos"], ["capacity", "Cupo"]];
const emptyTicket = (id) => ({ id, name: "", price: "", capacity: "" });

export default function NewEvent() {
  const { user } = useSession();
  const [form, setForm] = useState({});
  const [tickets, setTickets] = useState([emptyTicket(0)]);
  const [nextId, setNextId] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const redirect = useRedirect("organizer");
  if (redirect) return redirect;

  async function publish() {
    setError("");
    setSaving(true);
    try {
      const date = new Date(form.date?.trim().replace(" ", "T"));
      if (!Number.isFinite(date.getTime())) throw new Error("Usá el formato AAAA-MM-DD HH:mm.");
      const types = tickets.map(({ name, price, capacity }) => {
        if (!/^\d+(?:[.,]\d{1,2})?$/.test(price.trim()) || !/^\d+$/.test(capacity.trim())) {
          throw new Error("Ingresá un precio en pesos y un cupo entero.");
        }
        return { name, price: Math.round(Number(price.replace(",", ".")) * 100), capacity: Number(capacity) };
      });
      await api("/events", { user, method: "POST", body: { ...form, date: date.toISOString(), tickets: types } });
      router.back();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      {fields.map(([key, label]) => (
        <Field key={key} label={label} value={form[key] ?? ""} placeholder={key === "date" ? "AAAA-MM-DD HH:mm" : undefined}
          multiline={key === "description"} onChangeText={(text) => setForm((current) => ({ ...current, [key]: text }))} />
      ))}
      <Heading>Tipos de entrada</Heading>
      {tickets.map((ticket, index) => (
        <Card key={ticket.id}>
          <Copy strong>Tipo {index + 1}</Copy>
          {ticketFields.map(([key, label]) => (
            <Field key={key} label={label} value={ticket[key]} keyboardType={key === "name" ? "default" : "decimal-pad"}
              onChangeText={(text) => setTickets((current) => current.map((item) => item.id === ticket.id ? { ...item, [key]: text } : item))} />
          ))}
          {tickets.length > 1 && <Action secondary onPress={() => setTickets((current) => current.filter((item) => item.id !== ticket.id))}>Quitar tipo</Action>}
        </Card>
      ))}
      <Action secondary icon="add" disabled={tickets.length >= 20} onPress={() => { setTickets([...tickets, emptyTicket(nextId)]); setNextId(nextId + 1); }}>Agregar tipo</Action>
      <ErrorText error={error} />
      <Action disabled={saving || user?.role !== "organizer"} onPress={publish}>{saving ? "Publicando…" : "Publicar"}</Action>
    </Screen>
  );
}
