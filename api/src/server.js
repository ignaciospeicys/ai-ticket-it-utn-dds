import { createApp } from "./app.js";

const port = process.env.PORT ?? 3001;
createApp().listen(Number(port), "0.0.0.0", () => {
  console.log(`AI Ticket It API · http://localhost:${port}`);
});
