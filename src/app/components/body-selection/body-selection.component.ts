import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

/** Struktura definicji choroby z bazy. */
interface DiseaseInfo {
  icd_code: string;
  nazwa: string;
  objawy: string[];
}

/** Słownik z gotowymi fragmentami tekstu dla każdego koloru triage. */
const TRIAGE_GUIDE: Record<string, string> = {
  "Czerwony": `Twój stan wymaga natychmiastowej pomocy medycznej. Zadzwoń pod numer 112!`,
  "Pomarańczowy": `Twoje objawy wskazują na stan wysokiego ryzyka. Powinieneś udać się na SOR.`,
  "Żółty": `Twoje objawy wymagają pilnej konsultacji lekarskiej (najlepiej w ciągu 12–24 h). Skontaktuj się z lekarzem rodzinnym lub odwiedź nocną i świąteczną opiekę zdrowotną. Jeśli objawy się nasilą, zgłoś się na SOR.`,
  "Zielony": `Skontaktuj się z lekarzem rodzinnym w najbliższych dniach.`,
  "Niebieski": `Twoje objawy nie wymagają interwencji medycznej. W razie pogorszenia skontaktuj się z lekarzem rodzinnym.`
};


/** Prosta funkcja dopasowująca chorobę (bez advanced similarity) */
function predictDiseaseFromText(inputText: string, diseases: DiseaseInfo[]) {
  const lowerText = inputText.toLowerCase();
  let bestDisease: DiseaseInfo | null = null;
  let bestScore = 0;

  for (const d of diseases) {
    const needed = d.objawy.map(o => o.toLowerCase());
    const matched = needed.filter(sym => lowerText.includes(sym));
    const ratio = needed.length > 0 ? matched.length / needed.length : 0;
    if (ratio > bestScore) {
      bestScore = ratio;
      bestDisease = d;
    }
  }

  if (!bestDisease) {
    return { icd_code: null, nazwa: null, message: 'Nie znaleziono dopasowań' };
  }
  return {
    icd_code: bestDisease.icd_code,
    nazwa: bestDisease.nazwa
  };
}

/** Minimalna predykcja triage: intensywność bólu i duszność w spoczynku */
function predictTriage(symptoms: any) {
  const pain = symptoms.chestPain?.intensity ?? 0;           
  const sobRest = !!symptoms.shortnessOfBreath?.rest;        
  const sobExert = !!symptoms.shortnessOfBreath?.exertion;   

  if (pain >= 8 && sobRest) return 'Czerwony';
  if (pain >= 8 || (pain >= 5 && sobRest)) return 'Pomarańczowy';
  if (pain >= 3 || sobExert) return 'Żółty';
  if (pain === 0 && !sobRest && !sobExert) return 'Niebieski';
  return 'Zielony';
}


@Component({
  selector: 'app-body-selection',
  standalone: true,
  templateUrl: './body-selection.component.html',
  styleUrls: ['./body-selection.component.css'],
  imports: [CommonModule, FormsModule]
})
export class BodySelectionComponent implements OnInit {

  /** STEPS (kroki formularza) */
  currentStep = 1;
  selectedArea: string | null = null;

  /** OBJAWY */
  symptoms = {
    chestPain: { location: '', character: '', intensity: 1 },
    shortnessOfBreath: { rest: false, exercise: false, none: false, dunno: false },
    cough: { type: '', blood: false },
    otherSymptoms: {
      breathingPain: false,
      palpitations: false,
      coldSweats: false,
      dizziness: false,
      fever: false,
      nausea: false,
      none: false
    },
    capillaryRefillTime: null as number | null
  };

  /** HISTORIA MEDYCZNA */
  medicalHistory = {
    hypertension: false,
    diabetes: false,
    asthma: false,
    heartDisease: false,
    thyroidIssues: false,
    takesMedication: false,
    medicationDetails: '',
    bloodPressure: '',
    saturation: null as number | null,
    heartRate: null as number | null,
    glucoseLevel: null as number | null,
    symptomDuration: ''
  };

  /** SI (czy włączone) i opis objawów */
  aiPrediction = false;
  opisObjawow = '';

  /** Choroby z bazy */
  diseases: DiseaseInfo[] = [];
  /** Dane treningowe – do ewentualnego użycia */
  trainingData: any[] = [];

  /** Wyniki do wyświetlenia w Kroku 5 */
  predictedTriage: string | null = null;
  predictedDisease: string | null = null;

  /** Tylko dla Pomarańczowego: czy pacjent potrafi sam dojechać do SOR */
  canReachSor: boolean | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Pobierz choroby
    this.http.get<DiseaseInfo[]>('http://localhost:3000/api/diseases')
      .subscribe({
        next: data => {
          this.diseases = data;
          console.log('Pobrano choroby z /api/diseases:', data);
        },
        error: err => {
          console.error('Błąd pobierania /api/diseases:', err);
          this.diseases = [];
        }
      });

    // Pobierz trainingData
    this.http.get<any[]>('http://localhost:3000/api/trainingData')
      .subscribe({
        next: data => {
          this.trainingData = data;
          console.log('Pobrano trainingData (pacjenci2):', data);
        },
        error: err => {
          console.error('Błąd pobierania /api/trainingData:', err);
          this.trainingData = [];
        }
      });
  }

  /** Zwraca snippet tekstu z TRIAGE_GUIDE, zależnie od predictedTriage */
  get triageGuide(): string {
    if (!this.predictedTriage) return '';
    return TRIAGE_GUIDE[this.predictedTriage] || '';
  }

  /** Krok 1 – wybór obszaru ciała */
  onSelect(area: string) {
    this.selectedArea = area;
    this.currentStep = 2;
  }

  get selectedAreaName(): string {
    switch (this.selectedArea) {
      case 'head': return 'Głowa';
      case 'chest': return 'Klatka piersiowa';
      case 'stomach': return 'Brzuch';
      case 'limbs': return 'Kończyny';
      default: return 'Nieznany obszar';
    }
  }

  goToStep(step: number) {
    const validSteps = [1, 2, 3, 4, 5];
    if (validSteps.includes(step)) {
      this.currentStep = step;
    }
  }

  onShortnessNoneChange() {
    if (this.symptoms.shortnessOfBreath.none) {
      this.symptoms.shortnessOfBreath.rest = false;
      this.symptoms.shortnessOfBreath.exercise = false;
      this.symptoms.shortnessOfBreath.dunno = false;
    }
  }
  onCoughTypeChange() {
    if (this.symptoms.cough.type === 'none' || this.symptoms.cough.type === 'dunno') {
      this.symptoms.cough.blood = false;
    }
  }
  onOtherSymptomsNoneChange() {
    if (this.symptoms.otherSymptoms.none) {
      this.symptoms.otherSymptoms.breathingPain = false;
      this.symptoms.otherSymptoms.palpitations = false;
      this.symptoms.otherSymptoms.coldSweats = false;
      this.symptoms.otherSymptoms.dizziness = false;
      this.symptoms.otherSymptoms.fever = false;
      this.symptoms.otherSymptoms.nausea = false;
    }
  }

  validateSymptoms(): boolean {
    if (!this.symptoms.chestPain.location || !this.symptoms.chestPain.character) {
      alert('Proszę uzupełnić szczegóły bólu w klatce piersiowej.');
      return false;
    }
    return true;
  }

  submitSymptoms() {
    if (this.validateSymptoms()) {
      this.currentStep = 4;
    }
  }

  /** Reset całego formularza */
  resetForm() {
    this.symptoms = {
      chestPain: { location: '', character: '', intensity: 1 },
      shortnessOfBreath: { rest: false, exercise: false, none: false, dunno: false },
      cough: { type: '', blood: false },
      otherSymptoms: {
        breathingPain: false, palpitations: false, coldSweats: false,
        dizziness: false, fever: false, nausea: false, none: false
      },
      capillaryRefillTime: null
    };
    this.medicalHistory = {
      hypertension: false, diabetes: false, asthma: false, heartDisease: false,
      thyroidIssues: false, takesMedication: false, medicationDetails: '',
      bloodPressure: '', saturation: null, heartRate: null,
      glucoseLevel: null, symptomDuration: ''
    };
    this.aiPrediction = false;
    this.opisObjawow = '';

    this.currentStep = 1;
    this.selectedArea = null;
    this.predictedTriage = null;
    this.predictedDisease = null;
    this.canReachSor = null;
  }

  submitMedicalHistory() {
    this.currentStep = 5;
  }

  /** Konstrukcja obiektu pacjenta */
  getPatientData() {
    return {
      objawy: this.symptoms,
      historiaMedyczna: this.medicalHistory,
      opisObjawow: this.aiPrediction ? this.opisObjawow : ''
    };
  }
  isComputing = false;  // <-- Dodaj tę zmienną

/** Krok 5 – obliczamy triage i chorobę */
computeResultLocally() {
  // 1. Włączamy animację "myślenia"
  this.isComputing = true;

  // 2. Symulujemy obliczenia przez 2 sekundy (lub wstaw realny kod async)
  setTimeout(() => {
    // Twoja faktyczna logika:
    const data = this.getPatientData();
    console.log('Dane pacjenta:', data);

    // 1) Triage
    this.predictedTriage = predictTriage(data.objawy);
    console.log('Wyznaczony TRIAGE:', this.predictedTriage);

    // 2) Choroba
    if (this.aiPrediction && data.opisObjawow.trim()) {
      const diseaseRes = predictDiseaseFromText(data.opisObjawow, this.diseases);
      this.predictedDisease = diseaseRes.nazwa ?? diseaseRes.message ?? 'Nie znaleziono dopasowań';
    } else {
      this.predictedDisease = null;
    }

    // Reset ewentualnej wcześniejszej odpowiedzi
    this.canReachSor = null;

    // 3. Wyłączamy loader
    this.isComputing = false;
  }, 2000);
}
  

  /** Obsługa pytania w Pomarańczowym: "Czy jesteś w stanie dotrzeć samodzielnie?" */
  setCanReachSor(decision: boolean) {
    this.canReachSor = decision;
  }
}
