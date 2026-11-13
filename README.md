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

## Architecture

Code is organised **by feature**, and each feature is split into four layers (hook-based MVVM):

```
src/
  features/
    product/
      model/       pure TS, no React: API fetcher, DTO → model adapter, variant/price/stock rules, breadcrumb
      types/       product.dto.ts (raw API shape) and product.ts (the shape the app uses)
      hooks/       view-models: connect model to components (useProduct, useVariantSelection, useAddToCart, …)
      components/  views: render props, own only pure UI state (active thumbnail, zoom, expanded)
    cart/
      model/       Zustand store (+ count/subtotal helpers)
      types/       CartItem snapshot
      hooks/       useCart, useCartCount, useCartActions
      components/  CartDrawer, CartLine, CartToast
  layouts/         app shell: header (cart button), footer, announcement bar, DefaultLayout
  pages/           route components (Nuxt-style folders: shop/[categorySlug]/[collectionSlug]/[productSlug])
  shared/          feature-agnostic: api() fetch wrapper, Breadcrumb, SwapText, formatPrice
```

Rules that keep it clean:

- **Components never import a store or the API.** They get data from hooks.
- **Business logic lives in `model/`** as plain functions, so it is unit-tested without React.
- **Features talk through hooks and types, not internals.** Product adds to the cart via `useCartActions`; the cart never imports product (one-way dependency, no cycle).
- **No barrels, no DI, no classes.** Tests sit next to the code they test.

## Components

Props are typed in each file; these are the ones worth knowing.

| Component                | Props                                        | Usage                                                                                                                                 |
| ------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `ProductDetails`         | `product: Product`                           | Product section. Owns variant selection (`useVariantSelection`) and add-to-cart (`useAddToCart`) and passes them down.                |
| `ProductGallery`         | `images: string[]`, `name: string`           | Main image and thumbnails, prev/next, hover zoom (mouse) and click/tap zoom. Hides controls for 0–1 images.                           |
| `ProductInfo`            | `product`, `selection`, `cart`               | Title, price/sale, options, stock status, CTAs, category chips. Disabled options explain why on hover ("Sold out" / "Not available"). |
| `ProductDescription`     | `html: string`                               | Sanitised (DOMPurify) merchant HTML, collapsed to ~8 lines with an animated See More / See Less.                                      |
| `ProductDetailsSkeleton` | –                                            | Loading placeholder with the same layout, so nothing jumps when data arrives.                                                         |
| `ProductError`           | –                                            | Error state with a link back home.                                                                                                    |
| `ProductGrid`            | `title: string`                              | Grid of `ProductCard`s (2 / 3 / 5 columns). Used twice: "Related Product" and "Popular this week".                                    |
| `ProductReviews`         | –                                            | Reviews section (`ReviewSummary`, `ReviewFilters`, `ReviewItem`).                                                                     |
| `CartDrawer`             | –                                            | Slide-over cart (Headless UI `Dialog`): lines, quantity steppers, subtotal. Opened from the header or "View Cart".                    |
| `CartLine`               | `item`, `onQuantity(n)`, `onRemove()`        | One cart line; `+` is disabled at the stock cap, `−` at 1 removes the line.                                                           |
| `CartToast`              | –                                            | "Added to cart" toast after every add. Auto-dismisses after 4s, pauses on hover/focus, announced to screen readers.                   |
| `Breadcrumb`             | `items: { label: ReactNode; to?: string }[]` | Last item is the current page. `label` is a node so a loading placeholder can be passed.                                              |
| `SwapText`               | `text: string`                               | Animates a text change (selected option name, See More / See Less).                                                                   |

Option rendering in `ProductInfo`: `image` options become image swatches; a `color` option without images becomes colour swatches filled from the value's name when it's a CSS colour (`brown`), or the name as text when it isn't; everything else becomes text buttons.

Example:

```tsx
<ProductGrid title="Popular this week" />

<Breadcrumb items={[{ label: 'Homepage', to: '/' }, { label: 'Women' }, { label: product.name }]} />
```

## State management

Each kind of state lives in the tool built for it:

| State                               | Where                               | Why                                                             |
| ----------------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| Server data (the product)           | TanStack Query (`useProduct`)       | Caching per slug, loading/error states, retries.                |
| Cart                                | Zustand + Immer (`cart.store.ts`)   | Shared by the page, header, drawer and toast; survives reloads. |
| Variant selection                   | `useState` in `useVariantSelection` | Only the product section needs it.                              |
| Pure UI (zoom, thumbnail, expanded) | `useState` in the component         | Nothing else needs it.                                          |

**Cart store** (`src/features/cart/model/cart.store.ts`):

- Actions: `add`, `setQuantity`, `remove`, `clear`, `setOpen`. Immer lets them write `line.quantity = …` and `items.push(…)` instead of rebuilding arrays.
- Adding the same variant again merges into one line. Quantities are capped at the stock captured when the item was added (`maxQuantity`); `setQuantity(0)` removes the line.
- Count and subtotal are **derived** (`cartCount`, `cartSubtotal`), never stored, so they can't drift.
- `persist` saves **only `items`** to `localStorage`; drawer state and the toast event are session-only.
- A cart line is a **snapshot** (name, image, price, options at add time), so the cart never depends on product data.

**Avoiding unnecessary re-renders**, instead of wrapping components in `memo`:

- `useCartCount` subscribes to a single number, so the header re-renders only when the count changes.
- `useCartActions` reads actions without subscribing, so the product section never re-renders on cart changes.
- `useCart` uses `useShallow` for the drawer, which needs most of the cart.
- Selection state sits in `ProductDetails`, so the grids and reviews never re-render on a variant pick.

## API integration

- **Endpoint:** `GET /products/slug/{store}/{slug}?join=reviews` on `https://api.easy-orders.net/api/v1` (store `clear-theme`).
- **Fetching:** `shared/api/api.ts` is a small `fetch` wrapper that throws on non-2xx. `product/model/api.ts` calls it and `useProduct` wraps it in `useQuery` (key `['product', slug]`).
- **Adapter** (`product.adapter.ts`) is the trust boundary between the API and the app:
  - throws if `id`, `name` or `price` are missing or the wrong type, instead of rendering `undefined`/`NaN`;
  - `sale_price: 0` → `null` (no sale), `null` lists → `[]`;
  - thumb first, duplicate images removed;
  - variant props array → `{ color: 'brown', size: '40' }`;
  - strips the rich-text editor's empty paragraphs and `&nbsp;` from the description (XSS sanitising happens at render with DOMPurify).
- **Pricing and stock rules** (`variant.ts`): a variant's price and sale override the product's when set; a sale only counts if it's below the price; stock is ignored when the store doesn't track it, and only blocks ordering when the store says so.
- **Loading and errors:** a layout-matched skeleton (breadcrumb included) while loading; `ProductError` on failure.

## Deployment

The app is a static SPA: `npm run build` type-checks and writes plain files to `dist/`, which any static host can serve.

```bash
npm ci
npm run build      # → dist/
npm run preview    # optional: check the build locally
```

Upload `dist/` to the host. One requirement: the app uses client-side routing (`BrowserRouter`), so the host must serve `index.html` for every path that isn't a real file. Otherwise opening or refreshing `/shop/...` directly returns a 404. For example, with Nginx:

```nginx
location / {
  try_files $uri /index.html;
}
```

No environment variables or server are needed.

## Testing

```bash
npm test
```

55 unit tests on Node's built-in runner (`node:test`), with no extra dependencies:

- `cart.store.test.ts`: every action, stock caps, merging, persistence (only `items` saved, restored on rehydrate), count/subtotal.
- `variant.test.ts`: variant matching, default selection, pricing, unavailable options (missing vs sold out), selection correction, stock, cart snapshot.
- `product.adapter.test.ts`: each mapping rule and the trust-boundary errors.
- `breadcrumb.test.ts`: category name lookup and slug humanising.

The scope is deliberately the **model and store layer**, where the business rules live. Components are thin views over these, so component and E2E tests were left out to keep the suite fast and dependency-free.
