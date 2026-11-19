# Camino a Doomsday — Web gratis para dos

Una web estática sin compiladores, sin registros para visitantes y sin pagos. Incluye filtros, selección de vistos, progreso, exportar/importar y bonus X-Men.

## Archivos
- `index.html`: la interfaz y los estilos.
- `app.js`: catálogo, filtros, progreso, compartir y sincronización.
- `firebase-config.js`: configuración de Firebase (inicialmente vacía).
- `firestore.rules`: reglas de acceso de la sala para copiar a Firebase.

## Opción A: publicar gratis, cada persona con su progreso independiente

1. Entra a https://github.com y crea una cuenta gratuita si hace falta.
2. Crea un repositorio público, por ejemplo `marvel-doomsday`.
3. Sube `index.html`, `app.js` y `firebase-config.js` a la raíz (puedes subir todos los archivos). Puedes usar **Add file → Upload files → Commit changes**.
4. En el repositorio abre **Settings → Pages → Build and deployment**. Elige **Deploy from a branch**, `main`, `/(root)`, y guarda.
5. Al publicarse, el enlace tendrá una forma similar a `https://TU-USUARIO.github.io/marvel-doomsday/`. Compártelo por WhatsApp.

Este modo sirve sin Firebase, pero **cada navegador guarda sus propias marcas**. También pueden transferir el progreso con Guardar copia / Importar copia.

## Opción B: activar una única sala sincronizada, también gratis

1. Abre https://console.firebase.google.com/ y crea un proyecto nuevo. Elige **Spark (sin costo)**. No hace falta contratar Blaze ni introducir tarjeta para este ejemplo.
2. En ese proyecto, agrega una **aplicación web** (icono `</>`). Registra la app; no necesitas activar Firebase Hosting. Copia el objeto `firebaseConfig` proporcionado.
3. Abre `firebase-config.js` y **reemplaza** `window.FIREBASE_CONFIG = null;` con `window.FIREBASE_CONFIG = { ... };` usando los campos reales del objeto proporcionado. No copies las etiquetas HTML ni contraseñas privadas.
4. En Firebase, ve a **Build → Authentication → Sign-in method** y activa **Anonymous (Anónimo)**. Guarda.
5. Ve a **Build → Firestore Database → Create database**, selecciona la edición **Standard**, crea la base `(default)` y elige una ubicación compatible. Es posible que veas opciones de reglas; continúa y, en la pestaña **Rules**, pega **todo** el contenido de `firestore.rules` y haz clic en **Publish**. No dejes reglas abiertas en modo de prueba.
6. En Firebase **Authentication → Settings → Authorized domains** comprueba que esté autorizado el dominio desde el que publicarás, por ejemplo `TU-USUARIO.github.io` (sin `https://`, sin ruta). Si no está, agrégalo.
7. Sube el archivo `firebase-config.js` ya editado a GitHub, sustituyendo el anterior. Espera a que se publique el cambio y recarga la web.
8. En la web, marca tus títulos vistos **antes** de crear la sala si quieres transferirlos. Haz clic en **Crear sala compartida → Crear sala → Copiar enlace**. Envíale ese enlace completo por WhatsApp a tu esposa.
9. Ambos deben abrir **ese mismo enlace**, que incluye el parámetro `?sala=...`. Cualquier marca se verá en ambos dispositivos casi en tiempo real.

### Seguridad y funcionamiento
- El identificador de sala es una clave aleatoria de 192 bits: compartir el enlace es dar acceso de **lectura y edición**. No compartas el enlace públicamente. No guardamos nombres, correos ni información personal de películas vistas.
- Firebase Web API key no es una contraseña privada; es normal que el objeto de configuración aparezca en código público. La protección se hace mediante las reglas de Firestore. **No** pegues claves de cuentas de servicio ni contraseñas de Firebase.
- Se usa inicio de sesión **anónimo**: tu esposa no necesita abrir cuenta de Firebase. Si se borra la información del navegador, se creará un usuario anónimo nuevo, pero el enlace de sala seguirá funcionando.
- Las reglas limitan la forma de los documentos, pero cualquiera que obtenga el enlace puede modificar el progreso; no es un sistema para datos sensibles.
- Firebase Spark y GitHub Pages tienen límites de uso; para dos personas con este checklist debería bastar ampliamente con sus cuotas gratuitas. No es una garantía de servicio ilimitado.
- Con conexión a internet, la sala compartida utiliza Firestore. En modo individual, el navegador usa `localStorage` y no necesita Firebase.
- El orden de los títulos sigue aproximadamente los años de estreno y las prioridades son propuestas editoriales, no requisitos oficiales de Marvel.

### ¿Cómo actualizar las películas?
Edita la lista `movies` en `app.js`. Cada título tiene: `id`, `nombre`, `año`, `tipo`, `prioridad`, `descripción`. No cambies los `id` existentes para no perder las marcas.

### Solución rápida de errores
- Si dice **La sala necesita Firebase**, todavía no editaste `firebase-config.js` o lo publicaste sin los datos.
- Si aparece `auth/unauthorized-domain`, añade el dominio `TU-USUARIO.github.io` a los dominios autorizados en Authentication.
- Si aparece `permission-denied`, revisa que publicaste exactamente las reglas `firestore.rules` y activaste Anonymous.
- Si sale `auth/operation-not-allowed`, activa Anonymous en Authentication.
- Para compartir *marcas*, no mandes solo la URL general; envía el enlace completo que genera **Copiar enlace**.
