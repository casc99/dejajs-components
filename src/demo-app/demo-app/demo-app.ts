/*
 * *
 *  @license
 *  Copyright Hôpital Universitaire de Genève All Rights Reserved.
 *
 *  Use of this source code is governed by an Apache-2.0 license that can be
 *  found in the LICENSE file at https://github.com/DSI-HUG/deja-js/blob/master/LICENSE
 * /
 *
 */

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'demo-app',
    styleUrls: ['./demo-app.scss', '../../scss/index.scss'],
    templateUrl: './demo-app.html',
})
export class DemoApp {
    public version: string;

    constructor() {

    }

    get debug() {
        // console.log('Binding ' + Date.now());
        return null;
    }
}
