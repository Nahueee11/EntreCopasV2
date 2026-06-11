import { API_BASE_URL } from '../config.js';
import { TRANSLATIONS } from '../translations.js';

export function initPartner() {
    const partnerForm = document.getElementById('partner-form');
    
    if (partnerForm) {
        partnerForm.addEventListener('submit', enviarPropuestaBodega);

        async function enviarPropuestaBodega(e) {
            e.preventDefault();

            const formData = new FormData(partnerForm);
            const payload = {
                nombreBodega: formData.get('nombreBodega'),
                nombreContacto: formData.get('nombreContacto'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                region: formData.get('region'),
                mensaje: formData.get('mensaje')
            };

            const msgEl = document.getElementById('partner-form-message');

            function showPartnerMessage(message, type) {
                if (!msgEl) return;
                msgEl.textContent = message;
                msgEl.className = `form-message ${type}`; // 'success' or 'error'
                msgEl.classList.remove('hidden');
            }

            try {
                const resp = await fetch(`${API_BASE_URL}/bodegas`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const lang = localStorage.getItem('entreCopasLanguage') || 'es';
                if (resp.ok) {
                    const successMsg = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['partner-success-msg']) || '¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.';
                    showPartnerMessage(successMsg, 'success');
                    partnerForm.reset();
                } else {
                    let respBody = null;
                    try { respBody = await resp.json(); } catch (err) {}
                    const defaultError = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['partner-error-msg']) || 'Error al enviar la solicitud. Intente de nuevo.';
                    const errorMsg = (respBody && respBody.message) ? respBody.message : defaultError;
                    showPartnerMessage(errorMsg, 'error');
                }
            } catch (networkErr) {
                console.error('Error de red al enviar solicitud de bodega:', networkErr);
                
                // Fallback for demonstration/offline purposes:
                let partnerRequests = JSON.parse(localStorage.getItem('entreCopasPartnerRequests') || '[]');
                partnerRequests.push({
                    id: Date.now().toString(36),
                    ...payload,
                    fechaSolicitud: new Date().toISOString()
                });
                localStorage.setItem('entreCopasPartnerRequests', JSON.stringify(partnerRequests));

                const lang = localStorage.getItem('entreCopasLanguage') || 'es';
                const localSuccessMsg = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['partner-local-success-msg']) || '¡Solicitud registrada localmente! Nos contactaremos pronto.';
                showPartnerMessage(localSuccessMsg, 'success');
                partnerForm.reset();
            }
        }
    }
}
