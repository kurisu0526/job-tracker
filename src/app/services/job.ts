import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { CreateJobDto, Job, JobListResponse, UpdateJobResponse } from '../models/job.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly baseUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  scrapeJob(url: string, source: string): Observable<CreateJobDto> {
    return this.http.post<CreateJobDto>(`${this.baseUrl}api/jobs/scrape`, { url, source });
  }

  getJobs(options?: {
      status?: string;
      limit?: number;
      lastKey?: string;
    }): Observable<JobListResponse> {
//       const jobResponse: JobListResponse = {
//     "jobs": [
//         {
//             "id": "3375af0c-c690-4bd9-afa4-80ca7aa1ff73",
//             "company": "Emapta Global",
//             "position": "Mid-Level Frontend Engineer | React & JavaScript",
//             "location": "Mandaluyong, National Capital Region, Philippines",
//             "status": "applied",
//             "salary": "₱100,000.00/mo - ₱140,000.00/mo",
//             "appliedDate": "2026-06-09",
//             "notes": "My notes are here",
//             "url": "https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/4411852687",
//             "tags": [
//                 "Mid-Senior level",
//                 "Full-time",
//                 "Information Technology",
//                 "IT Services and IT Consulting"
//             ],
//             "updatedAt": "2026-06-09T20:29:28.969Z"
//         }
//     ],
//     "nextPageToken": null
// };
//     return of(jobResponse).pipe(delay(1000));
    
    return this.http.get<JobListResponse>('${this.baseUrl}api/jobs/list', { params: { ...options } });
  }

  getJob(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}api/jobs/job/${id}`);
  }

  createJob(dto: CreateJobDto): Observable<Job> {
    return this.http.post<Job>(`${this.baseUrl}api/jobs/add`, dto);
  }

  updateJob(id: string, dto: Partial<CreateJobDto>): Observable<UpdateJobResponse> {
//     const jobResponse: UpdateJobResponse = {
//     "job": 
//         {
//             "id": "3375af0c-c690-4bd9-afa4-80ca7aa1ff73",
//             "company": "Emapta Global",
//             "position": "Mid-Level Frontend Engineer | React & JavaScript",
//             "location": "Mandaluyong, National Capital Region, Philippines",
//             "status": "applied",
//             "salary": "₱100,000.00/mo - ₱140,000.00/mo",
//             "appliedDate": "2026-06-09",
//             "notes": "My notes are here",
//             "url": "https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/4411852687",
//             "tags": [
//                 "Mid-Senior level",
//                 "Full-time",
//                 "Information Technology",
//                 "IT Services and IT Consulting"
//             ],
//             "updatedAt": "2026-06-09T20:29:28.969Z"
//         }
//     ,
//     "message": null
// };
//     return of(jobResponse).pipe(delay(1000));
    return this.http.patch<UpdateJobResponse>(`${this.baseUrl}api/jobs/update/${id}`, dto);
  }

  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}api/jobs/delete/${id}`);
  }
}

