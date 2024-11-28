import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasajeCompraComponent } from './pasaje-compra.component';

describe('PasajeCompraComponent', () => {
  let component: PasajeCompraComponent;
  let fixture: ComponentFixture<PasajeCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasajeCompraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasajeCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
