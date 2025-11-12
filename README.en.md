# Choice AI 🎓

English | [Español](./README.md)

An intelligent web application that helps students prepare for their exams through automatic generation of multiple-choice questions using artificial intelligence.

## 🌟 Features

- **PDF Document Upload**: Upload PDF files with the study material you're preparing
- **Automatic Question Generation**: Uses AI (Google Gemini 2.5 Flash) to create relevant questions based on the content
- **Interactive Exams**: Intuitive interface with multiple-choice questions
- **Immediate Feedback**: Verify your answers and receive detailed explanations
- **Scoring System**: Monitor your progress with a real-time grading system
- **Large File Handling**: Support for large PDFs thanks to Vercel Blob

## 🚀 Technologies

This project is built with modern and robust technologies:

- **[Next.js](https://nextjs.org)** - React framework for frontend and backend (App Router)
- **[AI SDK](https://sdk.vercel.ai)** - Vercel SDK for AI integration
- **[Google Gemini 2.5 Flash](https://ai.google.dev)** - AI model for question generation
- **[Tailwind CSS](https://tailwindcss.com)** - CSS framework for styling
- **[shadcn/ui](https://ui.shadcn.com)** - Accessible and customizable UI components
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** - Cloud file storage
- **[Vercel](https://vercel.com)** - Deployment platform

## 📋 Prerequisites

- Node.js 18.17 or higher
- npm, yarn, pnpm or bun
- Vercel account (for deployment)
- Google Gemini API Key

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repository>
cd choice-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:
Create a `.env.local` file in the project root with the following variables:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 Usage

1. **Upload your PDF**: Select and upload the PDF file with your study material
2. **Generate Questions**: The AI will process the document and create relevant questions
3. **Answer the Exam**: Select the answers you consider correct
4. **Verify your Answers**: Check if you got them right and read the explanations
5. **Review your Score**: Know your performance with the grading system

## 🏗️ Project Structure

```
choice-ai/
├── app/
│   ├── api/          # API routes (backend)
│   ├── page.tsx      # Main page
│   └── layout.tsx    # Main layout
├── components/       # React components
├── lib/             # Utilities and configurations
├── public/          # Static files
└── ...
```

## 🌐 Deployment

The easiest way to deploy this application is using the [Vercel Platform](https://vercel.com):

1. Connect your repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy automatically with each push to the main branch

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 📝 License

This project is under the MIT License.

## 🤝 Contributing

Contributions are welcome. If you have any ideas or improvements, feel free to open an issue or pull request.

## 📧 Contact

If you have questions or suggestions, feel free to contact me.

---

Developed with ❤️ to help students improve their learning