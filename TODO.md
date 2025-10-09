# Fix Cart Functionality: Items not appearing in cart.html

## Problem
Items added in store.html do not appear in cart.html due to localStorage key mismatch.

## Root Cause
- store.html uses dynamic keys like 'cart_useremail' or 'cart_admin' based on login status
- cart.html reads from fixed key 'cart'
- This mismatch prevents cart items from being shared between pages

## Solution
Update store.html to use consistent 'cart' key for localStorage operations.

## Steps
- [ ] Remove getCartKey() function from store.html
- [ ] Update addToCart() function to use 'cart' key
- [ ] Update updateCartCount() function to use 'cart' key
- [ ] Update updateCartDisplay() function to use 'cart' key
- [ ] Test adding items in store.html and verify they appear in cart.html
- [ ] Test cart count updates and quantity changes
