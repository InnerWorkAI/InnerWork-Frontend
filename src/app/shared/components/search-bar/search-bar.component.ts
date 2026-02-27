import { Component, OnInit, input, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-search-bar',
  imports: [IonicModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
})
export class SearchBarComponent  implements OnInit {

  placeholder = input<string>('Find Employee...'); 
  
  searchChange = output<string>(); 

  handleInput(event: any) {
    const value = event.target.value || '';
    this.searchChange.emit(value);
  }
  ngOnInit() {}

}