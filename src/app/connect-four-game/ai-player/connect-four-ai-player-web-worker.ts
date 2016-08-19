import {ConnectFourAiPlayer, HighestConcentrationHeuristic} from './connect-four-ai-player';
import {ConnectFourGameModel} from '../model/connect-four-game-model';

export type PerformMove = (number, ConnectFourAiPlayerWebWorker) => void;
enum Command {Play, Plan, Reset, PlayDone, PlanDone}
interface WebWorkerMessage {
  command: Command;
  data: any;
}

// This class is to be used by the client side (to interface with the web worker)

export class ConnectFourAiPlayerWebWorker {
  public terminated = false;

  constructor(public game: ConnectFourGameModel,
              public myNumber: number,
              public worker: Worker,
              public performMove: PerformMove) {
    worker.onmessage = (event: MessageEvent) => this.processMessage(event.data);
  }

  processMessage(message: WebWorkerMessage) {
    switch (message.command) {
      case Command.PlayDone:
        this.turnTaken(message.data);
        break;
      case Command.PlanDone: {
        if (this.game.currentPlayer === this.myNumber) {
          this.takeTurn();
        }
      }
    }

  }

  takeTurn() {
    let message = {command: Command.Play, data: this.game.toJSON()};
    this.worker.postMessage(message);
  }

  turnTaken(data: any) {
    if (!this.terminated) {
      this.performMove(data, this);
    }
  }

  reset(_game: ConnectFourGameModel) {
    this.game = _game;
    let message = {command: Command.Reset, data: null};
    this.worker.postMessage(message);
  }

  terminate() {
    this.worker.terminate();
    this.terminated = true;
  }
}

// This code runs on the web worker side:

const _player = new ConnectFourAiPlayer(new HighestConcentrationHeuristic());

onmessage = (event: MessageEvent): any => {
  let message = <WebWorkerMessage>(event.data);

  switch (message.command) {
    case Command.Play:
      // Play this turn
      let game = ConnectFourGameModel.fromJSON(message.data);
      let result = _player.play(game);
      let response = {command: Command.PlayDone, data: result};
      postMessage(response, undefined);

      // Plan next turn
      game.playAtColumn(result);
      break;
    case Command.Reset:
      _player.reset();
      break;
  }
};
