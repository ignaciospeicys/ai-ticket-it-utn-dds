# AI Ticket It

## Arquitectura

Dos paquetes JavaScript en el mismo proyecto. `api/` corre Node.js y Express en la Mac. `mobile/` corre React Native con Expo y Expo Router. La app habla JSON por HTTP mediante un cliente `fetch` central. Empezamos probando en un teléfono o simulador con la URL del backend configurada por ambiente. [Guía de desarrollo de Expo](https://docs.expo.dev/get-started/start-developing/).

En la API, las rutas validan entradas y traducen errores a HTTP. Los servicios concentran las reglas de eventos, compras, mensajes y reseñas. Un store en memoria se crea al arrancar y se puede reconstruir con datos de prueba. El servidor es dueño del estado y el teléfono vuelve a pedir los datos relevantes después de cada cambio. Las pruebas crean su propio store y pueden usar el runner de Node. [Documentación de `node:test`](https://nodejs.org/api/test.html).

En mobile, las pantallas organizan el flujo y los formularios con estado local. El único estado compartido necesario al principio es la identidad de demo. La app muestra dos identidades precargadas para ejercer los roles de comprador y organizador. La API identifica al usuario de demo y verifica titularidad de la compra o del evento para ejecutar acciones. Es un mecanismo local de demostración.

## Reglas que vamos a implementar

- Un evento pertenece a un organizador y tiene categoría, fecha y tipos de entrada. Cada tipo tiene precio y cupo. Los importes se guardan como enteros en centavos.
- Una compra guarda comprador, tipo de entrada, cantidad y precio al momento de comprar. La validación del cupo y la creación ocurren juntas en un servicio síncrono. Las compras pendientes reservan cupo. Las confirmadas y utilizadas lo siguen ocupando.
- El pago y el reembolso se simulan. El comprador puede cancelar antes del evento si la entrada sigue sin usar. Una compra pendiente pasa a cancelada y una confirmada pasa a reembolsada. Ambas liberan cupo una sola vez. El organizador marca una compra confirmada como utilizada desde el día del evento.
- Solo el comprador y el dueño del evento pueden leer y escribir los mensajes de esa compra. El chat carga el historial y se refresca al enviar o al volver a la pantalla.
- Una compra utilizada de un evento cuya fecha de inicio ya pasó habilita una reseña del comprador con puntaje de 1 a 5 y comentario. El modelo guarda la hora de inicio del evento. Las reseñas alimentan el promedio del organizador y se ven en sus eventos posteriores.
- El catálogo busca por texto y categoría, y ordena por menor precio de entrada, fecha o puntaje promedio del organizador. Los favoritos pertenecen a cada comprador. Las cuentas y los datos se pierden al reiniciar la API.

El enunciado define los casos de uso. Los roles de demo, la simulación de pagos, el momento en que se marca una entrada como usada y el detalle de las transiciones son decisiones de implementación para el alcance local.

Para el video, el flujo elegido es compra, pago simulado y cancelación con cupo recuperado. Permite mostrar la UI, la petición HTTP, la regla de negocio y el estado resultante. Una cuenta organizadora puede confirmar la recuperación del cupo desde su pantalla.
