import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriaUsuarioPage } from './cria-usuario.page';

describe('CriaUsuarioPage', () => {
  let component: CriaUsuarioPage;
  let fixture: ComponentFixture<CriaUsuarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriaUsuarioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriaUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
