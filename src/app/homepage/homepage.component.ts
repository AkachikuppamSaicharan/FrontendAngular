import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {DetailsService} from '../../service/details.service';

@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  constructor(private router:Router,private saveService:DetailsService){}
  names!:string;
  ngOnInit():void{
    this.names=this.saveService.getCustomerDetails().name;
  }
  logout():void{
    this.saveService.clearAll();
    this.router.navigate(['']);
  }
}
