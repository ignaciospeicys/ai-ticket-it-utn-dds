# Video para el TP individual

## Recorrido de 5 a 10 minutos

1. **0:00–0:45.** Presentá AI Ticket It y las dos cuentas de demo. Entrá como Sofía y abrí *Jazz en el patio*.
2. **0:45–2:15.** Seleccioná una General, reservá y simulá el pago. Mostrá la compra confirmada y el contador de días. Ese tipo de entrada arranca con un solo cupo.
3. **2:15–4:00.** Señalá en el editor el botón de reserva en `mobile/src/app/events/[id].jsx`, el cliente en `mobile/src/api.js`, la ruta en `api/src/app.js` y la regla en `api/src/purchases.js`. Explicá por qué se valida y registra el cupo en la misma operación.
4. **4:00–5:30.** Cancelá la compra y mostrá el estado reembolsado. Volvé a *Mis compras*, tocá el avatar de arriba a la derecha, cambiá a Estudio Sur y abrí las ventas de *Jazz en el patio*. Mostrá el lugar recuperado y la compra en el historial.
5. **5:30–6:30.** Explicá dónde ayudó la IA, qué requería revisión y qué aprendiste. Usá un ejemplo que realmente puedas defender.

## Insumos para la reflexión

- La IA ayudó a traducir el enunciado a tareas cortas y construir rutas, pantallas y pruebas en incrementos.
- Un primer borrador de la pantalla comparaba la fecha del evento con el reloj del teléfono durante el render. El lint lo detectó. La API ahora publica si la venta está abierta y vuelve a verificarlo al reservar.
- La prueba del último lugar envía dos solicitudes juntas. Una recibe una reserva y la otra recibe un conflicto. Podemos señalar el test y explicar su alcance en un único proceso.
- El test de cancelación intenta la misma transición dos veces y comprueba que solo se recupera un lugar. Sirve para verificar una regla de negocio más allá de ver el botón funcionar.

## Otros datos de demo

- *Sesión acústica* ya pasó. Sofía tiene una entrada utilizada para probar una reseña y ver cómo influye en los eventos de Estudio Sur.
- El chat se abre desde el detalle de una compra y desde las ventas del organizador. Después de cambiar de cuenta, se puede responder en la misma conversación.
