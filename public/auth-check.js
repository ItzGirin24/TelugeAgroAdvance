// Shared authentication check module for all pages
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyB2sLqWwZIxr65c3CcNgKCCjmDTeDlSnfY",
    authDomain: "telugeagro2025.firebaseapp.com",
    projectId: "telugeagro2025",
    storageBucket: "telugeagro2025.firebasestorage.app",
    messagingSenderId: "1029963109637",
    appId: "1:1029963109637:web:86824d0db45e1489b3136c",
    measurementId: "G-XF1JDPME66"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check if user is authenticated and redirect if not
export function requireAuth(currentPage) {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                resolve(user);
            } else {
                // No user is signed in, redirect to login
                const redirectUrl = `login.html?redirect=${encodeURIComponent(currentPage)}`;
                window.location.href = redirectUrl;
                reject(new Error('Not authenticated'));
            }
        });
    });
}

// Get current user UID for cart and history
export function getCurrentUserUID() {
    const user = auth.currentUser;
    return user ? user.uid : null;
}

// Get current user email
export function getCurrentUserEmail() {
    const user = auth.currentUser;
    return user ? user.email : null;
}

export { auth };