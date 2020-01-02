import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCreditoPage } from './lista-credito.page';

describe('ListaCreditoPage', () => {
  let component: ListaCreditoPage;
  let fixture: ComponentFixture<ListaCreditoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaCreditoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCreditoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
