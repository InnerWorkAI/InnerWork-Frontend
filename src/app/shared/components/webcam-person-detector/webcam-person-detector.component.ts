import { Component, ElementRef, ViewChild, AfterViewInit, output } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { JournalData } from '../../models/Journal';

@Component({
  selector: 'app-webcam-person-detector',
  standalone: true,
  templateUrl: './webcam-person-detector.component.html',
  imports: [IonButton, CommonModule, IonIcon]
})
export class WebcamPersonDetectorComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  private detector: faceDetection.FaceDetector | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private captureInterval: any;

  // Estados de la UI
  isLoading = true;
  cameraInitialized = false;
  faceDetected = false;
  isRecording = false;
  showReview = false;
  isSubmitted = false;

  recordingDuration = 0;
  private timerInterval: any;
  readonly MIN_RECORDING_TIME = 15;
  canStop = false;

  // Datos capturados
  capturedImages: string[] = [];
  finalAudioBlob: Blob | null = null;
  onJournalFinished = output<JournalData>();
  capturedImagesBlobs: Blob[] = [];
  
  refreshTime = 250;

  

  constructor() {
    addIcons({
      checkmarkCircle,
    });
  }

  async ngAfterViewInit() {
    await this.initModel();
  }

  async initModel() {
    try {
      this.isLoading = true;
      // Forzamos a que espere a que todo el motor gráfico esté libre
      await tf.ready();

      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      this.detector = await faceDetection.createDetector(model, {
        runtime: 'mediapipe',
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection`,
        modelType: 'short'
      });

      this.isLoading = false;
      console.log("Sistema recuperado");
    } catch (error) {
      console.error("El navegador sigue bloqueado, reinicia Chrome.");
    }
  }

  async startWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      this.videoElement.nativeElement.srcObject = stream;
      this.cameraInitialized = true;
      this.predictFrame();
    } catch (err) {
      console.error("No se pudo acceder a la cámara", err);
    }
  }

  async predictFrame() {
    if (!this.detector || this.showReview) return;

    // Validación de seguridad para evitar el error de ROI (0x0)
    const video = this.videoElement.nativeElement;
    if (video.readyState === 4 && video.videoWidth > 0) {
      try {
        const faces = await this.detector.estimateFaces(video);
        this.faceDetected = faces.length > 0;
      } catch (e) {
        console.warn("Detección omitida");
      }
    }
    requestAnimationFrame(() => this.predictFrame());
  }

  startRecording() {
    if (!this.faceDetected) return;

    this.isRecording = true;
    this.showReview = false;
    this.capturedImages = [];
    this.recordedChunks = [];

    this.startTimer();

    const stream = this.videoElement.nativeElement.srcObject as MediaStream;

    const audioStream = new MediaStream(stream.getAudioTracks());
    this.mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm;codecs=opus' });

    this.mediaRecorder.ondataavailable = (e) => this.recordedChunks.push(e.data);
    this.mediaRecorder.onstop = () => {
      this.finalAudioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
    };

    this.mediaRecorder.start();
    this.startRandomCaptures();
  }

  private startTimer() {
    this.timerInterval = setInterval(() => {
      this.recordingDuration++;
      if (this.recordingDuration >= this.MIN_RECORDING_TIME) {
        this.canStop = true;
      }
    }, 1000);
  }

  stopRecording() {
    if (!this.canStop) return;
    this.isRecording = false;
    this.mediaRecorder?.stop();

    clearInterval(this.timerInterval);
    clearTimeout(this.captureInterval);

    this.showReview = true;
  }

  private startRandomCaptures() {
    const capture = () => {
      if (!this.isRecording) return;
      this.takeSnapshot();
      // Programar siguiente captura entre 3 y 5 segundos
      const nextIn = Math.random() * 2000 + 3000;
      this.captureInterval = setTimeout(capture, nextIn);
    };
    capture();
  }


  private takeSnapshot() {
    const video = this.videoElement.nativeElement;
    if (video.videoWidth === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    const base64 = canvas.toDataURL('image/jpeg', 0.7);
    this.capturedImages.push(base64);

    canvas.toBlob((blob) => {
      if (blob) {
        this.capturedImagesBlobs.push(blob);
      }
    }, 'image/jpeg', 0.7);
  }

  repeat() {
    this.showReview = false;
    this.finalAudioBlob = null;
    this.capturedImages = [];
    this.capturedImagesBlobs = [];
    this.predictFrame();
  }

  async sendData() {
    if (!this.finalAudioBlob) return;

    try {
      const formData = new FormData();
      formData.append('audio', this.finalAudioBlob, 'journal.webm');
      this.capturedImages.forEach((img, i) => {
        formData.append('frames', this.base64ToBlob(img), `frame_${i}.jpg`);
      });

      console.log("Enviando datos a la API...");

      this.onJournalFinished.emit({
          audio: this.finalAudioBlob,
          images: this.capturedImagesBlobs
        });

      this.isSubmitted = true;
      this.showReview = false;
      this.stopCameraStream();

    } catch (error) {
      console.error("Error al enviar:", error);
    }
  }

  stopCameraStream() {
    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  private base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: 'image/jpeg' });
  }
}