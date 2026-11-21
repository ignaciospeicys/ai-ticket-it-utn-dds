# Compra y seguimiento

El comprador puede comprar y consultar el estado de sus entradas. El organizador ve las ventas y el cupo.

Depende de [CATALOG](CATALOG.md), [ORGANIZER](ORGANIZER.md).

- [x] BUY-01 Calcular disponibilidad por tipo de entrada a partir de las compras que ocupan cupo.
- [x] BUY-02 Validar cantidad, fecha y disponibilidad. Registrar PENDIENTE en la misma operación.
- [x] BUY-03 Verificar por HTTP que dos compras sobre el último cupo no se confirmen ambas como reservas.
- [x] BUY-04 Agregar pago simulado PENDIENTE → CONFIRMADA para el dueño de la compra.
- [x] BUY-05 Mostrar selector de tipo de entrada, cantidad, total y acción de compra.
- [x] BUY-06 Mostrar el resultado de la reserva y conectar el botón de pago simulado.
- [x] BUY-07 Listar compras del comprador y devolver los días restantes para las confirmadas.
- [x] BUY-08 Mostrar Mis compras con estado, días restantes y acceso al detalle.
- [x] BUY-09 Listar compras y cupos disponibles por tipo para el organizador dueño del evento.
- [x] BUY-10 Mostrar ventas y disponibilidad en la pantalla de gestión del evento.
