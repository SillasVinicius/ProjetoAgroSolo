import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriaDaPage } from './cria-da.page';

describe('CriaDaPage', () => {
  let component: CriaDaPage;
  let fixture: ComponentFixture<CriaDaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriaDaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriaDaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
