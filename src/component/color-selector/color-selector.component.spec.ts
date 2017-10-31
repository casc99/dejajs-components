/*
 *  @license
 *  Copyright Hôpitaux Universitaires de Genève. All Rights Reserved.
 *
 *  Use of this source code is governed by an Apache-2.0 license that can be
 *  found in the LICENSE file at https://github.com/DSI-HUG/dejajs-components/blob/master/LICENSE
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '../../common/core/graphics/color';
import { DejaColorSelectorComponent } from './color-selector.component';

describe('DejaColorSelectorComponent', () => {
    const blue: Color = Color.fromHex('#5A98DD');
    const white: Color = Color.fromHex('#FFFFFF');
    const red: Color = Color.fromHex('#E0305B');
    const green: Color = Color.fromHex('#51A143');

    let component: DejaColorSelectorComponent;
    let fixture: ComponentFixture<DejaColorSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DejaColorSelectorComponent
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        }).compileComponents();

        fixture = TestBed.createComponent(DejaColorSelectorComponent);
        component = fixture.componentInstance;
    }));

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    describe('set colors', () => {
        it('should initialize colors', () => {
            component.colors = [blue, white, red];
            fixture.detectChanges();

            component.colorFabs$.subscribe((colorFabs) => {
                expect(colorFabs.length).toEqual(3);

                expect(colorFabs[0].color.toHex()).toEqual('#5A98DD');
                expect(colorFabs[1].color.toHex()).toEqual('#FFFFFF');
                expect(colorFabs[2].color.toHex()).toEqual('#E0305B');

                colorFabs.forEach((colorFab) => {
                    expect(colorFab.disabled).toBeFalsy();
                });
            });
        });

        it('should set active first colorFab', () => {
            component.colors = [blue, white, red];
            fixture.detectChanges();

            component.colorFabs$.subscribe((colorFabs) => {
                expect(colorFabs.length).toEqual(3);

                expect(colorFabs[0].active).toBeTruthy();
                expect(colorFabs[1].active).toBeFalsy();
                expect(colorFabs[2].active).toBeFalsy();
            });
        });

        it('should set all colorFabs disabled if component disabled', () => {
            component.disabled = true;
            component.colors = [blue, white, red];
            fixture.detectChanges();

            component.colorFabs$.subscribe((colorFabs) => {
                expect(colorFabs.length).toEqual(3);

                colorFabs.forEach((colorFab) => {
                    expect(colorFab.disabled).toBeTruthy();
                });
            });
        });
    });

    describe('set selected color', () => {
        it('selected color should be active', () => {
            component.colors = [blue, white, red];
            fixture.detectChanges();
            component.selectedColor = red;
            fixture.detectChanges();

            component.colorFabs$.subscribe((colorFabs) => {
                expect(colorFabs.length).toEqual(3);

                expect(colorFabs[0].active).toBeFalsy();
                expect(colorFabs[1].active).toBeFalsy();
                expect(colorFabs[2].active).toBeTruthy();
            });
        });

        it('should active first if color not exists', () => {
            component.colors = [blue, white, red];
            fixture.detectChanges();
            // Select the last color to change active flag before testing
            component.selectedColor = red;
            fixture.detectChanges();
            component.selectedColor = green;
            fixture.detectChanges();

            component.colorFabs$.subscribe((colorFabs) => {
                expect(colorFabs.length).toEqual(3);

                expect(colorFabs[0].active).toBeTruthy();
                expect(colorFabs[1].active).toBeFalsy();
                expect(colorFabs[2].active).toBeFalsy();
            });
        });
    });

});
