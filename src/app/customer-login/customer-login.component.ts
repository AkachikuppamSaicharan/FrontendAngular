import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {LoginService} from '../../service/login';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import {CustomerDetails} from '../../model/customerDetails';
import {DetailsService} from '../../service/details.service';
import {SessionServiceService} from '../../service/session-service.service';
@Component({
  selector: 'app-customer-login',
  standalone: false,
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.css'
})
export class CustomerLoginComponent {
  loginForm: FormGroup;
  backendError='';
  Details: CustomerDetails | null=null;
  fieldError:'userID' | 'password' | "=" | undefined;
  constructor(private fb:FormBuilder,
              private loginService: LoginService,
              private router:Router,private saveService:DetailsService,
              private sessionService:SessionServiceService){
    this.loginForm = this.fb.group({
      userID : ['',[Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password : ['', [Validators.required, Validators.maxLength(30)]],
    });
  }
  onSubmit(): void{
    if(this.loginForm.valid){
      this.loginService.loginCustomer(this.loginForm.value).subscribe({
        next:(res)=>{
          if(res=="Incorrect Password..."){
            this.loginForm.reset();
            this.router.navigate(['Customer-Login']);
            alert("Incorrect Password. Try again...");
          }else if(res=="Login Successful!!!"){
            this.callAPIDetails();
            console.log("A"+this.saveService.getCustomerDetails().name)
            this.sessionService.startSession();
            this.router.navigate(['Homepage']);
          }
          else{
            this.router.navigate(['Registration']);
            alert("UserId not exists. Please Register and Login...");
          }
        },
        error:(err)=>{
          this.fieldError = err.error.field;
          this.backendError = err.error.message;
        },
      });
    }

  }

  callAPIDetails(){
    this.loginService.getName(this.loginForm.controls['userID'].value).subscribe({
      next:(response)=>{
        this.saveService.setCustomerDetails(response);
        this.Details = response;
        console.log(this.Details?.name)
      },error:()=>{
        console.log("Name Not Exists...");
      }
    })
  }
  onRegister(): void{
    this.router.navigate(['Registration']);
  }

  mainEntry(){
    this.router.navigate(['']);
  }
}
