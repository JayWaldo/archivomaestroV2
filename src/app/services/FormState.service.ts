import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormStateService {
  private formState: { [key: string] : any} = {};

  saveFormState(formKey: string, state: any) {
    this.formState[formKey] = state;
  }

  getFormState(formKey: string): any | null {
    return this.formState[formKey];
  }

  clearAllFormState() {
    this.formState = {};
  }
}
