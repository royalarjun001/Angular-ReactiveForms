import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Customer } from './customer';

function ratingRange(min:number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { 'range': true};
    }
    return null;
  };
}

function emailMatcher(c: AbstractControl): { [key: string]: boolean} | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmEmailControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmEmailControl.value) {
    return null;
  }

  return { 'match': true };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  // This is Root FormGroup and it define our form model
  customerForm: FormGroup;
  customer = new Customer();
  emailMessage: string;

  private validationMessages = {
    required: 'Please enter your email address',
    email: 'Please enter a valid email address'
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    // NOTES
    // This structure is form model and it tracks the value and state of this
    // form. it is not the data model, this should match with the input defined
    // in the HTML. The data model here is
    //   e.g  customer = new Customer();
    // and data model defines the data which transfer through and back from the
    // server.

    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true)
    // });

    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup : this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['',  [Validators.required, Validators.email]],
      }, { validator: emailMatcher}),
      phone: '',
      notification: 'email',
      rating: [null, ratingRange(1 , 5)],
      sendCatalog: true
    });

    this.customerForm.get('notification').valueChanges.subscribe((value) => {
     this.setNotification(value);
    });

    const emailControls = this.customerForm.get('emailGroup.email');
    emailControls.valueChanges.subscribe((value) => {
      this.setMessage(emailControls);
    });
  }

  setMessage(control: AbstractControl): void {
    this.emailMessage = '';
    if ((control.touched || control.dirty) && control.errors) {
      this.emailMessage = Object.keys(control.errors)
        .map( key => this.validationMessages[key]).join(' ');
    }
  }

  save() {
   console.log(this.customerForm);
   console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(): void {
    // this.customerForm.setValue({
    //   firstName: 'Arjun Kumar',
    //   lastName: 'verma',
    //   email: 'xyz@google.com',
    //   confirmEmail: '',
    //   phone: '',
    //   notification: 'email',
    //   rating: null,
    //   sendCatalog: false
    // });
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
}
