import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Diagnostics } from './diagnostics';

describe('Diagnostics', () => {
  let component: Diagnostics;
  let fixture: ComponentFixture<Diagnostics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Diagnostics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Diagnostics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
