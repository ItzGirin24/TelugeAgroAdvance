# TODO: Fix Midtrans Checkout Issue

## Issues Identified
- Endpoint path mismatch: cart.html fetches '/api/get-snap-token', but server-local.js had '/get-snap-token'
- MIDTRANS_SERVER_KEY may not be set in environment
- Client key in cart.html may need verification

## Fixes Applied
- [x] Updated server-local.js endpoint to '/api/get-snap-token' to match cart.html fetch
- [x] Added logging for MIDTRANS_SERVER_KEY status in server-local.js

## Remaining Tasks
- [ ] Set MIDTRANS_SERVER_KEY in .env file for local development
- [ ] Set MIDTRANS_SERVER_KEY in Vercel environment variables for production
- [ ] Verify Midtrans client key in cart.html is correct
- [ ] Test checkout locally: run `node server-local.js` and try checkout
- [ ] Test checkout on Vercel after deploying
- [ ] Check server logs for any errors during checkout attempt

## Testing Steps
1. Ensure MIDTRANS_SERVER_KEY is set in Vercel environment variables (for production) or .env (for local with vercel dev)
2. For local development: Run `npx vercel dev` (this simulates Vercel serverless locally)
3. Open the local URL provided by vercel dev (usually http://localhost:3000)
4. Navigate to cart.html, add item to cart, try checkout
5. Check console logs for errors
6. For production: Deploy to Vercel and test similarly
7. If still 404, ensure vercel dev is running and the URL is correct

## Notes
- Server key is different from client key
- Client key is public, server key is secret
- If still fails, check Midtrans dashboard for transaction logs
