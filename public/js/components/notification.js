// ===================================
// NOTIFICATION.JS - Système de toast
// ===================================
import { Icons } from '../icons.js';

class Notification {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.init();
    }

    init() {
        // Créer le conteneur de notifications
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    /**
     * Afficher une notification
     */
    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getIcon(type);
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close">×</button>
        `;

        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Animation d'entrée
        setTimeout(() => notification.classList.add('notification-show'), 10);

        // Bouton fermer
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hide(notification));

        // Auto-hide après duration
        if (duration > 0) {
            setTimeout(() => this.hide(notification), duration);
        }

        return notification;
    }

    /**
     * Cacher une notification
     */
    hide(notification) {
        notification.classList.remove('notification-show');
        notification.classList.add('notification-hide');

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    /**
     * Obtenir l'icône selon le type
     */
    getIcon(type) {
        const icons = {
            success: Icons.check,
            error: Icons.error,
            warning: Icons.warning,
            info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
        };
        return icons[type] || icons.info;
    }

    /**
     * Raccourcis pour types courants
     */
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 6000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }

    /**
     * Notification de chargement
     */
    loading(message) {
        const notification = this.show(message, 'info', 0);
        notification.classList.add('notification-loading');
        
        const icon = notification.querySelector('.notification-icon');
        icon.innerHTML = '<div class="spinner-small"></div>';
        
        return notification;
    }

    /**
     * Mettre à jour une notification existante
     */
    update(notification, message, type = 'success', duration = 4000) {
        notification.querySelector('.notification-message').textContent = message;
        notification.className = `notification notification-${type} notification-show`;
        notification.querySelector('.notification-icon').innerHTML = this.getIcon(type);
        
        // Retirer le spinner si présent
        notification.classList.remove('notification-loading');

        if (duration > 0) {
            setTimeout(() => this.hide(notification), duration);
        }
    }

    /**
     * Nettoyer toutes les notifications
     */
    clearAll() {
        this.notifications.forEach(notification => this.hide(notification));
    }
}

// Styles CSS pour les notifications
const notificationStyles = `
<style>
.notification-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 400px;
}

.notification {
    background: #1A1A1A;
    border: 1px solid rgba(197, 255, 167, 0.08);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transform: translateX(calc(100% + 24px));
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    min-width: 300px;
}

.notification-show {
    transform: translateX(0);
    opacity: 1;
}

.notification-hide {
    transform: translateX(calc(100% + 24px));
    opacity: 0;
}

.notification-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    flex-shrink: 0;
}

.notification-message {
    flex: 1;
    color: var(--text-primary);
    font-size: 14px;
    line-height: 1.5;
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--transition-fast);
    flex-shrink: 0;
}

.notification-close:hover {
    color: var(--text-primary);
}

.notification-success {
    border-left: 4px solid var(--accent-success);
}

.notification-success .notification-icon {
    color: var(--accent-success);
}

.notification-error {
    border-left: 4px solid var(--accent-danger);
}

.notification-error .notification-icon {
    color: var(--accent-danger);
}

.notification-warning {
    border-left: 4px solid var(--accent-warning);
}

.notification-warning .notification-icon {
    color: var(--accent-warning);
}

.notification-info {
    border-left: 4px solid var(--accent-info);
}

.notification-info .notification-icon {
    color: var(--accent-info);
}

.notification-loading .notification-icon {
    color: var(--accent-primary);
}

.spinner-small {
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-color);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .notification-container {
        right: 16px;
        bottom: 16px;
        max-width: calc(100vw - 32px);
    }
    
    .notification {
        min-width: auto;
    }
}
</style>
`;

// Injecter les styles
document.head.insertAdjacentHTML('beforeend', notificationStyles);

// Export singleton
const notify = new Notification();
export default notify;
