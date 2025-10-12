# TODO: Rapihkan Bagian Keranjang di profil.html

## Plan Breakdown and Steps

### Information Gathered (Summary)
- File: public/profil.html
- Cart section: In "Cart Tab" (#cart-content), renders items dynamically via JS from Firebase/localStorage.
- Current issues: No summary totals, no real-time updates, basic styling.
- Goal: Add professional summary (subtotal, ongkir Rp 10.000, grand total, checkout button), improve JS for calculations/real-time, refine CSS for clean look matching screenshot.

### Steps to Complete
- [ ] Step 1: Add HTML structure for cart summary section below #cart-items-container in the cart tab. Include subtotal, ongkir, grand total, and checkout button.
- [ ] Step 2: Update JS in renderCartItems() to calculate totals (subtotal = sum of item prices * quantities; grand total = subtotal + 10000) and populate the summary elements dynamically. Also, hide summary when cart is empty.
- [ ] Step 3: Add real-time cart listener using onSnapshot (if Firebase available) to auto-update cart display on changes.
- [ ] Step 4: Add/refine CSS styles for the new summary section (e.g., bordered card with green accents, right-aligned totals, mobile-friendly).
- [ ] Step 5: Enhance image handling in renderCartItems() with loading skeleton and better fallbacks.
- [ ] Step 6: Test the updates (render items, calculate totals, remove item, empty state, mobile view). Mark all as complete.

### Dependent Files
- None (self-contained in public/profil.html).

### Followup After Completion
- Verify in browser: Add sample cart items, check totals/checkout.
- If issues, debug and iterate.
- Update TODO.md with [x] for completed steps.
