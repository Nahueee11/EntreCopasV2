import { API_BASE_URL } from '../config.js';
import { TRANSLATIONS } from '../translations.js';

export function initReservations() {
    const reservationForm = document.getElementById('reservation-form');

    function showFormMessage(message, type) {
        const msgEl = document.getElementById('form-message');
        if (!msgEl) return;
        msgEl.textContent = message;
        msgEl.className = `form-message ${type}`; // 'success' or 'error'
        msgEl.classList.remove('hidden');
    }

    if (reservationForm) {
        reservationForm.addEventListener('submit', enviarReserva);

        async function enviarReserva(e) {
            e.preventDefault();

            const formData = new FormData(reservationForm);

            // Build payload matching backend field names
            const payload = {
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                bodega: formData.get('bodega'),
                fecha: formData.get('fecha'),
                hora: formData.get('hora'),
                invitados: parseInt(formData.get('invitados'), 10)
            };

            try {
                const resp = await fetch(`${API_BASE_URL}/reservas`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                // Try to parse JSON response (if any)
                let respBody = null;
                try { respBody = await resp.json(); } catch (err) { /* no JSON body */ }

                if (resp.ok) {
                    console.log('Reserva enviada correctamente:', respBody || resp.status);

                    // Keep a local copy for the panel view (dashboard)
                    const localRes = {
                        id: respBody && respBody.id ? respBody.id : Date.now().toString(36),
                        nombre: payload.nombre,
                        email: payload.email,
                        bodega: payload.bodega,
                        fecha: payload.fecha,
                        hora: payload.hora,
                        invitados: payload.invitados,
                        status: (respBody && respBody.status) ? respBody.status : 'Pendiente'
                    };

                    let reservations = JSON.parse(localStorage.getItem('entreCopasReservations') || '[]');
                    reservations.push(localRes);
                    localStorage.setItem('entreCopasReservations', JSON.stringify(reservations));

                    const lang = localStorage.getItem('entreCopasLanguage') || 'es';
                    const successMsg = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['res-success-msg']) || '¡Solicitud enviada! Le confirmaremos por correo.';
                    showFormMessage(successMsg, 'success');

                    reservationForm.reset();

                    setTimeout(() => { window.location.href = 'panel.html'; }, 2000);
                } else {
                    // Server returned validation errors or other failure
                    console.error('Error del servidor al crear la reserva:', resp.status, respBody);
                    const lang = localStorage.getItem('entreCopasLanguage') || 'es';
                    const defaultError = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['res-error-msg']) || 'Error al enviar la reserva. Intente de nuevo.';
                    const errorMessage = (respBody && respBody.message) ? respBody.message : defaultError;
                    showFormMessage(errorMessage, 'error');
                }
            } catch (networkErr) {
                console.error('Error de red al enviar la reserva:', networkErr);
                const lang = localStorage.getItem('entreCopasLanguage') || 'es';
                const connErrorMsg = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['network-error-msg']) || 'No se pudo conectar con el servidor. Revise su conexión e intente más tarde.';
                showFormMessage(connErrorMsg, 'error');
            }
        }
    }
}
