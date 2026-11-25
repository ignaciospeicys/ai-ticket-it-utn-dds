# AI Ticket It

Aplicación móvil de compra de entradas para el TP individual de Desarrollo de Software. Requiere Node.js 24, npm y un teléfono con Expo Go compatible con el SDK del proyecto o un simulador.

## Ejecutar en local

En una terminal, desde la raíz:

```sh
npm --prefix api ci
npm --prefix api start
```

En otra terminal:

```sh
npm --prefix mobile ci
cd mobile
npx expo start
```

Para un teléfono físico, conectalo al mismo Wi-Fi que la Mac. Copiá `mobile/.env.example` a `mobile/.env`, reemplazá `localhost` por la IP LAN de la Mac y reiniciá Expo. Escaneá el QR con un dispositivo compatible. En el simulador de iOS usá la URL de ejemplo. En un emulador Android estándar, la dirección del host es `http://10.0.2.2:3001`. La pantalla de ingreso muestra si pudo consultar la API.

Para grabar la demo desde la computadora, corré `npx expo start --web`: en una ventana de escritorio la app se muestra dentro de un marco con proporción de teléfono (390×844) que se achica si la ventana es más baja.

Las cuentas de demo son Sofía (compradora) y Estudio Sur (organizador). Reiniciar la API vuelve a cargar los datos de prueba. Los pagos y reembolsos se simulan.

## Comprobaciones

```sh
npm --prefix api test
cd mobile
npx eslint src
npx tsc --noEmit
npx expo export --platform ios
```

[Arquitectura](ARCHITECTURE.md) · [Bloques de trabajo](work_blocks/index.md) · [Guion de la demo](DEMO.md)
