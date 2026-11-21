import { EventCard } from "../eventCard";
import { useResource } from "../useResource";
import { useSession } from "../session";
import { Copy, ErrorText, Screen, Title } from "../ui";

export default function Favorites() {
  const { user } = useSession();
  const favorites = useResource(user?.role === "buyer" ? "/favorites" : null, user);

  return (
    <Screen>
      <Title>Favoritos</Title>
      {!user && <Copy>Elegí una cuenta de comprador en el inicio.</Copy>}
      {favorites.loading && <Copy>Cargando favoritos…</Copy>}
      <ErrorText error={favorites.error} />
      {favorites.data?.length === 0 && <Copy>Todavía no guardaste eventos.</Copy>}
      {favorites.data?.map((event) => <EventCard key={event.id} event={event} />)}
    </Screen>
  );
}
