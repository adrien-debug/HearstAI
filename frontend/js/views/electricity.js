// Electricity View - HEARST Mining Dashboard
import { Icons } from '../icons.js';

export async function renderElectricityView() {
    return `
        <div class="electricity-view">
            <div class="electricity-content">
                <!-- Zone de contenu dynamique pour chaque section -->
                <div id="electricity-sections-container">
                    <!-- Le contenu sera injecté dynamiquement -->
                </div>
            </div>
        </div>
    `;
}

// Section titles mapping
export const electricitySectionTitles = {
    home: { title: 'Home', subtitle: 'Dashboard overview' },
    mining: { title: 'Mining', subtitle: 'Mining operations' },
    electricity: { title: 'Electricity', subtitle: 'Provider summary' },
    contracts: { title: 'Contracts', subtitle: 'Contracts management' },
    analytics: { title: 'Analytics', subtitle: 'Analytics dashboard' }
};

// Styles moved to frontend/css/electricity.css
// No longer injecting <style> blocks - all styles are now in global CSS
export const electricityStyles = '';





