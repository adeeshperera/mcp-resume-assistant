# MCP Resume Assistant

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-1.17.5-green?style=flat)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

A sophisticated **Model Context Protocol (MCP) server** implementation that enables AI assistants to intelligently interact with resume/CV data and handle email communications. The project combines a powerful backend MCP server with an elegant Next.js frontend playground for testing and demonstration.

## 🎯 Overview

This project implements an MCP server that provides two main capabilities:

- **CV/Resume Intelligence**: Parse, understand, and answer questions about CV content
- **Email Communication**: Send professional emails using the Resend API

The system is designed to showcase how MCP servers can bridge AI assistants with real-world data and services, making them more practical and useful.

## ✨ Features

### 🧠 CV Intelligence

- **PDF Parsing**: Extract structured data from PDF resumes
- **Smart Questioning**: Answer intelligent questions about education, skills, projects, and experience
- **Context-Aware Responses**: Understand the intent behind questions and provide relevant information
- **Data Caching**: JSON-based caching system for improved performance

### 📧 Email Capabilities

- **Professional Email Sending**: Integration with Resend API for reliable email delivery
- **Form Validation**: Comprehensive validation using Zod schemas
- **Error Handling**: Graceful error handling with user-friendly messages
- **Real-time Feedback**: Live status updates during email sending

### 🎨 Modern Frontend

- **Interactive Chat Interface**: Conversational UI for CV questions
- **Predefined Quick Questions**: One-click access to common queries
- **Real-time Email Form**: Professional email composition interface
- **Responsive Design**: Optimized for desktop and mobile devices
- **Beautiful UI**: Modern design with Tailwind CSS and smooth animations

## 🏗️ Architecture

### Frontend (`src/app/`)

```
src/app/
├── page.tsx                    # Main playground page
├── layout.tsx                  # Root layout component
├── globals.css                 # Global styles
├── components/
│   ├── ChatInterface.tsx       # CV question chat interface
│   ├── EmailForm.tsx          # Email sending form
│   └── Layout.tsx             # Layout wrapper component
└── api/
    ├── mcp/route.ts           # MCP API endpoints
    └── email/route.ts         # Email API endpoints
```

**Key Technologies:**

- **Next.js 15.5.2** with App Router
- **React 19** with modern hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Zod** for validation

### Backend (`src/server/`)

```
src/server/
├── index.ts                   # MCP server entry point
├── services/
│   ├── cv-parser.ts          # PDF parsing and CV intelligence
│   └── email-service.ts      # Email service using Resend
├── tools/
│   ├── cv-chat.ts           # CV question handling tool
│   └── email-sender.ts      # Email sending tool
└── types/
    └── index.ts             # TypeScript type definitions
```

**Key Technologies:**

- **Model Context Protocol SDK** for MCP server implementation
- **pdf-parse** for PDF text extraction
- **Resend API** for email delivery
- **Node.js** with TypeScript
- **Zod** for runtime validation

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Resend API Key** (for email functionality)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/adeeshperera/mcp-resume-assistant.git
   cd mcp-resume-assistant
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Resend API key:

   ```bash
   RESEND_API_KEY=your_resend_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Add your resume**

   Place your PDF resume in the `public/` directory as `adeesh_perera_resume.pdf` or update the path in `src/server/tools/cv-chat.ts`.

### Running the Application

#### Frontend Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the playground interface.

#### MCP Server (Standalone)

```bash
npm run mcp
```

#### MCP Server (Development with Auto-reload)

```bash
npm run mcp:dev
```

### Building for Production

```bash
npm run build
npm start
```

## 🧪 Testing

The project includes comprehensive test suites for both frontend and backend components.

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Coverage

```bash
npm test -- --coverage
```

**Test Files:**

- `tests/cv-parser.test.ts` - CV parsing and intelligence tests
- `tests/email-service.test.ts` - Email service validation tests
- `tests/mcp-tools.test.ts` - MCP tool functionality tests

## 📡 API Endpoints

### MCP API (`/api/mcp`)

**POST** - Ask questions about the CV

```typescript
// Request
{
  "question": "What skills does Adeesh have?"
}

// Response
{
  "success": true,
  "answer": "Here's information about skills:\nJava / Spring Boot, Spring JPA..."
}
```

### Email API (`/api/email`)

**POST** - Send emails

```typescript
// Request
{
  "recipient": "recipient@example.com",
  "subject": "Hello from MCP Server",
  "body": "This is a test email sent via the MCP Resume Assistant."
}

// Response
{
  "success": true,
  "message": "Email sent successfully",
  "id": "email_id"
}
```

## 🔧 Configuration

### Environment Variables

| Variable              | Description                            | Required |
| --------------------- | -------------------------------------- | -------- |
| `RESEND_API_KEY`      | Resend API key for email functionality | Yes      |
| `NEXT_PUBLIC_APP_URL` | Public URL of the application          | No       |

### Customization

#### Adding Your Own Resume

1. Replace `public/adeesh_perera_resume.pdf` with your resume
2. Update the file path in `src/server/tools/cv-chat.ts` if needed
3. The system will automatically extract and cache the CV data

#### Modifying CV Parsing Logic

Edit `src/server/services/cv-parser.ts` to customize:

- Section keywords for better extraction
- Response formatting
- Question interpretation logic

## 📦 Dependencies

### Core Dependencies

- `@modelcontextprotocol/sdk` - MCP server implementation
- `next` - React framework
- `react` & `react-dom` - React library
- `typescript` - Type safety
- `pdf-parse` - PDF text extraction
- `resend` - Email service
- `zod` - Runtime validation
- `react-hook-form` - Form management

### Development Dependencies

- `jest` & `ts-jest` - Testing framework
- `@types/*` - TypeScript type definitions
- `eslint` - Code linting
- `tailwindcss` - CSS framework
- `nodemon` - Development auto-reload

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) for the innovative MCP framework
- [Resend](https://resend.com/) for reliable email delivery
- [Next.js](https://nextjs.org/) for the excellent React framework
- [Vercel](https://vercel.com/) for deployment platform

---

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/adeeshperera/mcp-resume-assistant.git
cd mcp-resume-assistant
npm install

# Configure environment
cp .env.example .env.local
# Add your RESEND_API_KEY to .env.local

# Run development server
npm run dev

# Run MCP server
npm run mcp:dev

# Run tests
npm test
```
