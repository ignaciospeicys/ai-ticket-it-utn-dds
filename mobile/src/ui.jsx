import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export function Screen({ children }) {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}

export function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

export function Title({ children }) {
  return <Text accessibilityRole="header" style={styles.title}>{children}</Text>;
}

export function Copy({ children }) {
  return <Text style={styles.copy}>{children}</Text>;
}

export function Action({ children, onPress, secondary = false, disabled = false }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={[styles.action, secondary && styles.secondary, disabled && styles.disabled]}>
      <Text style={[styles.actionText, secondary && styles.secondaryText]}>{children}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }) {
  return <View style={styles.field}><Copy>{label}</Copy><TextInput accessibilityLabel={label} style={styles.input} placeholderTextColor="#687a71" {...props} /></View>;
}

export function ErrorText({ error }) {
  return error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null;
}

export const money = (cents) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(cents / 100);
export const dateLabel = (date) => new Date(date).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" });

const styles = StyleSheet.create({
  screen: { backgroundColor: "#f4f6ef", flex: 1 },
  content: { width: "100%", maxWidth: 660, alignSelf: "center", padding: 20, gap: 12 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 9, borderColor: "#dbe4d9", borderWidth: 1 },
  title: { color: "#142c25", fontSize: 25, fontWeight: "700" },
  copy: { color: "#324b41", fontSize: 16, lineHeight: 23 },
  action: { minHeight: 46, justifyContent: "center", alignItems: "center", backgroundColor: "#20634f", borderRadius: 10, padding: 10 },
  actionText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
  secondary: { backgroundColor: "#e7f0e8" },
  secondaryText: { color: "#214739" },
  disabled: { opacity: 0.6 },
  field: { gap: 4 },
  input: { minHeight: 46, borderWidth: 1, borderColor: "#b5c6ba", borderRadius: 9, padding: 10, color: "#142c25", backgroundColor: "#fff" },
  error: { color: "#a12e26", fontSize: 16 },
});
