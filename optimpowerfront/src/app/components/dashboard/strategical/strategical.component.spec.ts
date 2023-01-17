import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicalComponent } from './strategical.component';

describe('StrategicalComponent', () => {
  let component: StrategicalComponent;
  let fixture: ComponentFixture<StrategicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategicalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
