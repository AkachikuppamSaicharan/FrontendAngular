import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: false,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  constructor(private router:Router){}
  customerLogin():void{
    this.router.navigate(['Customer-Login']);
  }
  adminLogin():void{
    this.router.navigate(['AdminLogin']);
  }
}
