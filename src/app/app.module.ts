
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import { AppComponent } from './app.component';
import {AppRoutingModule } from './app-routing.module'
import { AppService } from './services/app.service';
import { GameService } from './services/game.service';
import { GameModule } from './game/game.module';
import { HomeComponent } from './home/home.component';


@NgModule({
	declarations: [
		AppComponent,
		HomeComponent
	],
	imports: [
    BrowserModule,
	AppRoutingModule,
	GameModule
	],
	providers: [AppService, GameService, {provide: APP_BASE_HREF, useValue: '/my/app'}],
	bootstrap: [AppComponent]
})
export class AppModule { }