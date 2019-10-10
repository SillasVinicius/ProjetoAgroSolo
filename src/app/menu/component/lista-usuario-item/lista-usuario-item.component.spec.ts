import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUsuarioItemComponent } from './lista-usuario-item.component';

describe('ListaUsuarioItemComponent', () => {
  let component: ListaUsuarioItemComponent;
  let fixture: ComponentFixture<ListaUsuarioItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaUsuarioItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaUsuarioItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
