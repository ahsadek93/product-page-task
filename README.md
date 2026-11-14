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

| Command                 | What it does                                                  |
| ----------------------- | ------------------------------------------------------------- |
| `npm run dev`           | Vite dev server with hot reload (`npm start` is an alias)     |
| `npm run build`         | Type-check (`tsc --noEmit`), then production build to `dist/` |
| `npm run preview`       | Serve the production build locally                            |
| `npm test`              | Run the model and store unit tests (`node:test`)              |
| `npm run test:coverage` | Same tests with Node's built-in coverage report               |
| `npm run lint`          | ESLint: `typescript-eslint` recommended + React hooks rules   |
| `npm run format`        | Format everything with Prettier (`format:check` to verify)    |

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
      hooks/       useCart, useCartCount, useCartActions, useCartToast
      components/  CartDrawer, CartLine, CartToast
  layouts/         app shell: header (cart button), footer, announcement bar, DefaultLayout
  pages/           route components (Nuxt-style folders: shop/[categorySlug]/[collectionSlug]/[productSlug])
  shared/          feature-agnostic: api() fetch wrapper, Breadcrumb, SwapText, ErrorBoundary, formatPrice
```

Rules that keep it clean:

- **Components never import a store or the API.** They get data from hooks.
- **Business logic lives in `model/`** as plain functions, so it is unit-tested without React.
- **Features talk through hooks and types, not internals.** Product adds to the cart via `useCartActions`; the cart never imports product (one-way dependency, no cycle).
- **No barrels, no DI, no classes.** Two exceptions: `ErrorBoundary`, because React has no hook for catching render errors, and `ApiError`, so callers can narrow with `instanceof`. Tests sit next to the code they test.

Styling is Tailwind. Figma's colours are named theme tokens in `tailwind.config.js` (`ink-900` … `ink-200`, `line`, `surface`, `review-*`, `success` / `warning` / `danger`); colours used only once or twice stay as arbitrary values. The two Figma button looks are shared as `.btn-primary` and `.btn-outline` in `src/index.css`.

## Components

Props are typed in each file; these are the ones worth knowing.

| Component                | Props                                                 | Usage                                                                                                                                                          |
| ------------------------ | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProductDetails`         | `product: Product`                                    | Product section. Owns variant selection (`useVariantSelection`) and add-to-cart (`useAddToCart`) and passes them down.                                         |
| `ProductGallery`         | `images: string[]`, `name: string`                    | Main image and thumbnails, prev/next, hover zoom (mouse) and click/tap zoom. Hides controls for 0–1 images.                                                    |
| `ProductInfo`            | `product`, `selection`, `cart`                        | Title, price/sale, options (`ProductOptions`), stock status, CTAs, category chips.                                                                             |
| `ProductOptions`         | `options`, `selection`, `select`, `unavailableReason` | One labelled group per option. Disabled options explain why on hover and to screen readers ("Sold out" / "Not available").                                     |
| `ProductDescription`     | `html: string`                                        | Sanitised (DOMPurify) merchant HTML, collapsed to Figma's 4 lines on desktop and 5 on mobile, with an inline See More on the last line and an animated expand. |
| `ProductDetailsSkeleton` | –                                                     | Loading placeholder with the same layout, so nothing jumps when data arrives.                                                                                  |
| `ProductError`           | –                                                     | Error state with a link back home.                                                                                                                             |
| `ProductGrid`            | `title: string`                                       | Grid of `ProductCard`s (2 / 3 / 5 columns). Used twice: "Related Product" and "Popular this week".                                                             |
| `ProductReviews`         | –                                                     | Reviews section (`ReviewSummary`, `ReviewFilters`, `ReviewItem`).                                                                                              |
| `CartDrawer`             | –                                                     | Slide-over cart (Headless UI `Dialog`): lines, quantity steppers, subtotal. Opened from the header or "View Cart".                                             |
| `CartLine`               | `item`, `onQuantity(n)`, `onRemove()`                 | One cart line; `+` is disabled at the stock cap, `−` at 1 removes the line.                                                                                    |
| `CartToast`              | –                                                     | "Added to cart" toast after every add. Auto-dismisses after 4s, pauses on hover/focus, announced to screen readers.                                            |
| `ErrorBoundary`          | `fallback`, `children`                                | Wraps the app in `src/index.tsx`; a render crash shows a "Something went wrong" screen with a link home.                                                       |
| `Breadcrumb`             | `items: { label: ReactNode; to?: string }[]`          | Last item is the current page. `label` is a node so a loading placeholder can be passed.                                                                       |
| `SwapText`               | `text: string`                                        | Animates a text change (selected option name, See More / See Less).                                                                                            |

Option rendering in `ProductOptions`: `image` options become image swatches; a `color` option without images becomes colour swatches filled from the value's name when it's a CSS colour (`brown`), or the name as text when it isn't; everything else becomes text buttons.

Any URL that matches no route renders the not-found page (`src/pages/not-found`) inside the normal layout.

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
- Every add records `lastAdded = { item, id, added }`. The toast shows on each new `id`, and `added` is how many actually went in: when it's 0 (the line was already at its stock cap) the toast says so instead of "Added to cart".
- Count and subtotal are **derived** (`cartCount`, `cartSubtotal`), never stored, so they can't drift.
- `persist` saves **only `items`** to `localStorage`; drawer state and the toast event are session-only.
- The saved cart is **validated on load**: malformed lines (wrong types, missing `options`, quantity below 1) are dropped instead of crashing the header or drawer.
- **Cross-tab sync:** a `storage` event for the cart reloads it, so a change in another tab shows up and this tab's next write doesn't overwrite it with stale items.
- A cart line is a **snapshot** (name, image, price, options at add time), so the cart never depends on product data.

**Avoiding unnecessary re-renders**, instead of wrapping components in `memo`:

- `useCartCount` subscribes to a single number, so the header re-renders only when the count changes.
- `useCartActions` reads actions without subscribing, so the product section never re-renders on cart changes.
- `useCartToast` subscribes to `lastAdded`, `isOpen` and `setOpen` only, so the toast doesn't re-render on quantity changes.
- `useCart` uses `useShallow` for the drawer, which needs most of the cart.
- Selection state sits in `ProductDetails`, so the grids and reviews never re-render on a variant pick.

## API integration

- **Endpoint:** `GET /products/slug/{store}/{slug}?join=reviews` on `https://api.easy-orders.net/api/v1` (store `clear-theme`).
- **Fetching:** `shared/api/api.ts` is a small `fetch` wrapper. `product/model/api.ts` calls it and `useProduct` wraps it in `useQuery` (key `['product', slug]`).
- **Adapter** (`product.adapter.ts`) is the trust boundary between the API and the app:
  - throws if `id`, `name` or `price` are missing or the wrong type, instead of rendering `undefined`/`NaN`;
  - `sale_price: 0` → `null` (no sale), `null` lists → `[]`;
  - thumb first, duplicate images removed;
  - variant props array → `{ color: 'brown', size: '40' }`;
  - strips the rich-text editor's empty paragraphs and `&nbsp;` from the description (XSS sanitising happens at render with DOMPurify).
- **Pricing and stock rules** (`variant.ts`): a variant's price and sale override the product's when set; a sale only counts if it's below the price; stock is ignored when the store doesn't track it, and only blocks ordering when the store says so.
- **Errors:** every API failure becomes one `ApiError` with a `kind`:
  - `network`: no response came back (offline, DNS, CORS);
  - `http`: the server answered non-2xx; carries `status` and the server's `message` (e.g. a missing product is `400 "record not found"`, not a 404);
  - `parse`: a 2xx whose body isn't JSON.

  Aborts are rethrown untouched so React Query can cancel quietly. Not every error is an `ApiError` (the adapter throws plain `Error`s), so React Query's error type isn't narrowed globally.

- **Retries:** only `network` errors are retried (up to 3 times, set once on the `QueryClient`). A server reply, or an adapter error, won't change on retry, so it fails straight away.
- **Cancelling:** `useProduct` passes React Query's `AbortSignal` to `fetch`, so a request for a page the user already left is aborted. In dev, StrictMode's double mount makes this show as one cancelled request followed by a successful one; a production build sends one.
- **Loading and errors:** a layout-matched skeleton (breadcrumb included) while loading; `ProductError` on failure. The error screen stays up during a background refetch (e.g. on window focus) instead of flashing the skeleton.

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

68 unit tests on Node's built-in runner (`node:test`), with no extra dependencies:

- `cart.store.test.ts`: every action, stock caps (including how many an add actually added), merging, persistence (only `items` saved, restored on rehydrate, malformed lines dropped, reload on another tab's change), count/subtotal.
- `variant.test.ts`: variant matching, default selection, pricing, unavailable options (missing vs sold out), selection correction, stock, cart snapshot.
- `product.adapter.test.ts`: each mapping rule and the trust-boundary errors.
- `breadcrumb.test.ts`: category name lookup and slug humanising.
- `api.test.ts`: each `ApiError` kind, the server-message fallback, abort pass-through, and the retry rule (`fetch` stubbed, no network).

`npm run test:coverage` adds Node's built-in coverage report: **100 % lines, 94.12 % branches, 100 % functions** across the five tested files.

The scope is deliberately the **model and store layer**, where the business rules live. Components are thin views over these, so component and E2E tests were left out to keep the suite fast and dependency-free.

## Decisions & known limitations

### Where the API and Figma don't line up

- **Brand label above the title.** Figma shows a brand ("John Lewis ANYDAY"), but the API has no brand or vendor field (every key was checked). The product's first category fills that slot instead, and it's hidden when the product has none.
- **Sold count and rating** ("1,238 Sold", 4.5 stars) are static Figma values. The API has no sales count, and `?join=reviews` returns no reviews to compute a rating from. Related products and the reviews section are static Figma content for the same reason.
- **Stock indicator and category chips** aren't in Figma, so they were designed to match the page: stock is a coloured dot and label after the options, categories are chips below the buttons so the designed layout stays intact. The API has no tags, only categories, de-duplicated by name (the demo product lists "Mules" twice).
- **Untracked stock reads "In stock".** When the store doesn't track stock (`track_stock: false`) the product is always orderable, so that's the honest label.
- **Error state** isn't in Figma either; it reuses the page's buttons and type scale.
- **Currency.** Prices are the store's EGP, shown as `E£` (the narrow symbol) so the price row fits the design. Figma's `£`, the `$` on the product cards and the `USD` footer selector are static design content.
- **Sale highlighting** is the crossed-out old price next to the bold current price, with no discount badge.

### Requirements handled differently

- **Quantity selector.** Figma has no quantity stepper on the product page, so Add To Cart adds one item. Quantity is changed in the cart drawer, where `+` stops at the stock cap and `−` at 1 removes the line. `toCartItem` already accepts a quantity if a page stepper is wanted later.
- **Responsive images (`srcset`).** Product images are served by DigitalOcean Spaces at a single size; `?w=400` returns the same 290 KB file, so there are no smaller versions to list. That would need a resizing CDN or sizes generated at upload. In place instead: WebP, aspect-ratio boxes (no layout shift), high fetch priority for the main image, and lazy loading for thumbnails and below-the-fold cards.

### Demo data limits

- The demo product's 9 variants are a full 3 × 3 grid at the same price, with stock untracked, so the live page never shows a disabled option or a price change. That behaviour is covered by `variant.test.ts` and was checked in the browser with injected data: missing combinations show "Not available", sold-out ones "Sold out", and picking a colour moves the size to one that can be ordered.
