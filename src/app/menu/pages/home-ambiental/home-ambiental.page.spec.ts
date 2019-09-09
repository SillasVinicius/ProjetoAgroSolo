import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAmbientalPage } from './home-ambiental.page';

describe('HomeAmbientalPage', () => {
  let component: HomeAmbientalPage;
  let fixture: ComponentFixture<HomeAmbientalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeAmbientalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAmbientalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
