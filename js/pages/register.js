import { TRANSLATIONS } from '../translations.js';
import { API_BASE_URL } from '../config.js';

export function initRegister() {
    const registroForm = document.getElementById('registro-form');
    
    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const email = document.getElementById('email_reg').value;
            const contrasena = document.getElementById('password').value;
            const lang = localStorage.getItem('entreCopasLanguage') || 'es';
            const msgEl = document.getElementById('registro-message');

            try {
                const response = await fetch(`${API_BASE_URL}/usuarios`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, apellido, email, contrasena })
                });

                const data = await response.json();

                if (response.ok) {
                    // Guardar usuario en localStorage
                    localStorage.setItem('entreCopasUser', JSON.stringify(data));

                    const msg = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['register-success-msg']) || '¡Cuenta creada con éxito! Redirigiendo al inicio...';
                    msgEl.textContent = msg;
                    msgEl.className = 'form-message success';
                    msgEl.classList.remove('hidden');

                    registroForm.reset();
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 2000);
                } else {
                    msgEl.textContent = data.error || 'Error al crear la cuenta.';
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
}