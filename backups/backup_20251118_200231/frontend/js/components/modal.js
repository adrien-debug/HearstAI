// Modal Component - Reusable modal system
// HEARST styled modals
import { Icons } from '../icons.js';

class Modal {
    constructor(options = {}) {
        this.id = options.id || `modal-${Date.now()}`;
        this.title = options.title || 'Modal';
        this.content = options.content || '';
        this.size = options.size || 'medium'; // small, medium, large
        this.onConfirm = options.onConfirm || null;
        this.onCancel = options.onCancel || null;
        this.confirmText = options.confirmText || 'Confirm';
        this.cancelText = options.cancelText || 'Cancel';
        this.showFooter = options.showFooter !== false;
        
        this.element = null;
        this.isOpen = false;
    }

    /**
     * Create modal HTML structure
     */
    create() {
        const modalHTML = `
            <div class="modal-overlay" id="${this.id}" data-modal>
                <div class="modal modal-${this.size}">
                    <div class="modal-header">
                        <h3 class="modal-title">${this.title}</h3>
                        <button class="modal-close" data-modal-close>×</button>
                    </div>
                    <div class="modal-body">
                        ${this.content}
                    </div>
                    ${this.showFooter ? `
                        <div class="modal-footer">
                            <button class="btn btn-secondary" data-modal-cancel>${this.cancelText}</button>
                            <button class="btn btn-primary" data-modal-confirm>${this.confirmText}</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Add to modal container
        const container = document.getElementById('modal-container');
        container.insertAdjacentHTML('beforeend', modalHTML);

        this.element = document.getElementById(this.id);
        this.attachEventListeners();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Close button
        const closeBtn = this.element.querySelector('[data-modal-close]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Cancel button
        const cancelBtn = this.element.querySelector('[data-modal-cancel]');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (this.onCancel) this.onCancel();
                this.close();
            });
        }

        // Confirm button
        const confirmBtn = this.element.querySelector('[data-modal-confirm]');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async () => {
                if (this.onConfirm) {
                    // Désactiver le bouton pour éviter les clics multiples
                    confirmBtn.disabled = true;
                    try {
                        const result = await this.onConfirm();
                        // Si onConfirm retourne true ou undefined, fermer le modal
                        if (result !== false) {
                            this.close();
                        } else {
                            // Réactiver le bouton si la validation échoue
                            confirmBtn.disabled = false;
                        }
                    } catch (error) {
                        console.error('Error in onConfirm:', error);
                        // Réactiver le bouton en cas d'erreur
                        confirmBtn.disabled = false;
                    }
                } else {
                    this.close();
                }
            });
        }

        // Click outside to close
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.close();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * Open modal
     */
    open() {
        if (!this.element) {
            this.create();
        }
        this.element.style.display = 'flex';
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close modal
     */
    close() {
        if (this.element) {
            this.element.style.display = 'none';
            this.isOpen = false;
            document.body.style.overflow = '';
            // Réactiver le bouton confirm au cas où
            const confirmBtn = this.element.querySelector('[data-modal-confirm]');
            if (confirmBtn) {
                confirmBtn.disabled = false;
            }
            // Détruire le modal après un court délai pour permettre les animations
            setTimeout(() => {
                if (this.element && !this.isOpen) {
                    this.destroy();
                }
            }, 300);
        }
    }

    /**
     * Destroy modal
     */
    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
            this.isOpen = false;
            document.body.style.overflow = '';
        }
    }

    /**
     * Update modal content
     */
    setContent(content) {
        if (this.element) {
            const body = this.element.querySelector('.modal-body');
            body.innerHTML = content;
        }
    }

    /**
     * Get form data from modal
     */
    getFormData() {
        if (!this.element) return null;
        
        const form = this.element.querySelector('form');
        if (!form) return null;

        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    /**
     * Show loading state
     */
    setLoading(loading = true) {
        const confirmBtn = this.element?.querySelector('[data-modal-confirm]');
        if (confirmBtn) {
            confirmBtn.disabled = loading;
            confirmBtn.textContent = loading ? 'Loading...' : this.confirmText;
        }
    }

    /**
     * Show error in modal
     */
    showError(message) {
        const body = this.element?.querySelector('.modal-body');
        if (body) {
            const existingError = body.querySelector('.alert-danger');
            if (existingError) existingError.remove();
            
            body.insertAdjacentHTML('afterbegin', `
                <div class="alert alert-danger">
                    <span class="icon-inline">${Icons.error}</span> ${message}
                </div>
            `);
        }
    }
}

// Quick modal helpers
Modal.alert = (title, message) => {
    const modal = new Modal({
        title,
        content: `<p class="text-secondary">${message}</p>`,
        confirmText: 'OK',
        showFooter: true,
        onConfirm: () => modal.destroy()
    });
    modal.open();
    return modal;
};

Modal.confirm = (title, message, onConfirm) => {
    const modal = new Modal({
        title,
        content: `<p class="text-secondary">${message}</p>`,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: () => {
            if (onConfirm) onConfirm();
            modal.destroy();
        },
        onCancel: () => modal.destroy()
    });
    modal.open();
    return modal;
};

export default Modal;
