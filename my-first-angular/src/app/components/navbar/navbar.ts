import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() appName: string = '';

   @Output() menuClicked = new EventEmitter<string>();

  onMenuClick(page: string) {
    this.menuClicked.emit(page);  // 通知父層
  }
}
