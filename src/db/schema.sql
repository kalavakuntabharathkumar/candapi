CREATE TABLE IF NOT EXISTS candidates (
 id BIGSERIAL PRIMARY KEY, full_name VARCHAR(160) NOT NULL, email VARCHAR(254) NOT NULL UNIQUE,
 phone VARCHAR(40), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS jobs (
 id BIGSERIAL PRIMARY KEY, title VARCHAR(180) NOT NULL, department VARCHAR(120), location VARCHAR(120),
 employment_type VARCHAR(40) NOT NULL DEFAULT 'full-time', status VARCHAR(20) NOT NULL DEFAULT 'open',
 description TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS applications (
 id BIGSERIAL PRIMARY KEY, candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
 job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE, status VARCHAR(30) NOT NULL DEFAULT 'submitted',
 source VARCHAR(80) NOT NULL DEFAULT 'portal', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(candidate_id, job_id)
);
CREATE TABLE IF NOT EXISTS resumes (
 id BIGSERIAL PRIMARY KEY, candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
 object_key TEXT NOT NULL, mime_type VARCHAR(120) NOT NULL DEFAULT 'application/pdf', status VARCHAR(30) NOT NULL DEFAULT 'queued',
 parsed_data JSONB NOT NULL DEFAULT '{}'::jsonb, error_message TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS application_events (
 id BIGSERIAL PRIMARY KEY, application_id BIGINT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
 event_type VARCHAR(80) NOT NULL, payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS audit_log (
 id BIGSERIAL PRIMARY KEY, actor VARCHAR(120) NOT NULL DEFAULT 'system', action VARCHAR(120) NOT NULL,
 resource_type VARCHAR(80) NOT NULL, resource_id BIGINT, metadata JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS resume_jobs (
 id BIGSERIAL PRIMARY KEY, resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
 queue_job_id VARCHAR(120), state VARCHAR(30) NOT NULL DEFAULT 'queued', attempts INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), completed_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS candidate_skills (
 candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE, skill VARCHAR(80) NOT NULL,
 proficiency VARCHAR(30), PRIMARY KEY(candidate_id, skill)
);
CREATE TABLE IF NOT EXISTS job_skills (
 job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE, skill VARCHAR(80) NOT NULL,
 required BOOLEAN NOT NULL DEFAULT TRUE, PRIMARY KEY(job_id, skill)
);
CREATE TABLE IF NOT EXISTS saved_jobs (
 candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE, job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(candidate_id, job_id)
);
CREATE INDEX IF NOT EXISTS idx_jobs_status_created ON jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_job_status ON applications(job_id, status);
CREATE INDEX IF NOT EXISTS idx_resumes_candidate ON resumes(candidate_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_application ON application_events(application_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
