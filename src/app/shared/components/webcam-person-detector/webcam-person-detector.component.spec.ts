import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WebcamPersonDetectorComponent } from './webcam-person-detector.component';

describe('WebcamPersonDetectorComponent', () => {
  let component: WebcamPersonDetectorComponent;
  let fixture: ComponentFixture<WebcamPersonDetectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WebcamPersonDetectorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WebcamPersonDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
