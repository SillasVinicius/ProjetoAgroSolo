import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDAPage } from './lista-da.page';

describe('ListaDAPage', () => {
  let component: ListaDAPage;
  let fixture: ComponentFixture<ListaDAPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaDAPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
