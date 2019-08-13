import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriaClientePage } from './cria-cliente.page';

describe('CriaClientePage', () => {
  let component: CriaClientePage;
  let fixture: ComponentFixture<CriaClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriaClientePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriaClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
