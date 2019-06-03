import { Component, ElementRef, AfterViewInit, ViewChild, HostListener  } from '@angular/core';
import { AppService } from './services/app.service';
import { GameService } from './services/game.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {

  @ViewChild(HTMLCanvasElement, {static: true}) game_canvas: HTMLCanvasElement;

	subscription: any;
	showLoader = true;
	button_text = "Pause";

	constructor(
		private appService: AppService,
		private gameService: GameService
	) {}

	public updatePauseStatus(){
		const buttonStatus = this.gameService.updatePauseStatus();
		if (buttonStatus) {
			this.button_text = "Resume";
		} else {
			this.button_text = "Pause";
		}
	}

	public ngAfterViewInit() {
		const canvasEl = document.querySelector("#gameCanvas") as HTMLCanvasElement;
    //const canvasEl: HTMLCanvasElement = this.game_canvas;
		this.appService.createPlayGround(canvasEl); // first create playground for the game(set up)
    this.subscription = this.appService.getImageLoadEmitter()
			.subscribe((item) => {
				this.showLoader = false; //hide the loader when everything's loaded
				this.gameService.startGameLoop();
			});
	}

  // Event listeners that emit the status of user's mouse any time it changes. This allows user to control car on screen.
	@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		this.appService.movePlayer(event, 'keydown');
	}

	@HostListener('document:keyup', ['$event']) onKeyupHandler(event: KeyboardEvent) {
		this.appService.movePlayer(event, 'keyup');
	}
}