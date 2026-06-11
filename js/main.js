// Main Entry Point
import { initTranslation } from './translations.js';
import { initFavorites } from './ui/favorites.js';
import { initSharing } from './ui/sharing.js';
import { initAnimations } from './ui/animations.js';
import { initCarousel } from './ui/carousel.js';
import { initMap } from './map.js';
import { initCart } from './ui/cart.js';

// Page-specific controllers
import { initExplore } from './pages/explore.js';
import { initReservations } from './pages/reservations.js';
import { initDashboard } from './pages/dashboard.js';
import { initRegister } from './pages/register.js';
import { initPartner } from './pages/partner.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize global services
    initTranslation();
    initFavorites();
    initSharing();
    initAnimations();
    initCart();

    // 2. Initialize conditional interactive UI components
    initCarousel();
    initMap();

    // 3. Initialize page-specific scripts
    initExplore();
    initReservations();
    initDashboard();
    initRegister();
    initPartner();
});
