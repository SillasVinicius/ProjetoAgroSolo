import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCARPage } from './lista-car.page';

describe('ListaCARPage', () => {
  let component: ListaCARPage;
  let fixture: ComponentFixture<ListaCARPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaCARPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCARPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
