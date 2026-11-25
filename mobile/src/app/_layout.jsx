import { Stack } from "expo-router";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { AccountSheet } from "../accountSheet";
import { SessionProvider } from "../session";
import { colors } from "../ui";

// On a desktop browser the app is held to a phone-sized frame, so demos and recordings look like a phone.
function PhoneFrame({ children }) {
  const { width, height } = useWindowDimensions();
  if (Platform.OS !== "web" || width < 600) return <View style={styles.fill}>{children}</View>;
  // Always lay out at 390×844 and shrink the whole frame when the window is shorter, so proportions never change.
  const scale = Math.min(1, (height - 32) / 844);
  return <View style={styles.backdrop}><View style={[styles.phone, { transform: [{ scale }] }]}>{children}</View></View>;
}

export default function Layout() {
  return (
    <SessionProvider>
      <PhoneFrame>
        <Stack screenOptions={{
          headerTintColor: colors.ink, headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.ground }, contentStyle: { backgroundColor: colors.ground },
        }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(buyer)" options={{ headerShown: false, title: "Inicio" }} />
          <Stack.Screen name="organizer" options={{ headerShown: false, title: "Mis eventos" }} />
          <Stack.Screen name="events/[id]" options={{ title: "Evento" }} />
          <Stack.Screen name="new-event" options={{ title: "Publicar evento" }} />
          <Stack.Screen name="purchases/[id]" options={{ title: "Compra" }} />
          <Stack.Screen name="sales/[id]" options={{ title: "Ventas" }} />
          <Stack.Screen name="messages/[id]" options={{ title: "Mensajes" }} />
        </Stack>
        <AccountSheet />
      </PhoneFrame>
    </SessionProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { flex: 1, alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#1c2420" },
  phone: { width: 390, height: 844, flexShrink: 0, overflow: "hidden", borderRadius: 36, backgroundColor: colors.ground },
});
