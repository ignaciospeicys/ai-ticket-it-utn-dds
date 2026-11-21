import { Stack } from "expo-router";
import { SessionProvider } from "../session";

export default function Layout() {
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerTintColor: "#142c25", headerShadowVisible: false }}>
        <Stack.Screen name="index" options={{ title: "AI Ticket It" }} />
        <Stack.Screen name="catalog" options={{ title: "Catálogo" }} />
        <Stack.Screen name="favorites" options={{ title: "Favoritos" }} />
        <Stack.Screen name="events/[id]" options={{ title: "Evento" }} />
        <Stack.Screen name="organizer" options={{ title: "Organizador" }} />
        <Stack.Screen name="new-event" options={{ title: "Nuevo evento" }} />
        <Stack.Screen name="purchases/index" options={{ title: "Mis compras" }} />
        <Stack.Screen name="purchases/[id]" options={{ title: "Compra" }} />
        <Stack.Screen name="sales/[id]" options={{ title: "Ventas" }} />
      </Stack>
    </SessionProvider>
  );
}
