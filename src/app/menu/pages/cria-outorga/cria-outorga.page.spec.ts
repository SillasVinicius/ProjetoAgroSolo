import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriaOutorgaPage } from './cria-outorga.page';

describe('CriaOutorgaPage', () => {
  let component: CriaOutorgaPage;
  let fixture: ComponentFixture<CriaOutorgaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriaOutorgaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriaOutorgaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
