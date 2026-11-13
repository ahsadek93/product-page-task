# Product Page

Product detail page with a persistent cart, built on the EasyOrders public API.

React 19 · TypeScript · Vite · Tailwind CSS · Zustand + Immer · TanStack Query

## Setup

### Requirements

- **Node.js 22.18+**: `npm test` runs the `.ts` test files directly, which Node supports without flags from 22.18.
- npm (ships with Node)

### Install

```bash
npm install
```

### Environment

No configuration is needed: the app talks to the public EasyOrders API and has no secrets or `.env` file.

| Value        | Where                               | Default                              |
| ------------ | ----------------------------------- | ------------------------------------ |
| API base URL | `src/shared/api/api.ts`             | `https://api.easy-orders.net/api/v1` |
| Store slug   | `src/features/product/model/api.ts` | `clear-theme`                        |

### Run

```bash
npm run dev
```

Then open the product page: <http://localhost:5173/shop/women/shirts-tops/Sneakers12>

The URL shape is `/shop/:categorySlug/:collectionSlug/:productSlug`; the home page (`/`) links to it.

### Scripts

| Command           | What it does                                                  |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Vite dev server with hot reload (`npm start` is an alias)     |
| `npm run build`   | Type-check (`tsc --noEmit`), then production build to `dist/` |
| `npm run preview` | Serve the production build locally                            |
| `npm test`        | Run the model and store unit tests (`node:test`)              |
| `npm run lint`    | ESLint: `typescript-eslint` recommended + React hooks rules   |
| `npm run format`  | Format everything with Prettier (`format:check` to verify)    |
