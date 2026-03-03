import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { IonIcon, IonSpinner } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { send, sparkles } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Message } from '../../models/Message';
import { FormsModule } from '@angular/forms';
import { GroqService } from 'src/app/core/services/groq-service';

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss'],
  imports: [CommonModule, IonIcon, IonSpinner, FormsModule],
})
export class AiChatComponent {
@ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  private groqService = inject(GroqService);

  messages: Message[] = [];
  userInput: string = '';
  isTyping = false;
  
  constructor() {
    addIcons({ send, sparkles });
    this.messages.push({
      role: 'assistant',
      content: 'Hello, I am InnerWork AI, your occupational psychology assistant. How can I help you today?',
      timestamp: new Date()
    });
  }

  async sendMessage() {
    const trimmedInput = this.userInput.trim();
    if (!trimmedInput || this.isTyping) return;

    const userMessage: Message = { 
      role: 'user', 
      content: trimmedInput, 
      timestamp: new Date() 
    };
    this.messages.push(userMessage);
    
    this.userInput = '';
    this.isTyping = true;
    this.scrollToBottom();

    this.groqService.getChatResponse(this.messages).subscribe({
      next: (aiResponse) => {
        this.messages.push({
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        });
        this.isTyping = false;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error with Groq:', error);
        this.isTyping = false;
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, there was an error processing your message. Please try again.',
          timestamp: new Date()
        });
        this.scrollToBottom();
      }
    });
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


