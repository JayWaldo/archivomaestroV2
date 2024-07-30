import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './Registro.component.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {
  constructor() { 
    
  }
  title = "Registro";
  icon = "fas fa-user";
  
  ngOnInit(): void {
  }

}
