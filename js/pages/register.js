import { TRANSLATIONS } from '../translations.js';

export function initRegister() {
    const registroForm = document.getElementById('registro-form');
    
    if (registroForm) {
        registroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message
            const msgEl = document.getElementById('registro-message');
            if (msgEl) {
                const lang = localStorage.getItem('entreCopasLanguage') || 'es';
                const msg = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['register-success-msg']) || '¡Cuenta creada con éxito! Redirigiendo al panel...';
                msgEl.textContent = msg;
                msgEl.className = 'form-message success';
                msgEl.classList.remove('hidden');
            }

            registroForm.reset();
            
            // Redirect to panel after 2 seconds
            setTimeout(() => {
                window.location.href = 'panel.html';
            }, 2000);
        });
    }
}
