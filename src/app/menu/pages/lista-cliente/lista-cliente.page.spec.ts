import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaClientePage } from './lista-cliente.page';

describe('ListaClientePage', () => {
  let component: ListaClientePage;
  let fixture: ComponentFixture<ListaClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaClientePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
