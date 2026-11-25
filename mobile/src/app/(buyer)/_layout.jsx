import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router/js-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRedirect } from "../../session";
import { colors } from "../../ui";

const tabs = [
  ["catalog", "Explorar", "compass-outline"],
  ["favorites", "Favoritos", "heart-outline"],
  ["purchases", "Mis compras", "ticket-outline"],
];

export default function BuyerTabs() {
  const insets = useSafeAreaInsets();
  const redirect = useRedirect("buyer");
  if (redirect) return redirect;
  return (
    <Tabs screenOptions={{
      headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted,
      tabBarStyle: {
        backgroundColor: colors.surface, borderTopColor: colors.line,
        height: 68 + insets.bottom, paddingTop: 4, paddingBottom: insets.bottom + 4,
      },
      tabBarLabelStyle: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
    }}>
      {tabs.map(([name, title, icon]) => (
        <Tabs.Screen key={name} name={name} options={{
          title, tabBarIcon: ({ color, size }) => <Ionicons name={icon} size={size} color={color} />,
        }} />
      ))}
    </Tabs>
  );
}
