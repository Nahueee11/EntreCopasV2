// Main Entry Point
import { initTranslation } from './translations.js';
import { initFavorites } from './ui/favorites.js';
import { initSharing } from './ui/sharing.js';
import { initAnimations } from './ui/animations.js';
import { initCarousel } from './ui/carousel.js';
import { initMap } from './map.js';
import { initCart } from './ui/cart.js';
import { API_BASE_URL } from './config.js';

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

    // Header dinámico según sesión
const userIconLink = document.querySelector('a[href*="registro.html"], a[href="pages/registro.html"]');
const userLogged = localStorage.getItem('entreCopasUser');

if (userIconLink && userLogged) {
    userIconLink.style.position = 'relative';
    userIconLink.href = '#';

    // Crear dropdown
    const dropdown = document.createElement('div');
    dropdown.style.cssText = `
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #ccc;
        min-width: 160px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    dropdown.innerHTML = `
        <a href="pages/panel.html?tab=perfil" style="display:block; padding: 10px 16px; font-size:14px; color: var(--on-surface); text-decoration:none;">Mi Perfil</a>
        <a href="#" id="btn-logout" style="display:block; padding: 10px 16px; font-size:14px; color: var(--on-surface); text-decoration:none;">Cerrar Sesión</a>
    `;
    userIconLink.appendChild(dropdown);

    userIconLink.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
        if (!userIconLink.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.id === 'btn-logout') {
            e.preventDefault();
            localStorage.removeItem('entreCopasUser');
            window.location.href = window.location.origin + '/index.html';
        }
    });
}
});

// Modal de login
const user = localStorage.getItem('entreCopasUser');
const modal = document.getElementById('login-modal');
if (modal && !user) {
    modal.classList.add('active');
}

const modalForm = document.getElementById('modal-login-form');
if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('modal-email').value;
        const contrasena = document.getElementById('modal-password').value;
        const msgEl = document.getElementById('modal-login-message');

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, contrasena })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('entreCopasUser', JSON.stringify(data));
                modal.classList.remove('active');
            } else {
                msgEl.textContent = data.error || 'Correo o contraseña incorrectos.';
                msgEl.className = 'form-message error';
                msgEl.classList.remove('hidden');
            }
        } catch (err) {
            msgEl.textContent = 'No se pudo conectar con el servidor.';
            msgEl.className = 'form-message error';
            msgEl.classList.remove('hidden');
        }
    });
}

// n8n Chatbot Integration
document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Create target container
    const chatDiv = document.createElement('div');
    chatDiv.id = 'n8n-chat';
    document.body.appendChild(chatDiv);

    // Initialize Chat via dynamic import
    import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js').then(({ createChat }) => {
        createChat({
            webhookUrl: 'http://localhost:5678/webhook/5b10a946-58e7-4fd5-8341-70388b37becc/chat',
            webhookConfig: {
                method: 'POST',
                headers: {}
            },
            target: '#n8n-chat',
            mode: 'window',
            chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            loadPreviousSession: true,
            metadata: {},
            showWelcomeScreen: true,
            defaultLanguage: 'es',
            initialMessages: [
                '¡Hola! 👋',
                'Soy tu asistente virtual de Entre Copas. ¿En qué puedo ayudarte hoy?'
            ],
            i18n: {
                es: {
                    title: 'Entre Copas',
                    subtitle: "Tu asistente de experiencias en bodegas.",
                    footer: '',
                    getStarted: 'Nueva Conversación',
                    inputPlaceholder: 'Escribe tu pregunta aquí...',
                },
            },
            enableStreaming: false,
        });
    });
});
