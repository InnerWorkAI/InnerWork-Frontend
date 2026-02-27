import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-burnout-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './burnout-filter.component.html',
  styleUrls: ['./burnout-filter.component.scss']
})
export class BurnoutFilterComponent {
  rangeChange = output<{ lower: number, upper: number }>();
  
  private min = 0;
  private max = 100;

  onMinChange(event: any) {
    const val = event.target.value;
    this.min = val === '' ? 0 : Number(val);
    this.emitValues();
  }

  onMaxChange(event: any) {
    const val = event.target.value;
    this.max = val === '' ? 100 : Number(val);
    this.emitValues();
  }

  private emitValues() {
    this.rangeChange.emit({ lower: this.min, upper: this.max });
  }
}