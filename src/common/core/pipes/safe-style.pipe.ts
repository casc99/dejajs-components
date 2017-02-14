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

import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Just for testing
 *
 * @deprecated
 */
@Pipe({ name: 'safeStyle' })
export class SafeStylePipe {
    constructor(private sanitizer: DomSanitizer) {
        this.sanitizer = sanitizer;
    }

    public transform(style) {
        return this.sanitizer.bypassSecurityTrustStyle(style);
    }
}
