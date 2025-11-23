# City Policy RAG - Backend

Express TypeScript backend for the City Policy RAG application.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development
Run the development server with hot reloading:
```bash
npm run dev
```

Server will start on `http://localhost:3001`

### Build
Compile TypeScript to JavaScript:
```bash
npm run build
```

### Production
Run the compiled production build:
```bash
npm start
```

## API Endpoints

- `GET /` - Hello world message
- `GET /health` - Health check endpoint

## Environment Variables

- `PORT` - Server port (default: 3001)

## Project Structure

```
backend/
├── src/
│   └── index.ts      # Main server file
├── dist/             # Compiled JavaScript (generated)
├── package.json
└── tsconfig.json
```
