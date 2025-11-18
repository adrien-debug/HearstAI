// ===================================
// EXPORT.JS - PDF export system
// ===================================

/**
 * Export projects to PDF
 */
export async function exportProjectsPDF(projects) {
    // Create simple HTML for print
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HearstAI - Projects Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                h1 { color: #8afd81; border-bottom: 2px solid #8afd81; padding-bottom: 10px; }
                .project { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                .project h2 { margin: 0 0 10px 0; color: #333; }
                .meta { color: #666; font-size: 14px; }
                .badge { display: inline-block; padding: 4px 8px; background: #f0f0f0; border-radius: 4px; font-size: 12px; margin-right: 8px; }
            </style>
        </head>
        <body>
            <h1>HearstAI Projects Report</h1>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Projects:</strong> ${projects.length}</p>
            <hr>
            ${projects.map(p => `
                <div class="project">
                    <h2>${p.name}</h2>
                    <p>${p.description || 'No description'}</p>
                    <div class="meta">
                        <span class="badge">Type: ${p.type}</span>
                        <span class="badge">Repository: ${p.repo_type}</span>
                        <span class="badge">Status: ${p.status}</span>
                    </div>
                </div>
            `).join('')}
        </body>
        </html>
    `;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

/**
 * Export jobs to PDF
 */
export async function exportJobsPDF(jobs) {
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HearstAI - Jobs Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                h1 { color: #8afd81; border-bottom: 2px solid #8afd81; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #f5f5f5; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
                td { padding: 10px; border-bottom: 1px solid #eee; }
                .badge { display: inline-block; padding: 4px 8px; background: #f0f0f0; border-radius: 4px; font-size: 12px; }
                .success { background: #d4edda; color: #155724; }
                .error { background: #f8d7da; color: #721c24; }
                .pending { background: #fff3cd; color: #856404; }
            </style>
        </head>
        <body>
            <h1>HearstAI Jobs Report</h1>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Jobs:</strong> ${jobs.length}</p>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Project</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    ${jobs.map(j => `
                        <tr>
                            <td><code>${j.id.substring(0, 8)}</code></td>
                            <td>${j.project?.name || 'Unknown'}</td>
                            <td><span class="badge">${j.type}</span></td>
                            <td><span class="badge ${j.status}">${j.status}</span></td>
                            <td>${new Date(j.created_at).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

/**
 * Export dashboard stats to PDF
 */
export async function exportDashboardPDF(stats, projects, jobs) {
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>HearstAI - Dashboard Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                h1 { color: #8afd81; border-bottom: 2px solid #8afd81; padding-bottom: 10px; }
                .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
                .stat-card { padding: 20px; background: #f9f9f9; border-radius: 8px; text-align: center; }
                .stat-value { font-size: 36px; font-weight: bold; color: #8afd81; }
                .stat-label { font-size: 14px; color: #666; margin-top: 8px; }
                .section { margin: 40px 0; }
            </style>
        </head>
        <body>
            <h1>HearstAI Dashboard Report</h1>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-value">${stats?.total_projects || 0}</div>
                    <div class="stat-label">Total Projects</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats?.jobs_running || 0}</div>
                    <div class="stat-label">Jobs Running</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Math.round((stats?.jobs_success_rate || 0) * 100)}%</div>
                    <div class="stat-label">Success Rate</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats?.total_versions || 0}</div>
                    <div class="stat-label">Total Versions</div>
                </div>
            </div>

            <div class="section">
                <h2>Recent Activity Summary</h2>
                <p><strong>Active Projects:</strong> ${projects?.length || 0}</p>
                <p><strong>Completed Jobs:</strong> ${jobs?.filter(j => j.status === 'success').length || 0}</p>
                <p><strong>Failed Jobs:</strong> ${jobs?.filter(j => j.status === 'failed').length || 0}</p>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

export default {
    exportProjectsPDF,
    exportJobsPDF,
    exportDashboardPDF
};
