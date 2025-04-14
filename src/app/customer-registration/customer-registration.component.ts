import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegisterService} from '../../service/electricity_service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-customer-registration',
  standalone: false,
  templateUrl: './customer-registration.component.html',
  styleUrl: './customer-registration.component.css'
})
export class CustomerRegistrationComponent {
  registrationForm: FormGroup;
  formErrors: any={};
  confirmationMessage: String='';
  consumerID: String='';
  name: String='';
  email: String='';
  formData!:any;
  constructor(private fb : FormBuilder, private registerService : RegisterService, private router:Router){
    this.registrationForm = this.fb.group({
      customerNumber : ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      name : ['', [Validators.required, Validators.pattern(/^[A-Za-z ]{1,50}$/)]],
      address : ['', [Validators.required, Validators.minLength(10)]],
      email : ['', [Validators.required, Validators.email]],
      mobileNumber : ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      customerType : [''],
      electricalSection : [''],
      userID : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      password : ['',[
        Validators.required,
        // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword : ['', Validators.required]
    },{validator:this.passwordsMatch});
  }

  passwordsMatch(group:FormGroup){
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : {notMatching:true};
  }

  onSubmit() {

    if (this.registrationForm.valid) {
      this.formData = this.registrationForm.value;
      this.formData.customerid=this.generateRandomCustomerId();
      console.log(this.formData);
      this.registerService.registerCustomer(this.formData).subscribe({
        next: (response) =>{
          // console.log('Registration Successful:',response);
          this.registrationForm.reset();
          this.confirmationMessage = `Registration Successful!`
          this.consumerID = `Customer ID :${Math.floor(Math.random()*1e13)}`
          this.name = `Name : ${this.formData.name}`
          this.email = `Email :  ${this.formData.email}`
        },
        error:(error)=>{
          console.log('Error registering:', error);
          alert('Registartion Error');
        }
      });
    }
    else{
      this.showValidationErrors();
      alert('Please correct the Validation error.');
    }
  }
  onLogin(): void{
    this.router.navigate(['Customer-Login']);
  }
  showValidationErrors(){
    const controls = this.registrationForm.controls;
    this.formErrors={};
    if(controls['customerNumber'].errors){
      this.formErrors.customerNumber = 'Please enter a valid Consumer Number.';
    }
    if(controls['name'].errors){
      this.formErrors.fullName = 'Full Name should only contains Letters.';
    }
    if(controls['address'].errors){
      this.formErrors.address = 'Address is required and must be atleast 10 characters.';
    }
    if(controls['email'].errors){
      this.formErrors.email = 'Incorrect email format.';
    }
    if(controls['mobileNumber'].errors){
      this.formErrors.mobileNumber = 'Mobile number is invalid.';
    }
    if(controls['userID'].errors){
      this.formErrors.userID = 'UserID must be 4 to 20 characters.';
    }
    // if(controls['password'].errors){
    //   this.formErrors.password = 'Password must be strong (1 uppercase, 1 lowercase, 1 number, 1 special character).';
    // }
    if(this.registrationForm.errors?.['notMatching']){
      this.formErrors.confirmPassword = 'Password do not match.';
    }
  }
  generateRandomCustomerId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let customerId = '';
    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      customerId += chars[randomIndex];
    }
    return customerId;
  }
}
