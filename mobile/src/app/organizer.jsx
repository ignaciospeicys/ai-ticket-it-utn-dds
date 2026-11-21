import { router } from "expo-router";
import { EventCard } from "../eventCard";
import { useResource } from "../useResource";
import { useSession } from "../session";
import { Action, Copy, ErrorText, Screen, Title } from "../ui";

export default function Organizer() {
  const { user } = useSession();
  const events = useResource(user?.role === "organizer" ? "/organizer/events" : null, user);

  return (
    <Screen>
      <Title>Mis eventos</Title>
      {user?.role === "organizer" ? <Action onPress={() => router.push("/new-event")}>Publicar evento</Action> : <Copy>Elegí una cuenta de organizador en el inicio.</Copy>}
      {events.loading && <Copy>Cargando eventos…</Copy>}
      <ErrorText error={events.error} />
      {events.data?.length === 0 && <Copy>Todavía no publicaste eventos.</Copy>}
      {events.data?.map((event) => <EventCard key={event.id} event={event} organizer />)}
    </Screen>
  );
}
