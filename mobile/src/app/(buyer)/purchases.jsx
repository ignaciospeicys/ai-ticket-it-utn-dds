import { router } from "expo-router";
import { useResource } from "../../useResource";
import { useSession } from "../../session";
import { isActive, statuses, statusTones } from "../../purchaseStatus";
import { Badge, Card, Chevron, Copy, ErrorText, Grow, Heading, Muted, Row, Screen, Title, dateLabel, money } from "../../ui";

function PurchaseCard({ purchase }) {
  return (
    <Card onPress={() => router.push(`/purchases/${purchase.id}`)}>
      <Row>
        <Grow><Badge tone={statusTones[purchase.status]}>{statuses[purchase.status]}</Badge></Grow>
        {purchase.daysLeft !== null && <Muted>Faltan {purchase.daysLeft} días</Muted>}
      </Row>
      <Row>
        <Grow>
          <Title>{purchase.eventTitle}</Title>
          <Copy>{purchase.quantity} × {purchase.ticketName} · {money(purchase.total)}</Copy>
          <Muted>{dateLabel(purchase.eventDate)}</Muted>
        </Grow>
        <Chevron />
      </Row>
    </Card>
  );
}

export default function Purchases() {
  const { user } = useSession();
  const purchases = useResource(user?.role === "buyer" ? "/purchases" : null, user);
  const active = purchases.data?.filter(isActive) ?? [];
  const past = purchases.data?.filter((purchase) => !isActive(purchase)) ?? [];

  return (
    <Screen title="Mis compras">
      {purchases.loading && <Copy>Cargando compras…</Copy>}
      <ErrorText error={purchases.error} />
      {purchases.data?.length === 0 && <Copy>Todavía no tenés compras.</Copy>}
      {active.length > 0 && <Heading>Activas</Heading>}
      {active.map((purchase) => <PurchaseCard key={purchase.id} purchase={purchase} />)}
      {past.length > 0 && <Heading>Historial</Heading>}
      {past.map((purchase) => <PurchaseCard key={purchase.id} purchase={purchase} />)}
    </Screen>
  );
}
