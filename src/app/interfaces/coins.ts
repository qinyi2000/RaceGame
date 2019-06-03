export interface Coins {
	x: number; // where we land on canvas
	y: number;
	width: number; // how big this picture should be
	height: number;
	update: Function; // a function that tells the coin how to draw itself
}
