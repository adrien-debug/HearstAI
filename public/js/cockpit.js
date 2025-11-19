// Cockpit Initialization
// Gère l'horloge et les interactions du cockpit

export function initCockpit() {
    // Update clock
    function updateClock() {
        const clockElement = document.getElementById('cockpitClock');
        if (clockElement) {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // Time filter buttons
    const timeFilterButtons = document.querySelectorAll('.time-filter-btn');
    timeFilterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.parentElement;
            if (parent) {
                parent.querySelectorAll('.time-filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Refresh button
    const refreshBtn = document.querySelector('.cockpit-refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // TODO: Implémenter le refresh des données
            console.log('Refresh cockpit data');
        });
    }

    // Cleanup function
    return () => {
        clearInterval(clockInterval);
    };
}


