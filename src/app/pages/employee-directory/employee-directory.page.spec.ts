import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeDirectoryPage } from './employee-directory.page';

describe('EmployeeDirectoryPage', () => {
  let component: EmployeeDirectoryPage;
  let fixture: ComponentFixture<EmployeeDirectoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDirectoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
