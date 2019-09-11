import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriaCarPage } from './cria-car.page';

describe('CriaCarPage', () => {
  let component: CriaCarPage;
  let fixture: ComponentFixture<CriaCarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriaCarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriaCarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
