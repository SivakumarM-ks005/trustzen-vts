import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf, AsyncPipe, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet, NgIf, MatProgressBar, AsyncPipe],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }], // Provide HashLocationStrategy
})
export class AppComponent  {

  title = 'procurezen';
  show = false;
  isLoading$ = false;
  // isVisible = true;
  // issupplierformVisible = true;

  constructor( private router: Router, ) {

  }




  


 
}
