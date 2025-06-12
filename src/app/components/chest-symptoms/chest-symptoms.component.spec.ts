import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChestSymptomsComponent } from './chest-symptoms.component';

describe('ChestSymptomsComponent', () => {
  let component: ChestSymptomsComponent;
  let fixture: ComponentFixture<ChestSymptomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChestSymptomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChestSymptomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
