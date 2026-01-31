import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogMgmt } from './blog-mgmt';

describe('BlogMgmt', () => {
  let component: BlogMgmt;
  let fixture: ComponentFixture<BlogMgmt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogMgmt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogMgmt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
