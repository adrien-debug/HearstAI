-- Claude CI/CD Cockpit Database Schema
-- SQLite3

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK(type IN ('html_static', 'spa', 'dashboard', 'nodejs_app', 'other')),
    repo_type TEXT NOT NULL CHECK(repo_type IN ('local', 'github')),
    repo_url TEXT,
    repo_branch TEXT DEFAULT 'main',
    local_path TEXT,
    active_prompt_profile_id TEXT,
    stable_version_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'archived')),
    metadata TEXT DEFAULT '{}',
    FOREIGN KEY (active_prompt_profile_id) REFERENCES prompt_profiles(id),
    FOREIGN KEY (stable_version_id) REFERENCES versions(id)
);

-- ============================================
-- VERSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS versions (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    parent_version_id TEXT,
    is_stable INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_job_id TEXT,
    file_count INTEGER DEFAULT 0,
    total_size_bytes INTEGER DEFAULT 0,
    metadata TEXT DEFAULT '{}',
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_version_id) REFERENCES versions(id),
    FOREIGN KEY (created_by_job_id) REFERENCES jobs(id),
    UNIQUE(project_id, label)
);

-- ============================================
-- FILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    version_id TEXT NOT NULL,
    path TEXT NOT NULL,
    filename TEXT NOT NULL,
    extension TEXT,
    size_bytes INTEGER NOT NULL,
    content_hash TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    metadata TEXT DEFAULT '{}',
    FOREIGN KEY (version_id) REFERENCES versions(id) ON DELETE CASCADE,
    UNIQUE(version_id, path)
);

-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('debug', 'patch', 'refactor', 'generate', 'review')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'success', 'failed', 'cancelled')),
    prompt_profile_id TEXT,
    input_prompt TEXT NOT NULL,
    context_data TEXT DEFAULT '{}',
    output_summary TEXT,
    output_version_id TEXT,
    started_at TEXT,
    completed_at TEXT,
    duration_seconds INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    error_message TEXT,
    metadata TEXT DEFAULT '{}',
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (prompt_profile_id) REFERENCES prompt_profiles(id),
    FOREIGN KEY (output_version_id) REFERENCES versions(id)
);

-- ============================================
-- PROMPT PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS prompt_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    type TEXT NOT NULL CHECK(type IN ('system', 'debugging', 'atomic_task', 'custom')),
    system_prompt TEXT NOT NULL,
    rules TEXT,
    examples TEXT,
    is_default INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    usage_count INTEGER DEFAULT 0,
    metadata TEXT DEFAULT '{}'
);

-- ============================================
-- LOG ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS log_entries (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    level TEXT NOT NULL CHECK(level IN ('info', 'warning', 'error', 'success')),
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    metadata TEXT DEFAULT '{}',
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ============================================
-- BUSINESS DEV CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS business_dev_contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('active', 'pending', 'inactive')),
    estimated_value TEXT,
    last_contact TEXT NOT NULL DEFAULT (datetime('now')),
    notes TEXT,
    user_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_versions_project_id ON versions(project_id);
CREATE INDEX IF NOT EXISTS idx_versions_is_stable ON versions(is_stable);
CREATE INDEX IF NOT EXISTS idx_files_version_id ON files(version_id);
CREATE INDEX IF NOT EXISTS idx_jobs_project_id ON jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_log_entries_job_id ON log_entries(job_id);
CREATE INDEX IF NOT EXISTS idx_log_entries_timestamp ON log_entries(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_business_dev_contacts_status ON business_dev_contacts(status);
CREATE INDEX IF NOT EXISTS idx_business_dev_contacts_email ON business_dev_contacts(email);
CREATE INDEX IF NOT EXISTS idx_business_dev_contacts_company ON business_dev_contacts(company);
CREATE INDEX IF NOT EXISTS idx_business_dev_contacts_created_at ON business_dev_contacts(created_at);

-- ============================================
-- INSERT DEFAULT PROMPT PROFILES
-- ============================================
INSERT OR IGNORE INTO prompt_profiles (id, name, type, system_prompt, rules, is_default) VALUES
(
    'default-system',
    'Code Protégé Standard',
    'system',
    'Tu es un assistant développeur expert. Tu dois suivre ces principes : Code protégé, Zero casse, Zero doublon.',
    '1. Ne jamais casser le code existant
2. Ne jamais dupliquer du code
3. Toujours commenter les parties importantes
4. Utiliser des noms de variables clairs
5. Privilégier la simplicité',
    1
),
(
    'debug-standard',
    'Debug Standard',
    'debugging',
    'Tu es un expert en debugging. Analyse le code et trouve les bugs de manière méthodique.',
    '1. Identifier précisément le bug
2. Expliquer la cause racine
3. Proposer une solution minimale
4. Tester mentalement la solution
5. Ne rien casser d''autre',
    0
);
