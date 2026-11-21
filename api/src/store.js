export function createStore(now = new Date()) {
  const dateInDays = (days) => new Date(now.getTime() + days * 86_400_000).toISOString();
  const users = [
    { id: "buyer", role: "buyer", name: "Sofía" },
    { id: "organizer", role: "organizer", name: "Estudio Sur" },
    { id: "other", role: "organizer", name: "Escena Norte" },
  ];
  const events = [
    {
      id: "jazz", organizerId: "organizer", title: "Jazz en el patio",
      description: "Una noche de jazz en vivo al aire libre.",
      category: "Música", date: dateInDays(14),
      tickets: [
        { id: "general", name: "General", price: 800000, capacity: 1 },
        { id: "platea", name: "Platea", price: 1400000, capacity: 6 },
      ],
    },
    {
      id: "theater", organizerId: "other", title: "Historias de barrio",
      description: "Teatro independiente en una sala íntima.",
      category: "Teatro", date: dateInDays(8),
      tickets: [{ id: "general", name: "General", price: 950000, capacity: 20 }],
    },
    {
      id: "past", organizerId: "organizer", title: "Sesión acústica",
      description: "Recital acústico de la temporada anterior.",
      category: "Música", date: dateInDays(-7),
      tickets: [{ id: "general", name: "General", price: 650000, capacity: 20 }],
    },
  ];
  return {
    users, events, favorites: new Map(), messages: [], reviews: [],
    purchases: [{
      id: "used-demo", eventId: "past", ticketId: "general", buyerId: "buyer",
      quantity: 1, unitPrice: 650000, status: "USED", createdAt: dateInDays(-12),
    }],
  };
}
