# TODO: Auto-switch to Aktivitas Belanja Tab on Order Completion in Profile

## Steps to Complete:

1. **Create TODO.md** - Track progress for the task. (Completed)
2. **Edit public/profil.html** - Add logic in loadOrderHistory() to check for completed orders ('delivered' or 'completed' status) and automatically switch to 'history' tab if currently on 'orders' tab. (Completed)
3. **Update TODO.md** - Mark the edit as completed and note any followup testing. (Completed)
4. **Enhance History Tab** - Modify loadShoppingHistory() to include completed orders from Firebase alongside cart activities, displaying order details like ID, date, and total. (Completed)
5. **Test the Change** - Run local server (e.g., node server.js), login as user, navigate to profil.html, switch to Orders tab, verify auto-switch to History tab if any completed order exists; check that completed orders appear in History tab; test real-time update by changing order status in Firebase console. (Pending)
