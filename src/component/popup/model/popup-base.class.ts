/*
 *  @license
 *  Copyright Hôpitaux Universitaires de Genève. All Rights Reserved.
 *
 *  Use of this source code is governed by an Apache-2.0 license that can be
 *  found in the LICENSE file at https://github.com/DSI-HUG/dejajs-components/blob/master/LICENSE
 */
import { ComponentPortal, Portal } from '@angular/cdk/portal';
import { ElementRef, Injector, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { DejaPopupAction } from './popup-action.model';
import { DejaPopupConfig } from './popup-config.model';

export abstract class DejaPopupBase implements OnInit {

    public actions: DejaPopupAction[];
    public actionSelected: DejaPopupAction;
    public isMinified = false;
    public isFullscreen = false;
    public dialogRef: MatDialogRef<DejaPopupBase>;
    public config: DejaPopupConfig;
    public actionsPortal: Portal<any>;
    protected injector: Injector;
    protected renderer?: Renderer2;
    protected elRef?: ElementRef;
    protected unlisten?;

    private aSub: Subscription[];

    public abstract doAction(action: DejaPopupAction): any;

    public ngOnInit() {
        this.aSub = [];
        this.dialogRef.beforeClose()
            .first()
            .do(() => {
                if (this.unlisten) {
                    this.unlisten();
                }

                this.destroy();

                if (this.config.dejaPopupCom$) {
                    const action = new DejaPopupAction('dialog-close', 'popup-tray');
                    this.config.dejaPopupCom$.next(action);
                }
            })
            .subscribe();

        if (this.config.actionComponentRef) {
            this.actionsPortal = new ComponentPortal(this.config.actionComponentRef, undefined, this.injector);
        }

        if (this.config.dejaPopupCom$) {
            this.aSub.push(
                this.config.dejaPopupCom$
                    .filter((a: DejaPopupAction) => !!a && !!a.target && a.target === this.config.id)
                    .do((a: DejaPopupAction) => this.doAction(a))
                    .do((action: DejaPopupAction) => {
                        this.actionSelected = action;
                        if (action.isFinalAction) {
                            this.dialogRef.close(action);
                        }
                    })
                    .subscribe()
            );
        }
    }

    public dispatchAction(action: DejaPopupAction) {

        if (!action) {
            return false;
        }

        if (this.config.dejaPopupCom$) {
            this.config.dejaPopupCom$.next(action);
        }

    }

    protected destroy() {
        this.aSub.forEach((s: Subscription) => s.unsubscribe());
    }

}
