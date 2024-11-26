import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarRamoPage } from './registrar-ramo.page';

describe('RegistrarRamoPage', () => {
  let component: RegistrarRamoPage;
  let fixture: ComponentFixture<RegistrarRamoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarRamoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
