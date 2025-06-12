import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageResultsComponent } from './triage-results.component';

describe('TriageResultsComponent', () => {
  let component: TriageResultsComponent;
  let fixture: ComponentFixture<TriageResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriageResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriageResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
