import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBillsComponent } from './view-bill.component';

describe('ViewBillComponent', () => {
  let component: ViewBillsComponent;
  let fixture: ComponentFixture<ViewBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewBillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
