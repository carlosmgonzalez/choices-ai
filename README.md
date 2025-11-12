# Choice AI 🎓

[English](./README.en.md) | Español

Una aplicación web inteligente que ayuda a los estudiantes a prepararse para sus exámenes mediante la generación automática de preguntas de opción múltiple utilizando inteligencia artificial.

## 🌟 Características

- **Carga de Documentos PDF**: Sube archivos PDF con el material de estudio que estás preparando
- **Generación Automática de Preguntas**: Utiliza IA (Google Gemini 2.5 Flash) para crear preguntas relevantes basadas en el contenido
- **Exámenes Interactivos**: Interfaz intuitiva con preguntas de opción múltiple
- **Retroalimentación Inmediata**: Verifica tus respuestas y recibe explicaciones detalladas
- **Sistema de Puntuación**: Monitorea tu progreso con un sistema de calificación en tiempo real
- **Manejo de Archivos Grandes**: Soporte para PDFs de gran tamaño gracias a Vercel Blob

## 🚀 Tecnologías

Este proyecto está construido con tecnologías modernas y robustas:

- **[Next.js](https://nextjs.org)** - Framework de React para frontend y backend (App Router)
- **[AI SDK](https://sdk.vercel.ai)** - SDK de Vercel para integración con IA
- **[Google Gemini 2.5 Flash](https://ai.google.dev)** - Modelo de IA para generación de preguntas
- **[Tailwind CSS](https://tailwindcss.com)** - Framework de CSS para estilos
- **[shadcn/ui](https://ui.shadcn.com)** - Componentes de UI accesibles y personalizables
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** - Almacenamiento de archivos en la nube
- **[Vercel](https://vercel.com)** - Plataforma de despliegue

## 📋 Requisitos Previos

- Node.js 18.17 o superior
- npm, yarn, pnpm o bun
- Cuenta de Vercel (para despliegue)
- API Key de Google Gemini

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd choice-ai
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. Configura las variables de entorno:
Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
```env
GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_aqui
BLOB_READ_WRITE_TOKEN=tu_token_de_vercel_blob
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 📖 Uso

1. **Sube tu PDF**: Selecciona y sube el archivo PDF con el material de estudio
2. **Genera Preguntas**: La IA procesará el documento y creará preguntas relevantes
3. **Responde el Examen**: Selecciona las respuestas que consideres correctas
4. **Verifica tus Respuestas**: Revisa si acertaste y lee las explicaciones
5. **Revisa tu Puntuación**: Conoce tu desempeño con el sistema de calificación

## 🏗️ Estructura del Proyecto

```
choice-ai/
├── app/
│   ├── api/          # Rutas de API (backend)
│   ├── page.tsx      # Página principal
│   └── layout.tsx    # Layout principal
├── components/       # Componentes de React
├── lib/             # Utilidades y configuraciones
├── public/          # Archivos estáticos
└── ...
```

## 🌐 Despliegue

La forma más fácil de desplegar esta aplicación es utilizando la [Plataforma Vercel](https://vercel.com):

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente con cada push a la rama principal

Para más detalles, consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si tienes alguna idea o mejora, no dudes en abrir un issue o pull request.

## 📧 Contacto

Si tienes preguntas o sugerencias, no dudes en contactarme.

---

Desarrollado con ❤️ para ayudar a estudiantes a mejorar su aprendizaje