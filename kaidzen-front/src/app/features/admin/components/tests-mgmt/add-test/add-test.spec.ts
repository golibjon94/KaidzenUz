import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTest } from './add-test';

describe('AddTest', () => {
  let component: AddTest;
  let fixture: ComponentFixture<AddTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
