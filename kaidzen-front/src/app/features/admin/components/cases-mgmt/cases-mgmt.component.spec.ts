import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesMgmt } from './cases-mgmt';

describe('CasesMgmt', () => {
  let component: CasesMgmt;
  let fixture: ComponentFixture<CasesMgmt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasesMgmt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasesMgmt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
