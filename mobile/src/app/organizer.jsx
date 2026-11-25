import { router } from "expo-router";
import { EventCard } from "../eventCard";
import { useResource } from "../useResource";
import { useRedirect, useSession } from "../session";
import { Action, Copy, ErrorText, Screen } from "../ui";

export default function Organizer() {
  const { user } = useSession();
  const redirect = useRedirect("organizer");
  const events = useResource(user?.role === "organizer" ? "/organizer/events" : null, user);
  if (redirect) return redirect;

  return (
    <Screen title="Mis eventos" subtitle={`${user.name} · Organizador`}>
      <Action icon="add" onPress={() => router.push("/new-event")}>Publicar evento</Action>
      {events.loading && <Copy>Cargando eventos…</Copy>}
      <ErrorText error={events.error} />
      {events.data?.length === 0 && <Copy>Todavía no publicaste eventos.</Copy>}
      {events.data?.map((event) => <EventCard key={event.id} event={event} organizer />)}
    </Screen>
  );
}
