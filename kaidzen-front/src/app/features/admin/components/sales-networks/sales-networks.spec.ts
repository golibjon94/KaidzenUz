import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesNetworks } from './sales-networks';

describe('SalesNetworks', () => {
  let component: SalesNetworks;
  let fixture: ComponentFixture<SalesNetworks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesNetworks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesNetworks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
