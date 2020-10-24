import { state, style, transition, trigger, animate} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations:[] 
})
export class NavigationComponent implements OnInit {

  navState="normal";
  linkTextState = "invisible";
  onNavAnimate(){
    this.navState == "normal" ? this.navState = 'extended' : this.navState = "normal";
    this.linkTextState == "invisible" ? this.linkTextState = 'visible' : this.linkTextState = "invisible";
  }
  constructor() { }

  ngOnInit(): void {
  }

}
