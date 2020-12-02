// import { state, style, transition, trigger, animate} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
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
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogout(){
    this.authService.logout();
  }

}
