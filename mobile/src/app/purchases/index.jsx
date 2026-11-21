import { router } from "expo-router";
import { useResource } from "../../useResource";
import { useSession } from "../../session";
import { statuses } from "../../purchaseStatus";
import { Action, Card, Copy, ErrorText, Screen, Title } from "../../ui";

export default function Purchases() {
  const { user } = useSession();
  const purchases = useResource(user?.role === "buyer" ? "/purchases" : null, user);
  return (
    <Screen>
      <Title>Mis compras</Title>
      {user?.role !== "buyer" && <Copy>Elegí una cuenta de comprador en el inicio.</Copy>}
      {purchases.loading && <Copy>Cargando compras…</Copy>}
      <ErrorText error={purchases.error} />
      {purchases.data?.length === 0 && <Copy>Todavía no tenés compras.</Copy>}
      {purchases.data?.map((purchase) => (
        <Card key={purchase.id}>
          <Title>{purchase.eventTitle}</Title>
          <Copy>{statuses[purchase.status]}{purchase.daysLeft !== null ? ` · Faltan ${purchase.daysLeft} días` : ""}</Copy>
          <Action secondary onPress={() => router.push(`/purchases/${purchase.id}`)}>Ver compra</Action>
        </Card>
      ))}
    </Screen>
  );
}
