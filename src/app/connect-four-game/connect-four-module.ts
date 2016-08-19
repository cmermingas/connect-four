import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnectFourComponent} from './connect-four/connect-four.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ConnectFourComponent],
    exports: [ConnectFourComponent],
    providers: [],
})
export class ConnectFourModule {
}
