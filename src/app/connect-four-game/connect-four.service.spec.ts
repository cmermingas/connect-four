/* tslint:disable:no-unused-variable */

import {addProviders, async, inject} from '@angular/core/testing';
import {ConnectFourService} from './connect-four.service';

describe('Service: ConnectFour', () => {
    beforeEach(() => {
        addProviders([ConnectFourService]);
    });

    it('should ...', inject([ConnectFourService], (service: ConnectFourService) => {
        expect(service).toBeTruthy();
    }));


    it('Should return an instance of a game', inject([ConnectFourService], (service: ConnectFourService) => {
        expect(service.getGame()).toBeTruthy();
    }));

    it('Should create a new instance of a game', inject([ConnectFourService], (service: ConnectFourService) => {
        let oldGame = service.getGame();
        oldGame.playAtColumn(1);
        oldGame.playAtColumn(1);
        service.resetGame();
        let newGame = service.getGame();
        expect(newGame.moveCount).toEqual(0);
    }));

});
