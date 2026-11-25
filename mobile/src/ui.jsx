import Ionicons from "@expo/vector-icons/Ionicons";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { roleLabel, useSession } from "./session";

export const colors = {
  ground: "#f4f6ef", surface: "#fff", line: "#dbe4d9", inputLine: "#b5c6ba", ink: "#142c25",
  copy: "#324b41", muted: "#4d6258", primary: "#20634f", soft: "#e7f0e8", softInk: "#1a5140", danger: "#a12e26",
};

const tones = {
  neutral: ["#e8ebe6", "#414f48"], green: [colors.soft, colors.softInk], amber: ["#fbefd2", "#6b4a00"],
  red: ["#f7e0dd", "#8a251e"], blue: ["#dfeaf5", "#1f4a75"],
};

// `title` turns the screen into a top-level one: large heading plus the account button.
export function Screen({ children, title, subtitle, footer }) {
  const insets = useSafeAreaInsets();
  const { user, openAccount } = useSession();
  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={Platform.OS !== "web"}
        contentContainerStyle={[styles.content, title && { paddingTop: Math.max(insets.top, 12) + 14 }]}>
        {title && (
          <View style={styles.topRow}>
            <View style={styles.grow}>
              {subtitle && <Muted>{subtitle}</Muted>}
              <Text accessibilityRole="header" style={styles.pageTitle}>{title}</Text>
            </View>
            {user && (
              <Pressable accessibilityRole="button" onPress={openAccount}
                accessibilityLabel={`Cuenta: ${user.name}, ${roleLabel(user)}. Cambiar de cuenta`}>
                <Avatar user={user} />
              </Pressable>
            )}
          </View>
        )}
        {children}
      </ScrollView>
      {footer && <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}>{footer}</View>}
    </View>
  );
}

export function Card({ children, onPress, selected = false, accessibilityRole = "button", accessibilityState }) {
  const style = [styles.card, selected && styles.cardSelected];
  if (!onPress) return <View style={style}>{children}</View>;
  return (
    <Pressable accessibilityRole={accessibilityRole} accessibilityState={accessibilityState} onPress={onPress}
      style={({ pressed }) => [style, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

export function Row({ children, style }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

export function Grow({ children }) {
  return <View style={styles.grow}>{children}</View>;
}

export function Chevron() {
  return <Ionicons name="chevron-forward" size={20} color={colors.muted} />;
}

export function Title({ children }) {
  return <Text accessibilityRole="header" style={styles.title}>{children}</Text>;
}

export function Heading({ children }) {
  return <Text accessibilityRole="header" style={styles.heading}>{children}</Text>;
}

export function Copy({ children, strong = false }) {
  return <Text style={[styles.copy, strong && styles.strong]}>{children}</Text>;
}

export function Muted({ children }) {
  return <Text style={styles.muted}>{children}</Text>;
}

export function Action({ children, onPress, secondary = false, disabled = false, icon }) {
  const color = secondary ? "#214739" : "#fff";
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.action, secondary && styles.secondary, disabled && styles.disabled, pressed && styles.pressed]}>
      {icon && <Ionicons name={icon} size={20} color={color} />}
      <Text style={[styles.actionText, { color }]}>{children}</Text>
    </Pressable>
  );
}

export function IconButton({ icon, label, onPress, disabled = false, active = false }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled, selected: active }}
      disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.iconButton, active && styles.iconButtonActive, disabled && styles.disabled, pressed && styles.pressed]}>
      <Ionicons name={icon} size={22} color={active ? colors.primary : colors.ink} />
    </Pressable>
  );
}

export function Chip({ children, selected = false, onPress }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{children}</Text>
    </Pressable>
  );
}

// options: [[value, label], ...]
export function Segmented({ options, value, onChange, label }) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.segmented}>
      {options.map(([key, text]) => (
        <Pressable key={key} accessibilityRole="radio" accessibilityState={{ checked: key === value }}
          onPress={() => onChange(key)} style={[styles.segment, key === value && styles.segmentSelected]}>
          <Text style={[styles.segmentText, key === value && styles.strong]}>{text}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const [backgroundColor, color] = tones[tone] ?? tones.neutral;
  return <View style={[styles.badge, { backgroundColor }]}><Text style={[styles.badgeText, { color }]}>{children}</Text></View>;
}

export function Avatar({ user }) {
  const solid = user.role === "organizer";
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  return (
    <View style={[styles.avatar, solid && styles.avatarSolid]}>
      <Text style={[styles.avatarText, solid && styles.avatarTextSolid]}>{initials}</Text>
    </View>
  );
}

export function DateBlock({ date }) {
  const value = new Date(date);
  return (
    <View style={styles.dateBlock}>
      <Text style={styles.dateDay}>{value.toLocaleDateString("es-AR", { day: "numeric" })}</Text>
      <Text style={styles.dateMonth}>{value.toLocaleDateString("es-AR", { month: "short" }).replace(".", "")}</Text>
    </View>
  );
}

export function Stepper({ value, onChange, min = 1, max }) {
  return (
    <Row>
      <IconButton icon="remove" label="Quitar una" disabled={value <= min} onPress={() => onChange(value - 1)} />
      <Text accessibilityLiveRegion="polite" style={styles.stepperValue}>{value}</Text>
      <IconButton icon="add" label="Agregar una" disabled={value >= max} onPress={() => onChange(value + 1)} />
    </Row>
  );
}

export function Field({ label, ...props }) {
  return <View style={styles.field}><Muted>{label}</Muted><TextInput accessibilityLabel={label} style={styles.input} placeholderTextColor="#687a71" {...props} /></View>;
}

export function ErrorText({ error }) {
  return error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null;
}

export const money = (cents) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(cents / 100);
export const dateLabel = (date) => new Date(date).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" });

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.ground, flex: 1 },
  scroll: { flex: 1 },
  content: { width: "100%", maxWidth: 660, alignSelf: "center", padding: 20, gap: 12 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 4 },
  grow: { flex: 1, minWidth: 0, gap: 3 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  pageTitle: { color: colors.ink, fontSize: 28, lineHeight: 34, fontWeight: "700", letterSpacing: -0.4 },
  footer: { flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12, paddingHorizontal: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, gap: 9, borderColor: colors.line, borderWidth: 1 },
  cardSelected: { borderColor: colors.primary, borderWidth: 2, padding: 13 },
  pressed: { opacity: 0.75 },
  title: { color: colors.ink, fontSize: 18, lineHeight: 23, fontWeight: "700" },
  heading: { color: colors.muted, fontSize: 13, fontWeight: "600", letterSpacing: 0.6, textTransform: "uppercase", marginTop: 10 },
  copy: { color: colors.copy, fontSize: 16, lineHeight: 23 },
  strong: { color: colors.ink, fontWeight: "600" },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  action: { minHeight: 48, flexDirection: "row", gap: 8, justifyContent: "center", alignItems: "center", backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 },
  actionText: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  secondary: { backgroundColor: colors.soft },
  disabled: { opacity: 0.5 },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.inputLine },
  iconButtonActive: { backgroundColor: colors.soft, borderColor: colors.primary },
  chip: { minHeight: 44, justifyContent: "center", paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: colors.inputLine, backgroundColor: colors.surface },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: "#214739", fontSize: 15, fontWeight: "500" },
  chipTextSelected: { color: "#fff", fontWeight: "600" },
  segmented: { flexDirection: "row", padding: 3, borderRadius: 10, backgroundColor: "#e3eae2" },
  segment: { flex: 1, minHeight: 40, justifyContent: "center", alignItems: "center", paddingHorizontal: 12, borderRadius: 8 },
  segmentSelected: { backgroundColor: colors.surface },
  segmentText: { color: colors.copy, fontSize: 14, fontWeight: "500" },
  badge: { alignSelf: "flex-start", minHeight: 26, justifyContent: "center", paddingHorizontal: 10, borderRadius: 13 },
  badgeText: { fontSize: 13, fontWeight: "600" },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.soft },
  avatarSolid: { backgroundColor: colors.primary },
  avatarText: { color: colors.softInk, fontSize: 16, fontWeight: "700" },
  avatarTextSolid: { color: "#fff" },
  dateBlock: { width: 54, height: 60, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.soft },
  dateDay: { color: colors.softInk, fontSize: 22, lineHeight: 25, fontWeight: "700" },
  dateMonth: { color: colors.softInk, fontSize: 12, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },
  stepperValue: { minWidth: 28, textAlign: "center", color: colors.ink, fontSize: 18, fontWeight: "700" },
  field: { gap: 4 },
  input: { minHeight: 46, borderWidth: 1, borderColor: colors.inputLine, borderRadius: 12, padding: 10, fontSize: 16, color: colors.ink, backgroundColor: colors.surface },
  error: { color: colors.danger, fontSize: 16 },
});
