import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Adres Twojego backendu (Flask) – upewnij się, że port się zgadza
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Metoda, która wysyła dane pacjenta metodą POST do endpointu /save_patient
  savePatient(patientData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/save_patient`, patientData);
  }
}
