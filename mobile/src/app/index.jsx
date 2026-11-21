import { useEffect, useState } from "react";
import { api } from "../api";
import { useSession } from "../session";
import { Action, Card, Copy, ErrorText, Screen, Title } from "../ui";

export default function Home() {
  const { user, setUser } = useSession();
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("Conectando con la API…");
  const [error, setError] = useState("");

  async function connect() {
    setError("");
    try {
      await api("/health");
      setUsers(await api("/demo/users"));
      setStatus("API conectada");
    } catch (failure) {
      setStatus("API sin conexión");
      setError(failure.message);
    }
  }

  useEffect(() => { void connect(); }, []);

  return (
    <Screen>
      <Title>AI Ticket It</Title>
      <Copy>{status}</Copy>
      <ErrorText error={error} />
      {error && <Action onPress={connect}>Reintentar</Action>}
      {user ? (
        <Card>
          <Copy>{user.name} · {user.role === "buyer" ? "Comprador" : "Organizador"}</Copy>
          <Action secondary onPress={() => setUser(null)}>Cambiar de cuenta</Action>
        </Card>
      ) : users.map((option) => (
        <Action key={option.id} onPress={() => setUser(option)}>
          {option.name} · {option.role === "buyer" ? "Comprador" : "Organizador"}
        </Action>
      ))}
    </Screen>
  );
}
