import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
  standalone: true,
  imports: [IonText,  CommonModule ],
})
export class DashboardCardComponent{

  title = input.required<string>();
  value = input.required<string | number>();
  percentage = input<string>();
  description = input<string>();
  trend = input<'up' | 'down' | 'neutral'>('neutral');
  icon = input<string>('trending-up-outline');

}