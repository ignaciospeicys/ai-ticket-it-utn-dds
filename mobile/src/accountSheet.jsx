import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { roleLabel, useSession } from "./session";
import { Action, Avatar, Grow, Muted, colors } from "./ui";

// Drawn as an overlay inside the app tree (not a native modal) so it stays within the web phone frame.
export function AccountSheet() {
  const { user, users, signIn, accountOpen, closeAccount } = useSession();
  const insets = useSafeAreaInsets();
  if (!accountOpen || !user) return null;

  return (
    <View style={styles.overlay}>
      <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" style={styles.backdrop} onPress={closeAccount} />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.handle} />
        <Text accessibilityRole="header" style={styles.title}>Cambiar de cuenta</Text>
        <Muted>Cuentas de demostración. Cada una ve la app según su rol.</Muted>
        <View style={styles.list}>
          {users.map((option, index) => {
            const current = option.id === user.id;
            return (
              <Pressable key={option.id} accessibilityRole="button" accessibilityState={{ selected: current }}
                onPress={() => current ? closeAccount() : signIn(option)}
                style={[styles.item, index > 0 && styles.divider]}>
                <Avatar user={option} />
                <Grow>
                  <Text style={styles.name}>{option.name}</Text>
                  <Muted>{roleLabel(option)}{current ? " · cuenta actual" : ""}</Muted>
                </Grow>
                {current && <Ionicons name="checkmark" size={22} color={colors.primary} />}
              </Pressable>
            );
          })}
        </View>
        <Action secondary onPress={() => signIn(null)}>Cerrar sesión</Action>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(20, 44, 37, 0.45)" },
  sheet: { backgroundColor: colors.ground, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 10, paddingHorizontal: 20, gap: 10 },
  handle: { alignSelf: "center", width: 40, height: 5, borderRadius: 3, backgroundColor: colors.inputLine, marginBottom: 6 },
  title: { color: colors.ink, fontSize: 22, lineHeight: 28, fontWeight: "700" },
  list: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.line, marginVertical: 8 },
  item: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  divider: { borderTopWidth: 1, borderTopColor: colors.line },
  name: { color: colors.ink, fontSize: 17, fontWeight: "600" },
});
