import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-webcam-person-detector',
  standalone: true,
  templateUrl: './webcam-person-detector.component.html',
  imports: [IonIcon, IonButton, CommonModule]
})
export class WebcamPersonDetectorComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  private detector: faceDetection.FaceDetector | null = null;
  faceDetected = false;

  isLoading = true;

  refreshTime = 250; // Tiempo entre predicciones en ms

  constructor() {
  
  }

  async ngAfterViewInit() {
    await this.initModel();
  }

  async initModel() {
    try {

      this.isLoading = true;

      await tf.ready();
      console.log('Backend actual:', tf.getBackend());
      
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig: faceDetection.MediaPipeFaceDetectorMediaPipeModelConfig = {
        runtime: 'mediapipe',
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection`,
        modelType: 'short',
        maxFaces: 1,
      };

      this.detector = await faceDetection.createDetector(model, detectorConfig);

      this.isLoading = false;
      console.log("Modelo COCO-SSD cargado con éxito");
    } catch (error) {
      this.isLoading = false;
      console.error("Error cargando el modelo:", error);
    }
  }

  async startWebcam() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false
    });
    this.videoElement.nativeElement.srcObject = stream;
    
    this.videoElement.nativeElement.onloadeddata = () => {
      this.predictFrame();
    };
  }

  async predictFrame() {
    if (!this.detector) return;

    const faces = await this.detector.estimateFaces(this.videoElement.nativeElement);
    
    this.faceDetected = faces.length > 0;

    setTimeout(() => this.predictFrame(), this.refreshTime);
  }

}