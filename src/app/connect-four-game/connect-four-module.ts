import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnectFourComponent} from './connect-four/connect-four.component';
import {ConnectFourService} from './connect-four.service';

@NgModule({
    imports: [CommonModule],
    declarations: [ConnectFourComponent],
    exports: [ConnectFourComponent],
    providers: [ConnectFourService],
})
export class ConnectFourModule {
}
