import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaRamosPage } from './lista-ramos.page';

describe('ListaRamosPage', () => {
  let component: ListaRamosPage;
  let fixture: ComponentFixture<ListaRamosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaRamosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
