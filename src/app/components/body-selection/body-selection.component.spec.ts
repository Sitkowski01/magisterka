import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodySelectionComponent } from './body-selection.component';

describe('BodySelectionComponent', () => {
  let component: BodySelectionComponent;
  let fixture: ComponentFixture<BodySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodySelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
