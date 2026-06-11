import { API_BASE_URL } from '../config.js';
import { TRANSLATIONS, translatePage } from '../translations.js';
import { WINERIES_DATA } from '../wineries.js';
import { getCart, removeFromCart, clearCart, addToCart, EXPERIENCE_METADATA } from '../ui/cart.js';

export function initReservations() {
    const reservationForm = document.getElementById('reservation-form');
    if (!reservationForm) return;

    // 1. Capture experience from URL query parameters (e.g., reservas.html?bodega=alva&experiencia=lunch)
    const urlParams = new URLSearchParams(window.location.search);
    const bodegaParam = urlParams.get('bodega');
    const experienciaParam = urlParams.get('experiencia');

    if (bodegaParam) {
        const expType = experienciaParam || 'general';
        // Check if this specific item is already in the cart to avoid duplicating on direct link clicks
        const cart = getCart();
        const exists = cart.some(item => item.bodega === bodegaParam && item.experiencia === expType);
        
        if (!exists) {
            addToCart({
                bodega: bodegaParam,
                experiencia: expType,
                fecha: '',
                hora: '',
                invitados: 1
            });
        }
        
        // Clean URL to prevent re-adding on page refresh
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('bodega');
        newUrl.searchParams.delete('experiencia');
        window.history.replaceState({}, '', newUrl);
    }

    // 2. Render cart items and summary
    renderCart();

    // 3. Set up listeners
    reservationForm.addEventListener('submit', enviarReservas);

    // Render cart items dynamically
    function renderCart() {
        const cart = getCart();
        const activeState = document.getElementById('cart-active-state');
        const emptyState = document.getElementById('cart-empty-state');
        const lang = localStorage.getItem('entreCopasLanguage') || 'es';

        if (cart.length === 0) {
            if (activeState) activeState.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (activeState) activeState.classList.remove('hidden');
        if (emptyState) emptyState.classList.add('hidden');

        const container = document.getElementById('cart-items-container');
        if (!container) return;
        container.innerHTML = '';

        cart.forEach((item, index) => {
            const wineryData = WINERIES_DATA[item.bodega];
            const imagePath = wineryData ? '../' + wineryData.image : '../assets/winery.png';
            const wineryNameKey = `winery-${item.bodega}-name`;
            const wineryName = (TRANSLATIONS[lang] && TRANSLATIONS[lang][wineryNameKey]) || (wineryData ? wineryData.name : item.bodega);
            const experienceNameKey = `winery-${item.bodega}-${item.experiencia}-name`;
            
            // Experience Name fallback: Check translation, else use capitalized type
            let experienceName = (TRANSLATIONS[lang] && TRANSLATIONS[lang][experienceNameKey]);
            if (!experienceName) {
                if (item.experiencia === 'general') {
                    experienceName = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['experience-type-general']) || 'Visita General';
                } else {
                    const typeKey = `experience-type-${item.experiencia}`;
                    experienceName = (TRANSLATIONS[lang] && TRANSLATIONS[lang][typeKey]) || item.experiencia;
                }
            }

            const meta = (EXPERIENCE_METADATA[item.bodega] && EXPERIENCE_METADATA[item.bodega][item.experiencia]) || { price: 15, duration: "1.0 hs" };
            
            const itemFecha = item.fecha || '';
            const itemHora = item.hora || '';
            const itemInvitados = item.invitados || 1;

            const cardHTML = `
                <div class="cart-item-card" data-index="${index}">
                    <div class="cart-item-img-container">
                        <img src="${imagePath}" alt="${wineryName}" class="cart-item-img" onerror="this.src='../assets/winery.png'">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-header">
                            <div class="cart-item-title-section">
                                <span class="cart-item-winery-name">${wineryName}</span>
                                <h3>${experienceName}</h3>
                            </div>
                            <button type="button" class="cart-item-remove-btn" data-index="${index}" aria-label="Eliminar experiencia">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="cart-item-selectors">
                            <div class="cart-item-selector-group">
                                <label data-i18n="cart-item-date">Fecha</label>
                                <input type="date" value="${itemFecha}" class="form-control date-input" required>
                            </div>
                            <div class="cart-item-selector-group">
                                <label data-i18n="cart-item-time">Hora</label>
                                <select class="form-control time-select" required>
                                    <option value="" disabled ${!itemHora ? 'selected' : ''} data-i18n="res-form-time-select">Seleccione hora</option>
                                    <option value="10:00" ${itemHora === '10:00' ? 'selected' : ''}>10:00 AM</option>
                                    <option value="12:00" ${itemHora === '12:00' ? 'selected' : ''}>12:00 PM</option>
                                    <option value="15:00" ${itemHora === '15:00' ? 'selected' : ''}>15:00 PM</option>
                                    <option value="17:00" ${itemHora === '17:00' ? 'selected' : ''}>17:00 PM</option>
                                </select>
                            </div>
                            <div class="cart-item-selector-group">
                                <label data-i18n="cart-item-guests">Invitados</label>
                                <input type="number" min="1" max="10" value="${itemInvitados}" class="form-control guests-input" required>
                            </div>
                        </div>
                        
                        <div class="cart-item-meta">
                            <span class="cart-item-duration">${meta.duration}</span>
                            <span class="cart-item-price">$${meta.price} USD / persona</span>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Re-run translations on the newly rendered components
        translatePage(lang);

        // Bind interactive events to inputs and removal buttons
        bindCartEvents();

        // Calculate and update the total price
        calculateTotal();
    }

    function bindCartEvents() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        // Clean up older listeners by cloning or just letting event delegation handle it once.
        // We use event delegation on the container.
    }

    // Set up event delegation on the cart container
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        cartContainer.addEventListener('change', (e) => {
            const card = e.target.closest('.cart-item-card');
            if (!card) return;
            const index = parseInt(card.getAttribute('data-index'), 10);
            const cart = getCart();
            
            if (e.target.classList.contains('date-input')) {
                cart[index].fecha = e.target.value;
            } else if (e.target.classList.contains('time-select')) {
                cart[index].hora = e.target.value;
            } else if (e.target.classList.contains('guests-input')) {
                let val = parseInt(e.target.value, 10) || 1;
                if (val < 1) val = 1;
                if (val > 10) val = 10;
                e.target.value = val;
                cart[index].invitados = val;
            }
            
            localStorage.setItem('entreCopasCart', JSON.stringify(cart));
            calculateTotal();
        });

        cartContainer.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.cart-item-remove-btn');
            if (!removeBtn) return;
            const index = parseInt(removeBtn.getAttribute('data-index'), 10);
            removeFromCart(index);
            renderCart();
        });
    }

    function calculateTotal() {
        const cart = getCart();
        let total = 0;
        cart.forEach(item => {
            const meta = (EXPERIENCE_METADATA[item.bodega] && EXPERIENCE_METADATA[item.bodega][item.experiencia]) || { price: 15 };
            const guests = item.invitados || 1;
            total += meta.price * guests;
        });

        const totalEl = document.getElementById('cart-total-price');
        if (totalEl) {
            totalEl.textContent = `$${total} USD`;
        }
    }

    function showFormMessage(message, type) {
        const msgEl = document.getElementById('form-message');
        if (!msgEl) return;
        msgEl.textContent = message;
        msgEl.className = `form-message ${type}`; // 'success' or 'error'
        msgEl.classList.remove('hidden');
    }

    async function enviarReservas(e) {
        e.preventDefault();

        const cart = getCart();
        if (cart.length === 0) return;

        const lang = localStorage.getItem('entreCopasLanguage') || 'es';

        // Check if all items have fecha and hora
        const incomplete = cart.some(item => !item.fecha || !item.hora);
        if (incomplete) {
            const validationMsg = {
                es: "Por favor complete la fecha y hora para todas las experiencias.",
                en: "Please complete the date and time for all experiences.",
                pt: "Por favor preencha a data e a hora para todas as experiências."
            };
            showFormMessage(validationMsg[lang] || validationMsg.es, 'error');
            return;
        }

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;

        // Perform parallel fetch requests to the backend for each experience in the cart
        const promises = cart.map(async (item, index) => {
            const wineryName = WINERIES_DATA[item.bodega]?.name || item.bodega;
            const payload = {
                nombre: nombre,
                email: email,
                bodega: wineryName,
                fecha: item.fecha,
                hora: item.hora,
                invitados: parseInt(item.invitados, 10) || 1
            };

            const resp = await fetch(`${API_BASE_URL}/reservas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            let respBody = null;
            try { respBody = await resp.json(); } catch (err) { /* no JSON body */ }

            if (resp.ok) {
                // Keep local copy for user dashboard
                const localRes = {
                    id: respBody && respBody.id ? respBody.id : Date.now().toString(36) + '-' + index,
                    nombre: payload.nombre,
                    email: payload.email,
                    bodega: payload.bodega,
                    bodegaId: item.bodega,
                    experiencia: item.experiencia,
                    fecha: payload.fecha,
                    hora: payload.hora,
                    invitados: payload.invitados,
                    status: (respBody && respBody.status) ? respBody.status : 'Pendiente'
                };

                let reservations = JSON.parse(localStorage.getItem('entreCopasReservations') || '[]');
                reservations.push(localRes);
                localStorage.setItem('entreCopasReservations', JSON.stringify(reservations));
                return { success: true };
            } else {
                return { success: false, message: respBody?.message };
            }
        });

        try {
            const results = await Promise.all(promises);
            const allSuccessful = results.every(res => res.success);

            if (allSuccessful) {
                const successMsg = TRANSLATIONS[lang]?.['cart-success-msg'] || '¡Reservas solicitadas con éxito!';
                showFormMessage(successMsg, 'success');
                
                clearCart();
                
                setTimeout(() => {
                    window.location.href = 'panel.html';
                }, 2000);
            } else {
                const defaultError = TRANSLATIONS[lang]?.['res-error-msg'] || 'Error al enviar la reserva. Intente de nuevo.';
                showFormMessage(defaultError, 'error');
            }
        } catch (error) {
            console.error('Error de red al enviar las reservas:', error);
            const connErrorMsg = TRANSLATIONS[lang]?.['network-error-msg'] || 'No se pudo conectar con el servidor. Revise su conexión e intente más tarde.';
            showFormMessage(connErrorMsg, 'error');
        }
    }

    // Re-render when language changes
    document.addEventListener('languageChanged', () => {
        renderCart();
    });
}
