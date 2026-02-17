// Système de toast global pour toute l'application
(function () {
    // S'assurer que window.ToastManager n'existe pas déjà
    if (window.ToastManager) {
        return;
    }

    class ToastManager {
        constructor() {
            this.toastContainer = this.getOrCreateContainer();
            this.initDjangoMessages();
        }

        // Créer ou récupérer le conteneur de toasts
        getOrCreateContainer() {
            let container = document.getElementById('toastContainer');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toastContainer';
                container.className = 'toast-container position-fixed top-0 end-0 p-3';
                container.style.zIndex = '1060';
                document.body.appendChild(container);
            }
            return container;
        }

        // Afficher un toast
        show(message, type = 'info') {
            // Mapping des types Bootstrap
            const typeMap = {
                'success': 'success',
                'error': 'danger',
                'danger': 'danger',
                'warning': 'warning',
                'info': 'info',
                'debug': 'secondary'
            };

            const bsType = typeMap[type] || 'info';

            // Mapping des icônes
            const iconMap = {
                'success': 'check-circle',
                'danger': 'exclamation-circle',
                'warning': 'exclamation-triangle',
                'info': 'info-circle',
                'secondary': 'bell'
            };

            const icon = iconMap[bsType] || 'info-circle';

            // Créer l'élément toast
            const toastEl = document.createElement('div');
            toastEl.className = `toast align-items-center text-white bg-${bsType} border-0`;
            toastEl.setAttribute('role', 'alert');
            toastEl.setAttribute('aria-live', 'assertive');
            toastEl.setAttribute('aria-atomic', 'true');

            toastEl.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body d-flex">
                        <i class="fas fa-${icon} me-2" style='font-size:35px; display:inline-block;'></i>
                        <p>${message}</p>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            `;

            // Ajouter au conteneur
            this.toastContainer.appendChild(toastEl);

            // Créer et afficher le toast Bootstrap
            const toast = new bootstrap.Toast(toastEl, {
                autohide: true,
                delay: 6000
            });
            toast.show();

            // Nettoyer après disparition
            toastEl.addEventListener('hidden.bs.toast', () => {
                toastEl.remove();
                // Optionnel: supprimer le conteneur s'il est vide
                if (this.toastContainer.children.length === 0) {
                    // On garde le conteneur mais on pourrait le supprimer
                    // document.body.removeChild(this.toastContainer);
                }
            });

            return toast;
        }

        // Raccourcis pour les différents types
        success(message) {
            return this.show(message, 'success');
        }

        error(message) {
            return this.show(message, 'error');
        }

        warning(message) {
            return this.show(message, 'warning');
        }

        info(message) {
            return this.show(message, 'info');
        }

        debug(message) {
            return this.show(message, 'debug');
        }

        // Initialiser les messages Django
        initDjangoMessages() {
            // Vérifier si des messages Django sont présents dans le DOM
            const djangoMessages = document.getElementById('django-messages');
            if (djangoMessages) {
                const messages = JSON.parse(djangoMessages.textContent);
                messages.forEach(msg => {
                    this.show(msg.message, msg.tags);
                });
                djangoMessages.remove();
            }
        }
    }

    // Créer une instance unique
    window.ToastManager = new ToastManager();

    // Pour la rétrocompatibilité, créer une fonction globale showToast
    window.showToast = function (message, type = 'info') {
        return window.ToastManager.show(message, type);
    };
})();