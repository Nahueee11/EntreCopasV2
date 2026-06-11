import { WINERIES_DATA, createWineryCardHTML } from '../wineries.js';
import { TRANSLATIONS } from '../translations.js';

let favorites = JSON.parse(localStorage.getItem('entreCopasFavorites') || '[]');

export function getFavorites() {
    return favorites;
}

export function updateFavoriteButtonsUI() {
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (favorites.includes(id)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

export function renderFavoritesInPanel() {
    const favoritesListContainer = document.getElementById('favorites-list');
    if (!favoritesListContainer) return;
    
    // Refresh local array
    favorites = JSON.parse(localStorage.getItem('entreCopasFavorites') || '[]');
    const lang = localStorage.getItem('entreCopasLanguage') || 'es';
    
    if (favorites.length > 0) {
        favoritesListContainer.innerHTML = '';
        favorites.forEach(id => {
            const winery = WINERIES_DATA[id];
            if (winery) {
                favoritesListContainer.insertAdjacentHTML('beforeend', createWineryCardHTML(winery, true));
            }
        });
        // Update bindings for any loaded buttons
        updateFavoriteButtonsUI();
    } else {
        const msg = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['panel-no-favorites']) || 'No tienes bodegas agregadas a favoritos.';
        const btnText = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['panel-explore-btn']) || 'Explorar Bodegas';
        favoritesListContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <p data-i18n="panel-no-favorites">${msg}</p>
                <a href="explorar.html" class="btn btn-ghost mt-sm" data-i18n="panel-explore-btn">${btnText}</a>
            </div>
        `;
    }
}

export function initFavorites() {
    // Initialize favorite buttons state on load
    updateFavoriteButtonsUI();

    // Global listener for favorites buttons (delegated to document for dynamic support)
    document.addEventListener('click', (e) => {
        const favBtn = e.target.closest('.btn-favorite');
        if (favBtn) {
            e.preventDefault();
            e.stopPropagation();
            const id = favBtn.getAttribute('data-id');
            
            if (favorites.includes(id)) {
                favorites = favorites.filter(favId => favId !== id);
                favBtn.classList.remove('active');
            } else {
                favorites.push(id);
                favBtn.classList.add('active');
            }
            
            localStorage.setItem('entreCopasFavorites', JSON.stringify(favorites));
            
            // Sincronizar todos los botones con este id en la misma página
            document.querySelectorAll(`.btn-favorite[data-id="${id}"]`).forEach(btn => {
                if (favorites.includes(id)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Si estamos en el panel y se quita un favorito, volver a renderizar
            if (document.getElementById('favorites-list')) {
                renderFavoritesInPanel();
            }
        }
    });

    // Escuchar el evento de cambio de idioma para volver a renderizar si es necesario
    document.addEventListener('languageChanged', () => {
        if (document.getElementById('favorites-list')) {
            renderFavoritesInPanel();
        }
    });
}
