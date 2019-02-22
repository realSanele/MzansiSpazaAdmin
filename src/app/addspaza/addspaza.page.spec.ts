import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddspazaPage } from './addspaza.page';

describe('AddspazaPage', () => {
  let component: AddspazaPage;
  let fixture: ComponentFixture<AddspazaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddspazaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddspazaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
