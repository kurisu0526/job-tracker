import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateJobDto, Job } from '../models/job.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly baseUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.baseUrl);
  }

  getJob(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/${id}`);
  }

  createJob(dto: CreateJobDto): Observable<Job> {
    return this.http.post<Job>(this.baseUrl, dto);
  }

  updateJob(id: string, dto: Partial<CreateJobDto>): Observable<Job> {
    return this.http.patch<Job>(`${this.baseUrl}/${id}`, dto);
  }

  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

