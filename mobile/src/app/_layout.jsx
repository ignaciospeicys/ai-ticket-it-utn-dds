import { Stack } from "expo-router";
import { SessionProvider } from "../session";

export default function Layout() {
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerTintColor: "#142c25", headerShadowVisible: false }}>
        <Stack.Screen name="index" options={{ title: "AI Ticket It" }} />
      </Stack>
    </SessionProvider>
  );
}
