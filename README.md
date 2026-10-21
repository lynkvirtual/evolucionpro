# EVOLUCIÓN PRO — Demostración

Demostración de propuesta tecnológica de **TRACCE VIRTUALE** para el Club de Nutrición Evolución Ixtapa.
No es el sitio oficial del establecimiento. Datos 100 % ficticios; no se guarda ni se envía información.

| Ruta | Contenido |
|---|---|
| `/` | Sitio público (Evolución Web) |
| `/admin-demo/` | Panel administrativo (Evolución Control) |
| `/mi-evolucion-demo/` | Portal del socio (Mi Evolución) |

Sitio estático (HTML, CSS y JavaScript). No requiere instalación ni compilación ni base de datos.

## Publicar en GitHub Pages
1. Sube el contenido de esta carpeta a la rama `main` del repositorio.
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. El flujo `.github/workflows/pages.yml` publica en cada push. La URL queda en
   `https://<usuario>.github.io/<repositorio>/`.
(Alternativa sin Actions: Source = *Deploy from a branch* → `main` / root.)

## Probar localmente
`python3 -m http.server 8000` y abrir http://localhost:8000/

## Actualizar
Edita los archivos y haz push; la página se republica sola. Estilos en `assets/styles.css`,
lógica en `assets/site.js`, `assets/admin.js` y `assets/socio.js`.

## Demo vs. pendiente de contratación
| Demostrativo | Pendiente (versión productiva) |
|---|---|
| Navegación entre las tres vistas | Autenticación real de staff y socios |
| POS, saldos, créditos e inventario simulados (en memoria) | Base de datos y persistencia (Supabase, ver `supabase/schema.sql`) |
| QR de ejemplo | Pasaporte con QR/credencial real |
| Formulario de registro simulado | Aviso de privacidad aprobado y almacenamiento seguro |
| Seguimiento ilustrativo | Expedientes y evaluaciones reales (datos de salud: requieren controles especiales) |
| Fotos ilustrativas y mapa esquemático | Fotografías autorizadas, logotipo oficial, horarios y precios del club |
