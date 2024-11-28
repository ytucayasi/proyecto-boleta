import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasajesListComponent } from './pasajes-list.component';

describe('PasajesListComponent', () => {
  let component: PasajesListComponent;
  let fixture: ComponentFixture<PasajesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasajesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasajesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
