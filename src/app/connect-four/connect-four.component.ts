import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {GameColumnComponent} from "../game-column/game-column.component";
import {ConnectFour} from "../model/connect-four";

@Component({
  moduleId: module.id,
  selector: 'connect-four',
  templateUrl: 'connect-four.component.html',
  styleUrls: ['connect-four.component.css'],
  directives: [GameColumnComponent]
})
export class ConnectFourComponent implements OnInit {
  @Input() game:ConnectFour;
  @Output() columnClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.game);
  }

  _columnClicked(e) {
    this.columnClicked.emit(e);
  }
}
