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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { DejaEditableDirective  } from './index';

@NgModule({
    declarations: [DejaEditableDirective],
    exports: [DejaEditableDirective],
    imports: [
        CommonModule,
        FormsModule,
    ],
})
export class DejaEditableModule { }
