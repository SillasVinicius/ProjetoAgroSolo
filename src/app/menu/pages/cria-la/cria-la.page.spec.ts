import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriaLaPage } from './cria-la.page';

describe('CriaLaPage', () => {
  let component: CriaLaPage;
  let fixture: ComponentFixture<CriaLaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriaLaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriaLaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
