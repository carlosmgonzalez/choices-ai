# Configuración de Vercel Blob Storage

Esta aplicación usa **Vercel Blob** para manejar uploads de PDFs grandes sin el límite de 4.5MB de las API routes normales.

## 🚀 Configuración en Producción (Vercel)

### 1. Crear Blob Store en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Navega a la pestaña **Storage**
3. Haz clic en **Create Database**
4. Selecciona **Blob**
5. Dale un nombre a tu store (ej: `choice-ai-pdfs`)
6. Haz clic en **Create**

### 2. Conectar el Store a tu Proyecto

1. En la página del Blob Store, haz clic en **Connect Project**
2. Selecciona tu proyecto `choice-ai`
3. Vercel automáticamente agregará la variable de entorno `BLOB_READ_WRITE_TOKEN`

### 3. Deploy

Haz un nuevo deploy o redeploy tu proyecto:

```bash
git push
```

Vercel automáticamente detectará la variable de entorno y tu aplicación funcionará.

## 💻 Configuración en Local

### 1. Obtener el Token

Tienes dos opciones:

**Opción A: Desde Vercel Dashboard**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Copia el valor de `BLOB_READ_WRITE_TOKEN`

**Opción B: Usar Vercel CLI**
```bash
npm i -g vercel
vercel env pull .env.local
```

### 2. Crear archivo `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXX
```

### 3. Restart Dev Server

```bash
npm run dev
```

## 📊 Límites de Vercel Blob

| Plan | Límite de Almacenamiento | Límite por Archivo | Precio por GB extra |
|------|--------------------------|-------------------|---------------------|
| Hobby | 500 MB | 500 MB | N/A |
| Pro | 1 GB | 500 MB | $0.15/GB |
| Enterprise | Custom | Custom | Custom |

## 🧹 Limpieza de Blobs (Opcional)

Los PDFs se guardan en Blob storage. Para ahorrar espacio, puedes eliminarlos después de procesarlos.

En `app/api/chat/route.ts`, descomenta estas líneas:

```typescript
// Optional: Delete the blob after processing to save storage
try {
  await del(pdfUrl);
  console.log('Blob deleted successfully:', pdfUrl);
} catch (error) {
  console.error('Error deleting blob:', error);
}
```

## 🔒 Seguridad

### Producción
Para producción, deberías agregar autenticación en `app/api/pdf/upload/route.ts`:

```typescript
onBeforeGenerateToken: async (pathname: string) => {
  // Autenticar usuario
  const { user } = await auth(request);
  if (!user) {
    throw new Error('Not authorized');
  }
  
  return {
    allowedContentTypes: ['application/pdf'],
    maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
  };
},
```

### Rate Limiting
Considera agregar rate limiting para evitar abuso:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 uploads por hora
});
```

## 🐛 Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is not defined"
- Asegúrate de tener la variable de entorno configurada
- Restart tu dev server después de crear `.env.local`

### Error 413 en producción
- Verifica que estés usando Vercel Blob correctamente
- El límite de Blob es 500MB (mucho mayor que 4.5MB de API routes)

### Uploads lentos en localhost
- `onUploadCompleted` no funciona en localhost
- Usa ngrok o despliega a Vercel para probar el flujo completo

## 📝 Arquitectura

```
Frontend (page.tsx)
    ↓
    1. Usuario selecciona PDF
    ↓
    2. upload() sube a Vercel Blob
    ↓
/api/pdf/upload (maneja autorización)
    ↓
    3. Retorna URL del blob
    ↓
Frontend recibe URL
    ↓
    4. Envía URL a /api/chat
    ↓
/api/chat descarga PDF y procesa
    ↓
    5. (Opcional) Elimina blob
    ↓
    6. Retorna preguntas al frontend
```

## 🔗 Referencias

- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Client Upload Guide](https://vercel.com/docs/storage/vercel-blob/client-upload)
- [@vercel/blob Package](https://www.npmjs.com/package/@vercel/blob)