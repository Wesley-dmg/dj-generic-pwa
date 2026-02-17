// Configuration PWA
class PWAManager {
    constructor() {
        this.config = window.PWA_CONFIG || {};
        this.init();
    }

    init() {
        this.detectNetworkStatus();
        this.requestNotificationPermission();
        this.addToHomeScreenPrompt();
    }

    // Détection du statut réseau
    detectNetworkStatus() {
        window.addEventListener('online', () => {
            this.showToast('Vous êtes de nouveau en ligne');
            document.body.classList.remove('offline');
        });

        window.addEventListener('offline', () => {
            this.showToast('Vous êtes hors ligne');
            document.body.classList.add('offline');
        });

        // Vérifier l'état initial
        if (!navigator.onLine) {
            document.body.classList.add('offline');
        }
    }

    // Demander la permission de notification
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('Permission de notification:', permission);
            });
        }
    }

    // Gestion de l'installation
    addToHomeScreenPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.deferredPrompt = e; // On le stocke globalement pour y accéder partout

            // Afficher un bouton d'installation
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            console.log('Application installée');
            deferredPrompt = null;
        });
    }

    showInstallButton() {
        // Créer un bouton d'installation
        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.innerHTML = '📱 Installer l\'app';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #3f4d67;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 20px;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        installBtn.onclick = () => this.installApp();
        document.body.appendChild(installBtn);
    }

    installApp() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Utilisateur a accepté l\'installation');
                } else {
                    console.log('Utilisateur a refusé l\'installation');
                }
                window.deferredPrompt = null;
            });
        }
    }

    // Dans votre classe PWA
    showToast(message) {
        // Utiliser le ToastManager global s'il existe
        if (window.ToastManager) {
            ToastManager.info(message);
        } else {
            // Fallback si ToastManager n'est pas chargé
            console.log('Toast:', message);
        }
    }

    // Synchronisation en arrière-plan
    registerBackgroundSync() {
        if ('sync' in registration) {
            registration.sync.register('sync-data')
                .then(() => console.log('Sync enregistré'))
                .catch(err => console.log('Erreur sync:', err));
        }
    }
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
});