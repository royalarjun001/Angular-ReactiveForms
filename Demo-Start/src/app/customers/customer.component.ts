import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  // This is Root FormGroup and it define our form model
  customerForm: FormGroup;
  customer = new Customer();

  constructor() { }

  ngOnInit() {

    // NOTES
    // This structure is form model and it tracks the value and state of this
    // form. it is not the data model, this should match with the input defined
    // in the HTML. The data model here is
    //   e.g  customer = new Customer();
    // and data model defines the data which transfer through and back from the
    // server.

    this.customerForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      sendCatalog: new FormControl(true)
    });
  }

  save() {
   console.log(this.customerForm);
   console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(): void {
    this.customerForm.setValue({
      firstName: 'Arjun Kumar',
      lastName: 'verma',
      email: 'xyz@google.com',
      sendCatalog: false
    });
  }
}
