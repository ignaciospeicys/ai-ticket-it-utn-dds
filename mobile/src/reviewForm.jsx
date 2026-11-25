import { useState } from "react";
import { api } from "./api";
import { Action, Card, ErrorText, Field, Muted, Segmented, Title } from "./ui";

const ratings = ["1", "2", "3", "4", "5"].map((value) => [value, value]);

export function ReviewForm({ purchase, user, onSaved }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setSaving(true);
    setError("");
    try {
      await api(`/purchases/${purchase.id}/reviews`, {
        user, method: "POST", body: { rating: Number(rating), comment },
      });
      onSaved();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <Title>Calificá el evento</Title>
      <Muted>Puntaje de 1 a 5</Muted>
      <Segmented label="Puntaje de 1 a 5" options={ratings} value={rating} onChange={setRating} />
      <Field label="Comentario" multiline maxLength={1000} value={comment} onChangeText={setComment} />
      <ErrorText error={error} />
      <Action disabled={saving || !/^[1-5]$/.test(rating) || !comment.trim()} onPress={submit}>Publicar reseña</Action>
    </Card>
  );
}
