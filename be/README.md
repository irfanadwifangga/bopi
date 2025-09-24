# Backend API - TypeScript Express Server

A modern TypeScript-based Express.js backend server with type safety and development tools.

## 🚀 Features

- **TypeScript** - Full type safety and modern JavaScript features
- **Express.js** - Fast, unopinionated web framework
- **Development Mode** - Hot reload with ts-node
- **Production Ready** - Compiled JavaScript output
- **Type Definitions** - Comprehensive type coverage
- **Code Formatting** - Prettier integration

## 📦 Installation

Install dependencies:

```bash
npm install
```

## 🛠️ Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## 🏗️ Production

Build the TypeScript code:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## 📝 Available Scripts

- `npm run dev` - Start development server with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server from compiled code
- `npm run format` - Format code with Prettier

## 🔗 API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint

## 📁 Project Structure

```
src/
├── index.ts          # Main server file
├── types/
│   └── index.ts      # TypeScript type definitions
├── dist/             # Compiled JavaScript (generated)
└── tsconfig.json     # TypeScript configuration
```

## 🔧 Configuration

- **TypeScript Config**: `tsconfig.json`
- **Prettier Config**: `.prettierrc`
- **Environment**: Set `PORT` environment variable (default: 3000)

## 📋 Type Safety

The project includes comprehensive TypeScript configurations:

- Strict mode enabled
- Full type checking
- Declaration files generated
- Source maps for debugging
