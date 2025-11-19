// Settings View - HEARST STYLE
import { Icons } from '../icons.js';

export async function renderSettingsView() {
    return `
        <div class="settings-view">
            <div class="settings-content">
                <!-- Zone de contenu dynamique pour chaque section -->
                <div id="settings-sections-container">
                    <!-- Le contenu sera injecté dynamiquement -->
                </div>
            </div>
        </div>
    `;
}

// Section titles mapping
export const settingsSectionTitles = {
    versions: { title: 'Versions', subtitle: 'Manage project versions' },
    prompts: { title: 'Prompts', subtitle: 'Manage AI prompts' },
    logs: { title: 'Logs', subtitle: 'View system logs' }
};

export const settingsStyles = `
    <style>
        /* Settings View Styles - HEARST Design System */
        /* Note: Les styles de navigation sont dans cockpit.css */

        .settings-view {
            padding: 0;
            width: 100%;
        }

        .settings-content {
            width: 100%;
        }
    </style>
`;
