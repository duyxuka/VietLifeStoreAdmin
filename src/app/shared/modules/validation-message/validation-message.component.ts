import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './validation-message.component.html'
})
export class ValidationMessageComponent implements OnInit {
  @Input() entityForm: FormGroup;
  @Input() fieldName: string;
  @Input() validationMessages: any;
  constructor() { }

  ngOnInit(): void {

  }

}