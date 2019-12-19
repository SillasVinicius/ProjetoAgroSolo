import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioClientePage } from './relatorio-cliente.page';

describe('RelatorioClientePage', () => {
  let component: RelatorioClientePage;
  let fixture: ComponentFixture<RelatorioClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioClientePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
