import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasajeBusquedaComponent } from './pasaje-busqueda.component';

describe('PasajeBusquedaComponent', () => {
  let component: PasajeBusquedaComponent;
  let fixture: ComponentFixture<PasajeBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasajeBusquedaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasajeBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
