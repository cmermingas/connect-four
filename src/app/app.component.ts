import { Component, OnInit } from '@angular/core';
import {ConnectFourComponent} from "./connect-four/connect-four.component";
import {ConnectFour} from "./model/connect-four";

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ConnectFourComponent]
})
export class AppComponent implements OnInit{
  public game: ConnectFour;

  ngOnInit() {
    this.resetGame();
  }

  resetGame() {
    this.game = new ConnectFour(15, 6);
  }
}
