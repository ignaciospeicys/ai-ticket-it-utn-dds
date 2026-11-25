import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { homeFor, useSession } from "../session";
import { useResource } from "../useResource";
import { Action, Avatar, Chevron, Copy, ErrorText, Grow, Heading, Muted, Screen, colors } from "../ui";

const groups = [
  ["buyer", "Comprador", "Comprador · eventos y entradas"],
  ["organizer", "Organizadores", "Organizador · publicación y ventas"],
];

export default function Login() {
  const { user, signIn, setUsers } = useSession();
  const health = useResource("/health");
  const users = useResource(health.data ? "/demo/users" : null);
  const error = health.error || users.error;

  useEffect(() => {
    if (users.data) setUsers(users.data);
  }, [users.data, setUsers]);

  if (user) return <Redirect href={homeFor(user)} />;

  return (
    <Screen>
      <View style={styles.intro}>
        <View style={styles.mark}><Ionicons name="ticket-outline" size={28} color="#fff" /></View>
        <Text accessibilityRole="header" style={styles.name}>AI Ticket It</Text>
        <Copy>Elegí una cuenta de demostración para ingresar. No hace falta contraseña.</Copy>
      </View>

      {groups.map(([role, heading, detail]) => {
        const options = users.data?.filter((option) => option.role === role) ?? [];
        return options.length > 0 && (
          <View key={role} style={styles.group}>
            <Heading>{heading}</Heading>
            <View style={styles.list}>
              {options.map((option, index) => (
                <Pressable key={option.id} accessibilityRole="button" onPress={() => signIn(option)}
                  style={({ pressed }) => [styles.item, index > 0 && styles.divider, pressed && styles.pressed]}>
                  <Avatar user={option} />
                  <Grow>
                    <Text style={styles.itemName}>{option.name}</Text>
                    <Muted>{detail}</Muted>
                  </Grow>
                  <Chevron />
                </Pressable>
              ))}
            </View>
          </View>
        );
      })}

      <ErrorText error={error} />
      {error && <Action secondary onPress={health.error ? health.reload : users.reload}>Reintentar</Action>}
      <View style={styles.status}>
        <View style={[styles.dot, health.error && styles.dotError, !health.data && !health.error && styles.dotIdle]} />
        <Muted>{health.data ? "API conectada" : health.error ? "API sin conexión" : "Conectando con la API…"} · Proyecto de demostración</Muted>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 12, marginTop: 56, marginBottom: 12 },
  mark: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  name: { color: colors.ink, fontSize: 30, lineHeight: 36, fontWeight: "700", letterSpacing: -0.4 },
  group: { gap: 8 },
  list: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.line },
  item: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  divider: { borderTopWidth: 1, borderTopColor: colors.line },
  pressed: { opacity: 0.75 },
  itemName: { color: colors.ink, fontSize: 17, fontWeight: "600" },
  status: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  dotError: { backgroundColor: colors.danger },
  dotIdle: { backgroundColor: colors.inputLine },
});
