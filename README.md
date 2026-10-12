# Objetivo — Landing page de validación

Landing responsive desarrollada con HTML, CSS y JavaScript para el prototipo académico de Objetivo. Incluye presentación del SaaS, beneficios, planes propuestos y formulario de inscripción a la beta.

## Archivos
- `index.html`: estructura y contenido.
- `styles.css`: diseño adaptable a móvil y escritorio.
- `script.js`: menú móvil, validación del formulario y envío a Supabase.
- `config.js`: configuración pública del cliente Supabase.
- `supabase.sql`: crea la única tabla de inscripciones y sus políticas RLS.

## 1. Probar localmente
1. Descomprime la carpeta.
2. Abre `index.html` en el navegador para revisar el diseño. Para probarlo de forma más parecida a producción, usa la extensión Live Server de VS Code o ejecuta un servidor estático local.
3. El formulario valida campos, pero no guardará registros hasta configurar Supabase.

## 2. Crear la tabla en Supabase
1. Crea un proyecto en https://supabase.com/.
2. Abre **SQL Editor > New query**.
3. Copia el contenido de `supabase.sql` y ejecútalo.
4. En **Table Editor**, confirma que existe `public.inscritos_beta` con estos campos:
   - `id`: identificador autogenerado.
   - `nombre`: nombre de la persona.
   - `correo`: correo único.
   - `perfil`: perfil del participante.
   - `necesidad`: meta o necesidad descrita.
   - `interes`: función que más le interesa.
   - `fecha_inscripcion`: fecha y hora automática.
5. En la configuración/API del proyecto, copia la Project URL y la clave publicable (publishable key; en proyectos antiguos puede aparecer como `anon`).
6. Abre `config.js` y reemplaza `https://TU-PROYECTO.supabase.co` y `TU_CLAVE_PUBLICABLE` por esos valores.

**Seguridad:** una clave publicable/anon está diseñada para usarse en el frontend con RLS correctamente configurado. Nunca uses `service_role` ni una clave secreta en HTML/JavaScript. La política permite insertar inscripciones, pero no da permiso público para leer registros. El acceso administrativo se realiza en el panel de Supabase.

La tabla tiene una restricción `unique` en `correo` para evitar registros duplicados. No se recopilan contraseñas ni datos bancarios.

## 3. Publicar en Vercel
1. Crea un repositorio en GitHub y sube los archivos de esta carpeta (no subas claves privilegiadas; `config.js` contiene únicamente la clave publicable).
2. Entra en https://vercel.com/ e importa el repositorio.
3. Para esta web estática, no hace falta framework ni comando de build. Deja el directorio raíz en `./` y publica.
4. Cada vez que cambies el código, vuelve a desplegar desde Vercel.
5. Abre la URL pública que Vercel te asigne y prueba el formulario desde esa URL.

## 4. Prueba obligatoria para la evidencia
1. Abre la URL pública de la landing.
2. Envía una inscripción con datos de prueba autorizados.
3. Comprueba en Supabase > Table Editor > `inscritos_beta` que aparece el registro.
4. Captura la URL pública y el mensaje de éxito.
5. Captura la estructura de la tabla y una fila de prueba; oculta el correo u otros datos personales al incluirla en el informe.
6. Prueba un correo inválido y campos vacíos para documentar la validación.
7. Comprueba que la API pública no permite leer los registros.

No afirmes que la publicación o el guardado están completados hasta realizar y documentar estas pruebas.

## 5. Límites y mejoras pendientes
La clave pública puede usarse en el navegador solo con políticas RLS restrictivas. Para una versión comercial, considera protección antispam, limitación de frecuencia, verificación de correo, controles adicionales y revisión de privacidad. Las políticas de inserción públicas pueden recibir spam si el formulario se publica sin medidas complementarias.

## 6. Nota sobre precios
Los planes Free, Plus (Bs 25/mes) y Pro (Bs 45/mes) son hipótesis académicas; no hay cobros implementados.
