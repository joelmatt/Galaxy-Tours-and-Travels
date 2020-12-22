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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogout(){
    this.authService.logout();
  }
  
  routePage(where: string){
    if (where === "candidates")
       this.router.navigate(['main'])
    else
      this.router.navigate(['main',where])
  }
}
