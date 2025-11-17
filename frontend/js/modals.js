// Modal Functions for Projects and Jobs
import Modal from './components/modal.js';
import API from './api.js';
import notify from './components/notification.js';

// CREATE PROJECT MODAL
export function showCreateProjectModal() {
    const modal = new Modal({
        title: 'Create New Project',
        size: 'medium',
        content: `
            <form id="create-project-form" class="form">
                <div class="form-group">
                    <label for="project-name">Project Name *</label>
                    <input 
                        type="text" 
                        id="project-name" 
                        name="name" 
                        class="form-input" 
                        placeholder="my-awesome-project"
                        required
                    >
                </div>
                
                <div class="form-group">
                    <label for="project-description">Description</label>
                    <textarea 
                        id="project-description" 
                        name="description" 
                        class="form-input" 
                        rows="3"
                        placeholder="Brief description of your project"
                    ></textarea>
                </div>
                
                <div class="form-group">
                    <label for="project-repo">Repository URL</label>
                    <input 
                        type="url" 
                        id="project-repo" 
                        name="repository_url" 
                        class="form-input" 
                        placeholder="https://github.com/user/repo"
                    >
                </div>
            </form>
        `,
        confirmText: 'Create Project',
        onConfirm: async () => {
            const form = document.getElementById('create-project-form');
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            if (!data.name || data.name.trim() === '') {
                notify.error('Project name is required');
                return false;
            }
            
            try {
                await API.createProject(data);
                notify.success('Project created successfully!');
                setTimeout(() => window.location.reload(), 1000);
                return true;
            } catch (error) {
                notify.error('Failed to create project: ' + error.message);
                return false;
            }
        }
    });
    
    modal.open();
}

// CREATE JOB MODAL
export function showCreateJobModal(projectId = null) {
    const modal = new Modal({
        title: 'Create New Job',
        size: 'medium',
        content: `
            <form id="create-job-form" class="form">
                ${projectId ? `<input type="hidden" name="project_id" value="${projectId}">` : `
                <div class="form-group">
                    <label for="job-project">Project *</label>
                    <select id="job-project" name="project_id" class="form-input" required>
                        <option value="">Select a project...</option>
                    </select>
                </div>
                `}
                
                <div class="form-group">
                    <label for="job-type">Job Type *</label>
                    <select id="job-type" name="job_type" class="form-input" required>
                        <option value="">Select type...</option>
                        <option value="build">Build</option>
                        <option value="test">Test</option>
                        <option value="deploy">Deploy</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="job-prompt">Prompt/Command *</label>
                    <textarea 
                        id="job-prompt" 
                        name="prompt" 
                        class="form-input" 
                        rows="4"
                        placeholder="Enter the command or prompt for this job..."
                        required
                    ></textarea>
                </div>
            </form>
        `,
        confirmText: 'Create Job',
        onConfirm: async () => {
            const form = document.getElementById('create-job-form');
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            if (!data.project_id) {
                notify.error('Please select a project');
                return false;
            }
            
            if (!data.job_type) {
                notify.error('Please select a job type');
                return false;
            }
            
            if (!data.prompt || data.prompt.trim() === '') {
                notify.error('Prompt is required');
                return false;
            }
            
            try {
                await API.createJob(data);
                notify.success('Job created successfully!');
                setTimeout(() => window.location.reload(), 1000);
                return true;
            } catch (error) {
                notify.error('Failed to create job: ' + error.message);
                return false;
            }
        }
    });
    
    if (!projectId) {
        API.getProjects().then(response => {
            const select = document.getElementById('job-project');
            if (select && response.projects) {
                response.projects.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project.id;
                    option.textContent = project.name;
                    select.appendChild(option);
                });
            }
        }).catch(error => console.error('Failed to load projects:', error));
    }
    
    modal.open();
}

if (typeof window !== 'undefined') {
    window.showCreateProjectModal = showCreateProjectModal;
    window.showCreateJobModal = showCreateJobModal;
}
