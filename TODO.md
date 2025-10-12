# TODO: Add Mobile-Friendly Progress Bar to Profil Order Cards

## Steps to Complete:

1. **Update TODO.md** - Add this new task section to track progress. (Completed)
2. **Edit public/profil.html** - Modify the `renderOrders` function to insert a 4-step horizontal progress bar in each order card, dynamically filled based on order status (process=step1, packing=step2, shipping/delivered=step3, completed=step4; cancelled as error state). Use Tailwind for responsive design (compact on mobile). Position after order header and before shipping info. (Pending)
3. **Update TODO.md** - Mark the edit as completed. (Pending)
4. **Test the Change** - Run local server (`node server.js`), view profil.html on mobile (Chrome DevTools), verify progress bar renders correctly for various statuses (simulate via Firebase console), ensure it fits horizontally without overflow, and updates on status changes. (Pending)

# TODO: Fix Total Belanja to Show Lifetime Spending in Profil.html

## Steps to Complete:

1. **Edit public/profil.html** - Update loadUserStats() to query all order statuses ['process', 'packing', 'shipping', 'delivered', 'completed'] for totalOrders and totalSpent. Recalculate loyaltyPoints from full totalSpent. (Pending)
2. **Update TODO.md** - Mark the edit as completed. (Pending)
3. **Test the Change** - Reload profil.html, verify Total Belanja includes completed orders from Aktivitas Belanja tab. (Pending)
