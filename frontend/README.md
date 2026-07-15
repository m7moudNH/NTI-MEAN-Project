# Shop.co Frontend (Angular)

A frontend for the NTI-MEAN-Project backend, built to match the provided Shop.co screenshots.

## Setup

```bash
npm install
npm start
```

The app runs at `http://localhost:4200` by default and expects the backend at
`http://localhost:5000/api/v1` — update `src/environments/environment.ts` if your
backend runs elsewhere.

## What's implemented

- **Public**: Home, Shop (category/gender/color/price/title filters + Previous/Next pagination), Product Detail, Cart
- **Auth**: Sign up, log in, JWT stored in localStorage and attached to requests
- **User**: Profile view/edit, change password, delete account, Cart, Checkout (creates an order from the cart), My Orders, Order Detail with cancel
- **Admin**: Product CRUD with pagination/filters, Order list with status updates

## Deliberately skipped / worked around (per your call — no backend changes)

- **Reviews & testimonials** — no reviews collection or endpoints in the backend.
- **Newsletter subscribe** — no endpoint; the input/button render but are disabled.
- **Promo codes / discount-at-checkout / delivery fee** — the Order and Cart models don't
  track these, so the cart just shows Subtotal = Total.
- **"Dress Style" filter, "Sort by"** — no matching product fields, and the backend's
  `sort` query param is accepted but never actually applied.
- **Admin user management** — there's no `/users` (list/edit/delete-any-user) route,
  only `/users/me`. Not built.
- **Numbered pagination** — `GET /products` returns `count` as the current page's
  length, not a true total, so pagination is Previous/Next rather than numbered pages.

## Known backend bugs you'll hit when using these features (not modified, per your choice)

- `PATCH /users/me/change-password` calls `user.comparePassword()`, which isn't
  defined on the User model — this will 500.
- `DELETE /users/me` references `bcrypt` without importing it — this will 500.
- `PATCH /users/me` only accepts a field named `fistName` (typo) instead of
  `firstName`, so first-name edits silently don't save.
- `POST /orders` reads `cart.totalPrice`, which isn't a field on the Cart model —
  checkout may fail or save an incorrect total until this is fixed.
- Product/user images are uploaded and saved to disk, but `backend/index.js` never
  serves the `uploads` folder statically (no `app.use('/uploads', express.static(...))`),
  so `<img>` tags pointing at `/uploads/...` will 404 until that's added.
- `DELETE /cart/:productId` reads the product id from `req.body.productId` rather
  than `req.params.productId` — the frontend's cart service sends it in the body
  to work around this.
