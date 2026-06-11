import { TRANSLATIONS } from './translations.js';

export const WINERIES_DATA = {
    alva: {
        id: 'alva',
        category: 'valle',
        categoryLabel: 'Valle Central',
        name: 'Bodegas de Alva',
        description: 'Una fusión de arquitectura de vanguardia y tradición centenaria en el corazón del valle.',
        image: 'assets/winery.png'
    },
    reserve: {
        id: 'reserve',
        category: 'montana',
        categoryLabel: 'Montaña',
        name: 'The Reserve',
        description: 'Exclusividad y catas privadas en un entorno natural inigualable con vistas a la cordillera.',
        image: 'assets/reserve.png'
    },
    marini: {
        id: 'marini',
        category: 'valle',
        categoryLabel: 'Valle Central',
        name: 'Villa Marini',
        description: 'Herencia y pasión en cada botella, con vistas panorámicas a los viñedos históricos.',
        image: 'assets/marini.png'
    },
    brisas: {
        id: 'brisas',
        category: 'costa',
        categoryLabel: 'Costa',
        name: 'Brisas del Mar',
        description: 'Vinos frescos con influencia oceánica, degustación al atardecer frente al mar.',
        image: 'assets/brisas.png'
    },
    altos: {
        id: 'altos',
        category: 'montana',
        categoryLabel: 'Montaña',
        name: 'Altos de Piedra',
        description: 'Viñedos de altura que producen vinos de carácter intenso y mineralidad única.',
        image: 'assets/altos.png'
    }
};

export function createWineryCardHTML(winery, isFavorite) {
    const lang = localStorage.getItem('entreCopasLanguage') || 'es';
    const translatedCategoryLabel = (TRANSLATIONS[lang] && TRANSLATIONS[lang][`winery-${winery.category}-label`]) || winery.categoryLabel;
    const translatedName = (TRANSLATIONS[lang] && TRANSLATIONS[lang][`winery-${winery.id}-name`]) || winery.name;
    const translatedDesc = (TRANSLATIONS[lang] && TRANSLATIONS[lang][`winery-${winery.id}-desc`]) || winery.description;
    const translatedReserveText = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['winery-btn-reserve']) || 'Reservar';

    return `
        <article class="winery-card" data-category="${winery.category}" data-id="${winery.id}">
            <div class="winery-image-container">
                <img src="${winery.image}" alt="${translatedName}" class="winery-image" onerror="this.style.backgroundColor='var(--surface-dim)'">
                <button class="btn-favorite ${isFavorite ? 'active' : ''}" aria-label="Agregar a favoritos" data-id="${winery.id}">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
            </div>
            <div class="winery-info">
                <span class="label-caps">${translatedCategoryLabel}</span>
                <h3><a href="bodega-${winery.id}.html" class="winery-card-link">${translatedName}</a></h3>
                <p>${translatedDesc}</p>
                <div class="winery-actions">
                    <a href="reservas.html?bodega=${winery.id}&experiencia=general" class="btn btn-primary">${translatedReserveText}</a>
                    <div class="share-buttons">
                        <button class="share-btn share-whatsapp" data-name="${translatedName}" data-id="${winery.id}" aria-label="Compartir en WhatsApp">
                            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </button>
                        <button class="share-btn share-facebook" data-name="${translatedName}" data-id="${winery.id}" aria-label="Compartir en Facebook">
                            <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </button>
                        <button class="share-btn share-x" data-name="${translatedName}" data-id="${winery.id}" aria-label="Compartir en X">
                            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `;
}
