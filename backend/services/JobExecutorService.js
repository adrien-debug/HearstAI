const Job = require('../models/Job');

class JobExecutorService {
    constructor() { this.runningJobs = new Map(); }

    async executeJobAsync(jobId) {
        setImmediate(() => {
            this.executeJob(jobId).catch(error => {
                console.error('Job ' + jobId + ' execution failed:', error);
                Job.updateStatus(jobId, 'failed', { error: error.message });
            });
        });
    }

    async executeJob(jobId) {
        try {
            const job = Job.getById(jobId);
            if (!job) throw new Error('Job not found');
            Job.updateStatus(jobId, 'running');
            Job.addLog(jobId, 'info', 'Job execution started');
            this.runningJobs.set(jobId, { status: 'running', startedAt: Date.now() });
            await this.processJob(job);
            Job.updateStatus(jobId, 'success', { message: 'Job completed successfully', processed_at: new Date().toISOString() });
            Job.addLog(jobId, 'info', 'Job execution completed successfully');
            this.runningJobs.delete(jobId);
        } catch (error) {
            console.error('Error executing job ' + jobId + ':', error);
            Job.updateStatus(jobId, 'failed', { error: error.message });
            Job.addLog(jobId, 'error', 'Job execution failed: ' + error.message);
            this.runningJobs.delete(jobId);
            throw error;
        }
    }

    async processJob(job) {
        Job.addLog(job.id, 'info', 'Processing ' + job.type + ' job');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const actions = {
            debug: 'Analyzing code for bugs',
            patch: 'Generating patch',
            refactor: 'Refactoring code',
            generate: 'Generating new code',
            review: 'Reviewing code quality'
        };
        if (actions[job.type]) {
            Job.addLog(job.id, 'info', actions[job.type] + '...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            Job.addLog(job.id, 'info', actions[job.type] + ' complete');
        }
    }

    getRunningJobs() {
        return Array.from(this.runningJobs.entries()).map(([id, data]) => ({ id, ...data }));
    }

    isJobRunning(jobId) { return this.runningJobs.has(jobId); }
}

const jobExecutor = new JobExecutorService();
module.exports = jobExecutor;
