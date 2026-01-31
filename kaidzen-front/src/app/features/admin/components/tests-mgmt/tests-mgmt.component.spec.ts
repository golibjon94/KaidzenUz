import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsMgmt } from './tests-mgmt';

describe('TestsMgmt', () => {
  let component: TestsMgmt;
  let fixture: ComponentFixture<TestsMgmt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestsMgmt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsMgmt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
