import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestgraficasComponent } from './testgraficas.component';

describe('TestgraficasComponent', () => {
  let component: TestgraficasComponent;
  let fixture: ComponentFixture<TestgraficasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestgraficasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestgraficasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
