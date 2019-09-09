import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaLAPage } from './lista-la.page';

describe('ListaLAPage', () => {
  let component: ListaLAPage;
  let fixture: ComponentFixture<ListaLAPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaLAPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaLAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
