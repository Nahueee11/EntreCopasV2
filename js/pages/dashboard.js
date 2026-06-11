import { WINERIES_DATA } from '../wineries.js';
import { TRANSLATIONS } from '../translations.js';
import { renderFavoritesInPanel } from '../ui/favorites.js';

export function renderReservations() {
    const reservationsList = document.getElementById('reservations-list');
    if (!reservationsList) return;
    
    const reservations = JSON.parse(localStorage.getItem('entreCopasReservations') || '[]');
    const lang = localStorage.getItem('entreCopasLanguage') || 'es';
    
    if (reservations.length > 0) {
        reservationsList.innerHTML = ''; // Clear empty state
        
        // Sort by date (newest first)
        reservations.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        const localeMap = {
            es: 'es-ES',
            en: 'en-US',
            pt: 'pt-BR'
        };
        const localeStr = localeMap[lang] || 'es-ES';
        
        const atWord = lang === 'es' ? 'a las' : lang === 'pt' ? 'às' : 'at';
        const guestWord = lang === 'es' ? 'Invitado(s)' : lang === 'pt' ? 'Convidado(s)' : 'Guest(s)';
        
        const statusMap = {
            es: { 'Pendiente': 'Pendiente', 'Confirmada': 'Confirmada' },
            en: { 'Pendiente': 'Pending', 'Confirmada': 'Confirmed' },
            pt: { 'Pendiente': 'Pendente', 'Confirmada': 'Confirmada' }
        };

        reservations.forEach(res => {
            const dateObj = new Date(res.fecha);
            const dateStr = dateObj.toLocaleDateString(localeStr, { day: 'numeric', month: 'long', year: 'numeric' });
            
            let translatedWineryName = res.bodega;
            let wineryKey = res.bodegaId;

            // If bodegaId is not set, try to find it from the name
            if (!wineryKey) {
                for (const key in WINERIES_DATA) {
                    if (WINERIES_DATA[key].name === res.bodega) {
                        wineryKey = key;
                        break;
                    }
                }
            }

            if (wineryKey) {
                translatedWineryName = (TRANSLATIONS[lang] && TRANSLATIONS[lang][`winery-${wineryKey}-name`]) || res.bodega;
            }

            let translatedExpName = '';
            if (res.experiencia && wineryKey) {
                if (res.experiencia === 'general') {
                    translatedExpName = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['experience-type-general']) || 'Visita General';
                } else {
                    const expKey = `winery-${wineryKey}-${res.experiencia}-name`;
                    translatedExpName = (TRANSLATIONS[lang] && TRANSLATIONS[lang][expKey]) || res.experiencia;
                }
            }

            const translatedStatus = (statusMap[lang] && statusMap[lang][res.status]) || res.status;

            const cardHTML = `
                <div class="reservation-card">
                    <div class="res-details">
                        <h4>${translatedWineryName}${translatedExpName ? ` — ${translatedExpName}` : ''}</h4>
                        <div class="res-meta">
                            <span>${dateStr} ${atWord} ${res.hora}</span> | <span>${res.invitados} ${guestWord}</span>
                        </div>
                    </div>
                    <div class="res-status">${translatedStatus}</div>
                </div>
            `;
            reservationsList.insertAdjacentHTML('beforeend', cardHTML);
        });
    } else {
        const msg = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['panel-no-reservations']) || 'No tienes reservas próximas.';
        const btnText = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['panel-explore-btn']) || 'Explorar Bodegas';
        reservationsList.innerHTML = `
            <div class="empty-state">
                <p data-i18n="panel-no-reservations">${msg}</p>
                <a href="explorar.html" class="btn btn-ghost mt-sm" data-i18n="panel-explore-btn">${btnText}</a>
            </div>
        `;
    }
}

export function initDashboard() {
    const dashboardMenu = document.getElementById('dashboard-menu');
    
    // Si no estamos en la página del panel, no hacer nada
    if (!dashboardMenu && !document.getElementById('reservations-list')) return;

    // Render inicial de reservas
    renderReservations();

    // Comprobar estado de pago desde Mercado Pago
    checkPaymentStatus();
    
    // Render inicial de favoritas si esa es la sección que está activa
    const activeTab = dashboardMenu ? dashboardMenu.querySelector('a.active') : null;
    if (activeTab && activeTab.getAttribute('data-tab') === 'favoritas') {
        renderFavoritesInPanel();
    }

    function checkPaymentStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        if (!status) return;

        const lang = localStorage.getItem('entreCopasLanguage') || 'es';
        
        // Setup toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';

        let msg = '';
        if (status === 'success') {
            toast.classList.add('toast-success');
            msg = {
                es: '¡Pago completado con éxito! Sus reservas han sido confirmadas.',
                en: 'Payment completed successfully! Your bookings have been confirmed.',
                pt: 'Pagamento concluído com sucesso! Suas reservas foram confirmadas.'
            }[lang] || '¡Pago completado con éxito!';

            // Update local reservations status from 'Pendiente' to 'Confirmada'
            let reservations = JSON.parse(localStorage.getItem('entreCopasReservations') || '[]');
            let updated = false;
            reservations = reservations.map(res => {
                if (res.status === 'Pendiente') {
                    res.status = 'Confirmada';
                    updated = true;
                }
                return res;
            });
            if (updated) {
                localStorage.setItem('entreCopasReservations', JSON.stringify(reservations));
                renderReservations(); // Re-render lists to show 'Confirmada'
            }

        } else if (status === 'failure') {
            toast.classList.add('toast-error');
            msg = {
                es: 'El pago fue cancelado o rechazado. Sus reservas permanecen pendientes.',
                en: 'Payment was cancelled or rejected. Your bookings remain pending.',
                pt: 'O pagamento foi cancelado ou rejeitado. Suas reservas continuam pendentes.'
            }[lang] || 'El pago fue cancelado o rechazado.';
        } else if (status === 'pending') {
            toast.classList.add('toast-info');
            msg = {
                es: 'El pago está pendiente de confirmación. Sus reservas se actualizarán pronto.',
                en: 'Payment is pending confirmation. Your bookings will be updated soon.',
                pt: 'O pagamento está pendente de confirmação. Suas reservas serão atualizadas em breve.'
            }[lang] || 'El pago está en proceso de confirmación.';
        }

        toast.textContent = msg;
        toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);

        // Animate out after 6 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 6000);

        // Clean query parameters from URL
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('status');
        window.history.replaceState({}, '', newUrl);
    }

    if (dashboardMenu) {
        const tabs = dashboardMenu.querySelectorAll('a[data-tab]');
        const contentSections = document.querySelectorAll('.dashboard-main-area .dashboard-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Active menu link styling
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show/hide sections
                const targetTab = tab.getAttribute('data-tab');
                contentSections.forEach(section => {
                    if (section.id === `tab-content-${targetTab}`) {
                        section.classList.remove('hidden');
                        section.classList.add('active-tab-content');
                    } else {
                        section.classList.add('hidden');
                        section.classList.remove('active-tab-content');
                    }
                });
                
                // Cargar favoritas si esa pestaña fue seleccionada
                if (targetTab === 'favoritas') {
                    renderFavoritesInPanel();
                }
            });
        });
    }

    // Escuchar cambios de idioma para actualizar el panel dinámicamente
    document.addEventListener('languageChanged', () => {
        renderReservations();
        const activeTab = dashboardMenu ? dashboardMenu.querySelector('a.active') : null;
        if (activeTab && activeTab.getAttribute('data-tab') === 'favoritas') {
            renderFavoritesInPanel();
        }
    });
}
