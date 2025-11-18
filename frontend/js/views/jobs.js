// Jobs View - Complete Implementation with Export
import API from '../api.js';
import Modal from '../components/modal.js';
import notify from '../components/notification.js';
import exportModule from '../export.js';
import { Icons } from '../icons.js';

export async function renderJobsView() {
    try {
        const { jobs } = await API.getJobs();
        
        // Make export function global
        window.exportJobs = async () => {
            notify.info('Generating PDF...');
            await exportModule.exportJobsPDF(jobs);
            notify.success('PDF generated! Check your downloads.');
        };
        
        return `
            <div class="jobs-view">
                <div class="jobs-content">
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Project</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${renderJobRows(jobs || [])}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading jobs:', error);
        notify.error('Failed to load jobs: ' + error.message);
        return `
            <div class="card">
                <div class="card-body">
                    <h3 class="text-danger">Error loading jobs</h3>
                    <p class="text-secondary">${error.message}</p>
                </div>
            </div>
        `;
    }
}

function renderJobRows(jobs) {
    if (!jobs.length) {
        return `
            <tr>
                <td colspan="6" class="text-center">
                    <div style="padding: 40px;">
                        <h3 class="text-primary mb-md">No jobs yet</h3>
                        <p class="text-secondary">Create a job to start working with Claude!</p>
                    </div>
                </td>
            </tr>
        `;
    }
    
    return jobs.map(job => `
        <tr>
            <td><code>${job.id.substring(0, 8)}</code></td>
            <td><strong>${job.project?.name || 'Unknown'}</strong></td>
            <td><span class="badge badge-neutral">${job.type}</span></td>
            <td><span class="badge badge-${getJobStatusClass(job.status)} badge-dot">${job.status}</span></td>
            <td class="text-muted">${formatDate(job.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-ghost" onclick="viewJob('${job.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

function getJobStatusClass(status) {
    const statusMap = {
        success: 'success',
        running: 'info',
        pending: 'warning',
        failed: 'danger',
        cancelled: 'neutral'
    };
    return statusMap[status] || 'neutral';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

export const jobsStyles = `
<style>
.jobs-view {
    padding: 0;
    width: 100%;
}

.jobs-content {
    width: 100%;
}


.view-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.01em;
    line-height: 1.3;
}

.table-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(138, 253, 129, 0.05);
    transition: all var(--duration-normal) var(--ease-in-out);
}

.table-container:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(138, 253, 129, 0.1);
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table thead {
    background: var(--bg-tertiary);
}

.table th {
    padding: var(--spacing-md);
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
}

.table td {
    padding: var(--spacing-md);
    border-top: 1px solid var(--border-color);
    color: var(--text-primary);
}

.table tbody tr {
    transition: background var(--transition-fast);
}

.table tbody tr:hover {
    background: rgba(138, 253, 129, 0.05);
    box-shadow: inset 0 0 0 1px rgba(138, 253, 129, 0.2);
}

.text-center {
    text-align: center;
}

.text-muted {
    color: var(--text-muted);
}

code {
    font-family: 'Courier New', monospace;
    background: rgba(138, 253, 129, 0.1);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    color: var(--accent-primary);
    text-shadow: 0 0 8px rgba(138, 253, 129, 0.2);
    border: 1px solid rgba(138, 253, 129, 0.2);
}

.badge-dot::before {
    content: '●';
    margin-right: 6px;
}

/* Responsive */
@media (max-width: 768px) {
    .table-container {
        overflow-x: auto;
    }
    
    .table {
        min-width: 600px;
    }
}
</style>
`;
