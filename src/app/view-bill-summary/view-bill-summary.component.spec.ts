import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBillSummaryComponent } from './view-bill-summary.component';

describe('ViewBillSummaryComponent', () => {
  let component: ViewBillSummaryComponent;
  let fixture: ComponentFixture<ViewBillSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewBillSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBillSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
