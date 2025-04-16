import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3030'; // Base URL of your API
  // private baseUrl = 'https://dex-avn-be.vercel.app'; // Base URL of your API

  constructor(private http: HttpClient) { }

  // Generic GET method
  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

  // Generic POST method
  createData(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  }

  // Generic PUT method
  updateData(endpoint: string, id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${endpoint}/${id}`, data);
  }

  // Generic DELETE method
  deleteData(endpoint: string, id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}/${id}`);
  }

  getDropDown(endpoint: string, data?: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`, data);
  }

  updateDropdown(endpoint: string, data?: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${endpoint}`, data);
  }
}
