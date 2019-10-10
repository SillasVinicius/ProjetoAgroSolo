import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUsuarioPage } from './lista-usuario.page';

describe('ListaUsuarioPage', () => {
  let component: ListaUsuarioPage;
  let fixture: ComponentFixture<ListaUsuarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaUsuarioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
