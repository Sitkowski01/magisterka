import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TriageService {
  analyzeSymptoms(symptoms: any): string {
    // Logika analizy objawów i zwracania wyniku triage
    return 'Czerwony – Stan Krytyczny';
  }
}
