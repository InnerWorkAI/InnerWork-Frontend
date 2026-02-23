import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonIcon, IonSpinner } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { send, sparkles } from 'ionicons/icons';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { Message } from '../../models/Message';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss'],
  imports: [CommonModule, IonIcon, IonSpinner, FormsModule],
})
export class AiChatComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  
  messages: Message[] = [];
  userInput: string = '';
  isTyping = false;
  
  constructor() {
    addIcons({
      send,
      sparkles
    });
    this.messages.push({
      role: 'assistant',
      content: 'Hola. He analizado tu check-in de hoy. Parece que ha sido un día intenso, ¿cómo te sientes realmente?',
      timestamp: new Date()
    });
  }

async sendMessage() {
    const trimmedInput = this.userInput.trim();
    if (!trimmedInput || this.isTyping) return;

    this.messages.push({ 
      role: 'user', 
      content: trimmedInput, 
      timestamp: new Date() 
    });
    
    this.userInput = '';
    this.isTyping = true;
    this.scrollToBottom();

    this.simulateAiResponse();
  }

  private simulateAiResponse() {
    setTimeout(() => {
      this.messages.push({ 
        role: 'assistant', 
        content: 'Entiendo. Es importante identificar esos momentos de tensión. ¿Sientes que el estrés es algo puntual de hoy o se ha vuelto una constante en tu semana?', 
        timestamp: new Date() 
      });
      this.isTyping = false;
      this.scrollToBottom();
    }, 1500);
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        const el = this.scrollContainer.nativeElement;
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    }, 50);
  }
}


