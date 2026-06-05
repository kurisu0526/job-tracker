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
  updatedAt: string;
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
}
