// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';

// @NgModule({
//   declarations: [
//     AppComponent
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import { AppComponent } from './app.component';
import {AppRoutingModule } from './app-routing.module'
import { AppService } from './services/app.service';
import { GameService } from './services/game.service';


@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
    BrowserModule,
    AppRoutingModule
	],
	providers: [AppService, GameService, {provide: APP_BASE_HREF, useValue: '/my/app'}],
	bootstrap: [AppComponent]
})
export class AppModule { }