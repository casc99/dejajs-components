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

import { Pipe, PipeTransform } from '@angular/core';

/**
 * @deprecated
 */
@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
    public transform(value, args: string[]): any {
        return Object.keys(value).map(key => value[key]);
    }
}
