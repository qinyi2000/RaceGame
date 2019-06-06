import { Component, ElementRef, AfterViewInit, ViewChild, HostListener, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

	constructor(private ActivatedRoute: ActivatedRoute, private router: Router){

	}

	ngOnInit(){
	}

	navigateToGame(){
		this.router.navigate(['../game'], { relativeTo: this.ActivatedRoute });
	}
}