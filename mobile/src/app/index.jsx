import { router } from "expo-router";
import { useSession } from "../session";
import { useResource } from "../useResource";
import { Action, Card, Copy, ErrorText, Screen, Title } from "../ui";

export default function Home() {
  const { user, setUser } = useSession();
  const health = useResource("/health");
  const users = useResource(health.data ? "/demo/users" : null);
  const error = health.error || users.error;

  return (
    <Screen>
      <Title>AI Ticket It</Title>
      <Copy>{health.data ? "API conectada" : health.error ? "API sin conexión" : "Conectando con la API…"}</Copy>
      <ErrorText error={error} />
      {error && <Action onPress={health.error ? health.reload : users.reload}>Reintentar</Action>}
      {user ? (
        <Card>
          <Copy>{user.name} · {user.role === "buyer" ? "Comprador" : "Organizador"}</Copy>
          {user.role === "buyer" ? <>
            <Action onPress={() => router.push("/catalog")}>Explorar eventos</Action>
            <Action secondary onPress={() => router.push("/favorites")}>Favoritos</Action>
            <Action secondary onPress={() => router.push("/purchases")}>Mis compras</Action>
          </> : <Action onPress={() => router.push("/organizer")}>Mis eventos</Action>}
          <Action secondary onPress={() => setUser(null)}>Cambiar de cuenta</Action>
        </Card>
      ) : users.data?.map((option) => (
        <Action key={option.id} onPress={() => setUser(option)}>
          {option.name} · {option.role === "buyer" ? "Comprador" : "Organizador"}
        </Action>
      ))}
    </Screen>
  );
}
