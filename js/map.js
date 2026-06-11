import { WINERIES_DATA } from './wineries.js';
import { TRANSLATIONS } from './translations.js';

export function initMap() {
    const mapContainer = document.getElementById('map');
    if (mapContainer && typeof L !== 'undefined') {
        const map = L.map('map', {
            scrollWheelZoom: false
        }).setView([-34.5, -64.0], 5);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        const wineryCoords = {
            alva: [-33.02, -68.85],
            reserve: [-32.95, -69.20],
            marini: [-33.60, -69.12],
            brisas: [-38.15, -57.63],
            altos: [-33.38, -69.18]
        };

        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: '<div style="background-color: var(--on-background, #1a1c1c); width: 14px; height: 14px; border-radius: 50%; border: 3px solid var(--background, #f9f9f9); box-shadow: 0 0 0 2px var(--on-background, #1a1c1c);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        for (const id in wineryCoords) {
            const winery = WINERIES_DATA[id];
            if (winery) {
                const marker = L.marker(wineryCoords[id], { icon: customIcon }).addTo(map);
                
                marker.on('click', () => {
                    const lang = localStorage.getItem('entreCopasLanguage') || 'es';
                    const name = (TRANSLATIONS[lang] && TRANSLATIONS[lang][`winery-${id}-name`]) || winery.name;
                    const desc = (TRANSLATIONS[lang] && TRANSLATIONS[lang][`winery-${id}-desc`]) || winery.description;
                    const label = (TRANSLATIONS[lang] && TRANSLATIONS[lang][`winery-${winery.category}-label`]) || winery.categoryLabel;
                    const reserveBtnText = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['winery-btn-reserve']) || 'Reservar';

                    const popupHTML = `
                        <div class="map-popup-content" style="font-family: var(--font-body); font-size: 14px; color: var(--on-background);">
                            <span class="label-caps" style="font-size: 10px; font-weight: 700; letter-spacing: 0.1em; display: block; color: var(--on-surface-variant); margin-bottom: 4px;">${label.toUpperCase()}</span>
                            <h4 style="margin: 0 0 6px 0; font-family: var(--font-title); font-size: 16px; font-weight: 700;">${name}</h4>
                            <p style="margin: 0 0 10px 0; font-size: 13px; line-height: 1.4; color: var(--on-surface-variant);">${desc}</p>
                            <a href="reservas.html?bodega=${id}" class="btn btn-ghost btn-sm" style="display: inline-block; padding: 6px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; border: 1px solid var(--on-background); color: var(--on-background); text-decoration: none; transition: all 0.2s;">${reserveBtnText}</a>
                        </div>
                    `;
                    marker.bindPopup(popupHTML).openPopup();
                });
            }
        }
    }
}
