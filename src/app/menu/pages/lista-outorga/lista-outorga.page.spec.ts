import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaOutorgaPage } from './lista-outorga.page';

describe('ListaOutorgaPage', () => {
  let component: ListaOutorgaPage;
  let fixture: ComponentFixture<ListaOutorgaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaOutorgaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaOutorgaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
