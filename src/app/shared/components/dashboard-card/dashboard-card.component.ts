import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule ],
})
export class DashboardCardComponent{

  title = input.required<string>();
  value = input.required<string | number>();
  percentage = input<string>();
  description = input<string>();
  trend = input<'up' | 'down' | 'neutral'>('neutral');
  icon = input<string>('trending-up-outline');

}