/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {ChangeDetectorRef} from '@angular/core';

describe('App: ConnectFourWebpack', () => {
  beforeEach(() => {
    addProviders([AppComponent, ChangeDetectorRef]);
  });

  it('should create the app',
    inject([AppComponent], (app: AppComponent) => {
      expect(app).toBeTruthy();
    }));
});
