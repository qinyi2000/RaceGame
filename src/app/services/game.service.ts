import { Injectable, Input, Output, EventEmitter } from '@angular/core';

import * as CONFIG from './../config/config';
import { Obstacles } from './../interfaces/obstacles';
import { SingleObstacles } from './../interfaces/single-obstacle';
import { PlayerPosition } from './../interfaces/player-position';
import { SingleCoins } from '../interfaces/single-coin';
import { Coins } from '../interfaces/coins';
import { Subject } from 'rxjs';
//import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
//import { timingSafeEqual } from 'crypto';

@Injectable()
export class GameService {

	@Input() public width: number = CONFIG.playGroundWidth;
	@Input() public height: number = CONFIG.playGroundHeight;
	frameNumber: number = CONFIG.frameNumber;
	player: PlayerPosition = { // initialize the player in the middle of the playground
		x: CONFIG.playGroundWidth / 2 - CONFIG.playerCar.width,
		y: CONFIG.playGroundHeight - (CONFIG.playerCar.height + CONFIG.playerCar.height / 2),
	};
	currentScore = new Subject<number>();
	currentScoreObs = this.currentScore.asObservable();
	scoreRecorder = 0;
	

	context: CanvasRenderingContext2D;
	obstacles: Array<Obstacles> = [];
	coins: Array<Coins> = [];
	image: HTMLImageElement = null;
	coinImage: HTMLImageElement = null;
	gameLoop =  null;
	coinLoop = null;
	moveUP = false;
	moveDown = false;
	moveLeft = false;
	moveRight = false;
	isPaused = false;

	loadAssets(canvasElement: HTMLCanvasElement): Promise<void>  {
		this.context = canvasElement.getContext('2d');
		canvasElement.width = this.width;
		canvasElement.height = this.height;
		return new Promise((resolve, reject) => {
			this.image = new Image();
			this.image.src = CONFIG.spritePath;
			this.image.width = 58;
			this.image.height = 128;
			this.coinImage = new Image();
			this.coinImage.src = CONFIG.coinPath;
			this.coinImage.width = 40;
			this.coinImage.height = 40;
			resolve();
		});
	}

	updatePauseStatus(){
		this.isPaused = !this.isPaused;
		return this.isPaused;
	}

	startGameLoop() {
		this.gameLoop = setInterval(() => {
			if (!this.isPaused) {
				this.suffleProperties();
				this.cleanGround();
				this.createObstacles();
				this.moveObstacles();
				this.createCoin();
				this.moveCoins();
				this.createPlayer();
				}
		}, 10);
	}

	animationFrame(n: number): boolean {
		if ((this.frameNumber / n) % 1 === 0) { return true; }
		return false;
	}

	suffleProperties(): void {
		this.frameNumber += 1;
	}

	createObstacles(): void {
		if (this.frameNumber === 1 || this.animationFrame(100)) {
			if (this.obstacles.length > 20) {
				this.obstacles.splice(0, 5);
			}
			this.getSingleObstacle();
		}
	}

	createCoin(): void {
		if (this.frameNumber === 1 || this.animationFrame(100)) {
			if (this.coins.length > 20) {
				this.coins.splice(0, 5);
			}
			this.getSingleCoin();
		}
	}


	getSingleObstacle(): void {
		const context: CanvasRenderingContext2D = this.context;
		const image: HTMLImageElement = this.image;
		const randomVehicle: SingleObstacles = CONFIG.vehicles[Math.floor(Math.random() * CONFIG.vehicles.length)];

		this.obstacles.push(new function () {
			this.x = Math.floor(Math.random() * 450) + 0,
			this.y = Math.floor(Math.random() * -15) + 0,
			this.width = randomVehicle.width;
			this.height = randomVehicle.height;
			this.update = () => {
				context.drawImage(
					image,
					randomVehicle.sX, randomVehicle.sY,
					randomVehicle.sWidth, randomVehicle.sHeight,
					this.x, this.y,
					randomVehicle.width, randomVehicle.height
				);
			};
		});
	}

	getSingleCoin(): void {
		const context: CanvasRenderingContext2D = this.context;
		const coinImage: HTMLImageElement = this.coinImage;
		const coin: SingleCoins = CONFIG.coin;

		this.coins.push(new function() {
			this.x = Math.floor(Math.random() * 450) + 0,
			this.y = Math.floor(Math.random() * -15) + 0,
			this.width = coin.width;
			this.height = coin.height;
			this.update = () => {
				context.drawImage(
					coinImage,
					this.x, this.y,
					coin.width, coin.height
				);
			};
		});
	}

	moveCoins(): void {
		this.coins.forEach((element: Coins, index: number) => {
			element.y += 3;
			element.update();
			
			if (element.y > this.height || this.detectTouchCoin(element) ) {
				this.coins.splice(index, 1);
			}
		});
	}

	moveObstacles(): void {
		this.obstacles.forEach((element: Obstacles, index: number) => {
			element.y += 3;
			element.update();
			this.detectCrash(element);
			if (element.y > this.height || this.detectCrash(element)) {
				this.obstacles.splice(index, 1);
			}
		});
	}

	createPlayer(): void {
		if (this.moveUP) {
			if (this.player.y === 0) { // if the player can't move up anymore (already on edge of screen), just set the coordinate to the corresponding 0 value
				this.player.y = 0;
			} else {
				this.player.y -= CONFIG.playerCarSpeed;
			}
		} else if (this.moveDown) {
			if (this.player.y + CONFIG.playerCar.height === CONFIG.playGroundHeight ||
				this.player.y + CONFIG.playerCar.height > CONFIG.playGroundHeight) {
				this.player.y = CONFIG.playGroundHeight - CONFIG.playerCar.height;
			} else {
				this.player.y += CONFIG.playerCarSpeed;
			}
		} else if (this.moveLeft) {
			if (this.player.x === 0 || this.player.x < 0 ) {
				this.player.x = 0;
			} else {
				this.player.x -= CONFIG.playerCarSpeed;
			}
		} else if (this.moveRight) {
			if (this.player.x + CONFIG.playerCar.sWidth === CONFIG.playGroundWidth ||
				this.player.x + CONFIG.playerCar.sWidth > CONFIG.playGroundWidth) {
				this.player.x = CONFIG.playGroundWidth - CONFIG.playerCar.width;
			} else {
				this.player.x += CONFIG.playerCarSpeed;
			}
		}
		this.context.drawImage(
			this.image,
			CONFIG.playerCar.sX, CONFIG.playerCar.sY,
			CONFIG.playerCar.sWidth, CONFIG.playerCar.sHeight,
			this.player.x, this.player.y,
			CONFIG.playerCar.width, CONFIG.playerCar.height,
		);
	}

	detectCrash(obstacle: Obstacles ): void {

		const componentLeftSide = obstacle.x;
		const componentRightSide = obstacle.x + obstacle.width;
		const componentTop = obstacle.y;
		const componentBottom = obstacle.y + obstacle.height;

		const carRightSide = this.player.x + CONFIG.playerCar.width;
		const carLeftSide = this.player.x;
		const carTop = this.player.y;
		const carBottom = this.player.y + CONFIG.playerCar.height;

		if ((
				(carRightSide > componentLeftSide) && (carTop < componentBottom)
			) && (
				(carLeftSide < componentRightSide) && (carTop < componentBottom)
			) && (
				(carRightSide > componentLeftSide) && (carBottom > componentTop)
			) && (
				(carLeftSide < componentRightSide) && (carBottom > componentTop)
			)
		) {
			clearInterval(this.gameLoop);
			alert('Game Over');
			window.location.reload();
		}
	}

	detectTouchCoin(c: Coins): boolean {
		const componentLeftSide = c.x;
		const componentRightSide = c.x + c.width;
		const componentTop = c.y;
		const componentBottom = c.y + c.height;

		const carRightSide = this.player.x + CONFIG.playerCar.width;
		const carLeftSide = this.player.x;
		const carTop = this.player.y;
		const carBottom = this.player.y + CONFIG.playerCar.height;

		if ((
			(carRightSide > componentLeftSide) && (carTop < componentBottom)
		) && (
			(carLeftSide < componentRightSide) && (carTop < componentBottom)
		) && (
			(carRightSide > componentLeftSide) && (carBottom > componentTop)
		) && (
			(carLeftSide < componentRightSide) && (carBottom > componentTop)
		)
	) {
		this.context.clearRect(c.x, c.y, c.width, c.height); 
		this.scoreRecorder = this.scoreRecorder + 10;
		this.currentScore.next(this.scoreRecorder);
		// the canvas is drawn repeatedly, so if the collided coin is not remvoed from the array, it will keep being drawn when it leaves the range of the car;
		// therefore, merely clearing it from the screen is not enough (cause it immediately gets covered by the next canvas and the next canvas still has the 
		// coin in the array). However, if we only remove the coin from the array but do not clearRect, the coin would not even be removed. So we need both.
		return true;
		}
	}

	cleanGround(): void {
		this.context.clearRect(0, 0, CONFIG.playGroundWidth, CONFIG.playGroundHeight);
	}

}
