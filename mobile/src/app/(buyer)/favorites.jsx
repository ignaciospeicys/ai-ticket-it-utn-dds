import { EventCard } from "../../eventCard";
import { useResource } from "../../useResource";
import { useSession } from "../../session";
import { Copy, ErrorText, Screen } from "../../ui";

export default function Favorites() {
  const { user } = useSession();
  const favorites = useResource(user?.role === "buyer" ? "/favorites" : null, user);

  return (
    <Screen title="Favoritos">
      {favorites.loading && <Copy>Cargando favoritos…</Copy>}
      <ErrorText error={favorites.error} />
      {favorites.data?.length === 0 && <Copy>Todavía no guardaste eventos. Tocá el corazón en un evento para verlo acá.</Copy>}
      {favorites.data?.map((event) => <EventCard key={event.id} event={event} />)}
    </Screen>
  );
}
