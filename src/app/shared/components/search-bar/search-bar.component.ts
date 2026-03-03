import { Component, OnInit, input, output } from '@angular/core';
import { IonSearchbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-search-bar',
  imports: [IonSearchbar, ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
})
export class SearchBarComponent {

  placeholder = input<string>('Find Employee...'); 
  
  searchChange = output<string>(); 

  handleInput(event: any) {
    const value = event.target.value || '';
    this.searchChange.emit(value);
  }

}