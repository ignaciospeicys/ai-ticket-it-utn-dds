import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { api } from "../../api";
import { useResource } from "../../useResource";
import { useRedirect, useSession } from "../../session";
import { Action, Card, Copy, ErrorText, Field, Muted, Screen, dateLabel } from "../../ui";

export default function Messages() {
  const { id } = useLocalSearchParams();
  const { user } = useSession();
  const path = user && id ? `/purchases/${id}/messages` : null;
  const messages = useResource(path, user);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const redirect = useRedirect();
  if (redirect) return redirect;

  async function send() {
    setSaving(true);
    setError("");
    try {
      await api(path, { user, method: "POST", body: { text } });
      setText("");
      messages.reload();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      {messages.loading && <Copy>Cargando mensajes…</Copy>}
      <ErrorText error={messages.error || error} />
      {messages.data && <>
        {messages.data.length === 0 && <Muted>Todavía no hay mensajes en esta compra.</Muted>}
        {messages.data.map((message) => (
          <Card key={message.id}>
            <Muted>{message.authorName} · {dateLabel(message.date)}</Muted>
            <Copy>{message.text}</Copy>
          </Card>
        ))}
        <Action secondary icon="refresh" onPress={messages.reload}>Actualizar conversación</Action>
        <Field label="Mensaje" multiline maxLength={1000} value={text} onChangeText={setText} />
        <Action disabled={!text.trim() || saving} onPress={send}>Enviar</Action>
      </>}
    </Screen>
  );
}
