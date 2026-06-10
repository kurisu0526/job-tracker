export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  status: JobStatus;
  salary?: string;
  appliedDate: string;
  notes?: string;
  url?: string;
  tags?: string[];
  updatedAt: string;
}


export interface JobListResponse {
  jobs: Job[];
  nextPageToken?: string | null;
}

export interface UpdateJobResponse {
  job: Job;
  message?: string | null;
}

export interface CreateJobDto {
  company: string;
  position: string;
  location: string;
  status: JobStatus;
  salary?: string;
  appliedDate: string;
  notes?: string;
  url?: string;
  tags?: string[];
}
