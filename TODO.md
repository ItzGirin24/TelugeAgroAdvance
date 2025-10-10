# TODO: Fix Cart Data Sync to Firebase Database

## Cart Firebase Integration
- [ ] Modify addToCart to call saveCartToFirebase after saving to localStorage
- [ ] Fix updateCartItemQuantity to use user-specific cart key and save to Firebase
- [ ] Fix removeCartItem to use user-specific cart key and save to Firebase
- [ ] Fix updateCartDisplay to use user-specific cart key
- [ ] Update auth state listener to call loadCart when user logs in
- [ ] Ensure cart is cleared on logout

## Testing
- [ ] Verify cart data is saved to Firebase "carts" collection
- [ ] Test cart operations sync with Firebase
- [ ] Check cart loads correctly on login
- [ ] Ensure cart is cleared on logout
