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

import { Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'stringToDateFormat' })
export class StringToDateFormatPipe implements PipeTransform {
    public transform(dateString, format: string): any {
        return moment(dateString, 'DD.MM.YYYY HH:mm:ss').format(format);
    }
}