import { TRANSLATIONS } from '../translations.js';

export const EXPERIENCE_METADATA = {
    alva: {
        tasting: { price: 25, duration: "1.5 hs", type: "tasting" },
        lunch: { price: 65, duration: "2.5 hs", type: "lunch" },
        sunset: { price: 35, duration: "2.0 hs", type: "sunset" },
        general: { price: 15, duration: "1.0 hs", type: "general" }
    },
    reserve: {
        tasting: { price: 30, duration: "1.5 hs", type: "tasting" },
        lunch: { price: 75, duration: "2.5 hs", type: "lunch" },
        sunset: { price: 40, duration: "2.0 hs", type: "sunset" },
        general: { price: 20, duration: "1.0 hs", type: "general" }
    },
    marini: {
        tasting: { price: 20, duration: "1.5 hs", type: "tasting" },
        lunch: { price: 55, duration: "2.0 hs", type: "lunch" },
        sunset: { price: 30, duration: "1.5 hs", type: "sunset" },
        general: { price: 12, duration: "1.0 hs", type: "general" }
    },
    brisas: {
        tasting: { price: 28, duration: "1.5 hs", type: "tasting" },
        lunch: { price: 60, duration: "2.0 hs", type: "lunch" },
        sunset: { price: 45, duration: "3.0 hs", type: "sunset" },
        general: { price: 18, duration: "1.0 hs", type: "general" }
    },
    altos: {
        tasting: { price: 32, duration: "1.5 hs", type: "tasting" },
        lunch: { price: 70, duration: "2.5 hs", type: "lunch" },
        sunset: { price: 38, duration: "2.0 hs", type: "sunset" },
        general: { price: 22, duration: "1.0 hs", type: "general" }
    }
};

export function getCart() {
    return JSON.parse(localStorage.getItem('entreCopasCart') || '[]');
}

export function addToCart(item) {
    const cart = getCart();
    cart.push(item);
    localStorage.setItem('entreCopasCart', JSON.stringify(cart));
    updateCartBadges();
}

export function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem('entreCopasCart', JSON.stringify(cart));
    updateCartBadges();
}

export function clearCart() {
    localStorage.removeItem('entreCopasCart');
    updateCartBadges();
}

export function updateCartBadges() {
    const cart = getCart();
    const count = cart.length;
    document.querySelectorAll('.cart-badge').forEach(badge => {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

export function initCart() {
    updateCartBadges();
    
    // Listen to changes in the cart (for synchronization across tabs/pages)
    window.addEventListener('storage', (e) => {
        if (e.key === 'entreCopasCart') {
            updateCartBadges();
        }
    });
}
