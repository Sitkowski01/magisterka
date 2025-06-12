import { Routes } from '@angular/router';
import { BodySelectionComponent } from './components/body-selection/body-selection.component';
import { ChestSymptomsComponent } from './components/chest-symptoms/chest-symptoms.component';
import { MedicalHistoryComponent } from './components/medical-history/medical-history.component';
import { TriageResultsComponent } from './components/triage-results/triage-results.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full', // dopasowanie całkowite do ścieżki ''
    component: BodySelectionComponent
  },
  {
    path: 'symptoms',
    component: ChestSymptomsComponent
  },
  {
    path: 'history',
    component: MedicalHistoryComponent
  },
  {
    path: 'results',
    component: TriageResultsComponent
  },
  {
    path: 'recommendations',
    component: RecommendationsComponent
  },
  // Fallback route – jeśli ktoś wejdzie na nieznany URL
  {
    path: '**',
    redirectTo: ''
  }
];
