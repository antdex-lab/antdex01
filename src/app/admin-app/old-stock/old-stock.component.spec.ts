import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldStockComponent } from './old-stock.component';

describe('OldStockComponent', () => {
  let component: OldStockComponent;
  let fixture: ComponentFixture<OldStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
