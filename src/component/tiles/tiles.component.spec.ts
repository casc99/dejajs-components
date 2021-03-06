/*
 *  @license
 *  Copyright Hôpitaux Universitaires de Genève. All Rights Reserved.
 *
 *  Use of this source code is governed by an Apache-2.0 license that can be
 *  found in the LICENSE file at https://github.com/DSI-HUG/dejajs-components/blob/master/LICENSE
 */

import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';
import { DejaClipboardModule } from '../../common/core/clipboard/index';
import { Rect } from '../../common/core/graphics/rect';
import { DejaTilesModule } from './index';
import { IDejaTile } from './tile.interface';
import { DejaTilesLayoutProvider } from './tiles-layout.provider';
import { DejaTilesComponent } from './tiles.component';

@Component({
    encapsulation: ViewEncapsulation.None,
    template: `<deja-tiles id="tiles1" style="height: 500px;width: 400px;display: block;" [(models)]="tiles" canDelete canPaste canCut [designMode]="designMode" maxwidth="100%" tileminwidth="5%" tileminheight="5%" tilemaxheight="50%" tilemaxwidth="50%">
                    <ng-template #tileTemplate let-tile let-pressed="pressed" let-selected="selected">
                        <span style="width: 100%;height: 100%;display: block;" class="tile-content noselect" [style.background-color]="tile.templateModel.color" [attr.selected]="selected" [attr.pressed]="pressed">{{ tile.templateModel.name }}</span>
                    </ng-template>
                </deja-tiles>
                <deja-tiles id="tiles2" style="height: 500px;width: 400px;display: block;" canPaste canCopy [designMode]="designMode" maxwidth="100%" tileminwidth="5%" tileminheight="5%" tilemaxheight="50%" tilemaxwidth="50%">
                    <ng-template #tileTemplate let-tile let-pressed="pressed" let-selected="selected">
                        <span style="width: 100%;height: 100%;display: block;" class="tile-content noselect" [style.background-color]="tile.templateModel.color" [attr.selected]="selected" [attr.pressed]="pressed">{{ tile.templateModel.name }}</span>
                    </ng-template>
                </deja-tiles>`,
    styles: [`* { transition: unset !important; }
    deja-tiles {
        left: 100px;
        top: 100px;
    }`]
})
class DejaTilesContainerComponent {
    public fructs = [
        {
            name: 'Peach',
            color: '#FF6F00',
        },
        {
            name: 'Banana',
            color: '#FFEB3B',
        },
        {
            name: 'Cantaloupe',
            color: '#AED581',
        },
        {
            name: 'Cherries',
            color: '#880E4F',
        },
        {
            name: 'ChinesePears',
            color: '#F5F5F5',
        },
        {
            name: 'Cranberries',
            color: '#C2185B',
        },
        {
            name: 'Guava',
            color: '#FFCA28',
        },
        {
            name: 'Grapes',
            color: '#303F9F',
        },
        {
            name: 'Lemon',
            color: '#FFF176',
        },
        {
            name: 'Mango',
            color: '#FBC02D',
        },
        {
            name: 'Pineapple',
            color: '#FDD835',
        },
        {
            name: 'Watermelon',
            color: '#E91E63',
        },
    ] as any[];

    public tiles: IDejaTile[];

    public designMode = true;

    constructor() {
        let x = 0;
        let y = 0;

        this.tiles = this.fructs
            .map((fruct) => {
                const tile = {
                    bounds: new Rect(x, y, 30, 30),
                    id: fruct.name,
                    color: fruct.color,
                    templateModel: fruct,
                } as IDejaTile;

                x += 30;
                if (x + 30 > 100) {
                    x = 0;
                    y += 30;
                }

                return tile;
            });
    }

    public testDone() {
        return true;
    }
}

describe('DejaTilesComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DejaTilesContainerComponent,
            ],
            imports: [
                BrowserAnimationsModule,
                CommonModule,
                FormsModule,
                DejaTilesModule,
                DejaClipboardModule.forRoot(),
            ]
        }).compileComponents();
    }));

    const observeDom$ = (fixture: ComponentFixture<DejaTilesContainerComponent>) => {
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const layoutProvider = tilesDebugElement.injector.get(DejaTilesLayoutProvider) as DejaTilesLayoutProvider;
        return Observable.from(layoutProvider.layoutCompleted);
    };

    const sendMouseEvent = (element: EventTarget, type: string, pageX: number, pageY: number, buttons = 0) => {
        const eventInit = () => ({
            bubbles: true,
            cancelable: (type !== 'mousemove'),
            view: document.defaultView,
            altKey: false,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            button: 0,
            buttons: buttons,
            clientX: pageX,
            clientY: pageY,
            relatedTarget: element,
        } as MouseEventInit);
        const event = new MouseEvent(type, eventInit());
        element.dispatchEvent(event);
    };

    it('should create the component', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        fixture.detectChanges();
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance;
        expect(tilesInstance).toBeTruthy();
    }));

    it('should insert a new tile without bounds at the end', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;

        observeDom$(fixture)
            .first()
            .subscribe(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                expect(tileElements.length).toBe(13);
                const beerTile = tileElements.find((t) => t.nativeElement.id === 'Beer');
                expect(beerTile).toBeDefined();
                expect(beerTile.nativeElement.offsetTop).toBe(480);
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        tilesContainerInstance.tiles.unshift({
            id: 'Beer',
            color: '#FBC02D',
            templateModel: {
                name: 'Beer',
                color: '#FBC02D',
            },
        } as IDejaTile);

        tilesContainerInstance.tiles = [...tilesContainerInstance.tiles];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should select the specified tiles', async(() => {
        let pass = 0;
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;

        observeDom$(fixture)
            .subscribe(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile[selected="true"]'));
                switch (++pass) {
                    case 1:
                        expect(tileElements.length).toBe(0);
                        tilesInstance.selectedTiles = ['Peach', 'Cherries'];
                        tilesInstance.refresh();
                        break;

                    default:
                        tilesContainerInstance.testDone();
                        expect(tileElements.length).toBe(2);
                }
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should delete the selected tiles', async(() => {
        let pass = 0;
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;

        observeDom$(fixture)
            .subscribe(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                switch (++pass) {
                    case 1:
                        expect(tileElements.length).toBe(12);
                        tilesInstance.deleteSelection();
                        break;

                    default:
                        tilesContainerInstance.testDone();
                        expect(tileElements.length).toBe(10);
                }
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();
        tilesInstance.selectedTiles = ['Guava', 'Mango'];

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should change the cursor when mouse is over a tile', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendMouseEventRelative = (element: HTMLElement, type: string, x: number, y: number, buttons = 0) => {
            const bounds = element.getBoundingClientRect();
            sendMouseEvent(element, type, bounds.left + x, bounds.top + y, buttons);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .debounceTime(10)
            .map(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                const selectedTile = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile[selected="true"]'));
                const selectedElement = selectedTile.nativeElement as HTMLElement;

                expect(tileElements.length).toBe(12);
                expect(selectedTile).toBeDefined();

                sendMouseEventRelative(tilesContainerElement, 'mouseenter', 0, 0);

                sendMouseEventRelative(selectedElement, 'mousemove', 1, 1);
                return selectedElement;
            })
            .delay(20)
            .do((selectedElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('nw-resize');
                sendMouseEventRelative(selectedElement, 'mousemove', 60, 1);
            })
            .delay(20)
            .do((selectedElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('n-resize');
                sendMouseEventRelative(selectedElement, 'mousemove', 119, 1);
            })
            .delay(20)
            .do((selectedElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('ne-resize');
                sendMouseEventRelative(selectedElement, 'mousemove', 119, 60);
            })
            .delay(20)
            .do((selectedElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('e-resize');
                sendMouseEventRelative(selectedElement, 'mousemove', 119, 119);
            })
            .delay(20)
            .do((selectedElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('se-resize');
                sendMouseEventRelative(selectedElement, 'mousemove', 60, 119);
            })
            .delay(20)
            .do((selectedElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('s-resize');
                sendMouseEventRelative(selectedElement, 'mousemove', 1, 119);
            })
            .delay(20)
            .do((selectedElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('sw-resize');
                sendMouseEventRelative(selectedElement, 'mousemove', 1, 60);
            })
            .delay(20)
            .do((selectedElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('w-resize');
                sendMouseEventRelative(selectedElement, 'mousemove', 60, 60);
            })
            .delay(20)
            .do(() => {
                expect(tilesContainerElement.style.cursor).toBe('move');
                sendMouseEventRelative(tilesContainerElement, 'mousemove', 1, 1);
            })
            .delay(20)
            .subscribe(() => {
                expect(tilesContainerElement.style.cursor).toBe('');
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();
        tilesInstance.selectedTiles = ['Cherries'];

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should add and remove tiles', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .do(() => {
                tilesInstance.addTiles([{
                    bounds: new Rect(0, 0, 30, 30),
                    id: 'Litchi',
                    color: '#C2185B',
                    templateModel: {
                        name: 'Litchi',
                        color: '#C2185B',
                    },
                } as IDejaTile]);
            })
            .delay(20)
            .do(() => {
                fixture.detectChanges();
                const addedTile = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Litchi'));
                expect(addedTile).not.toBeNull();
            })
            .delay(10)
            .do(() => tilesInstance.removeTiles(['Cantaloupe', 'Guava']))
            .delay(20)
            .do(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                expect(tileElements.length).toBe(11);
            })
            .delay(10)
            .do(() => {
                // Get free place should return Cantaloupe place
                const rect = tilesInstance.getFreePlace(0, 0, 30, 30);
                expect(rect.left).toBe(60);
                expect(rect.top).toBe(0);
            })
            .subscribe(() => tilesContainerInstance.testDone());

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should add a group', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .do(() => tilesInstance.addGroup('Group1', new Rect(0, 0, 30, 10)))
            .delay(20)
            .do(() => {
                fixture.detectChanges();
                const addedGroup = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile > deja-tile-group'));
                expect(addedGroup).not.toBeNull();
            })
            .subscribe(() => tilesContainerInstance.testDone());

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should be able to expand a tile on mouse over when the content is too big', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .map(() => {
                fixture.detectChanges();

                const expandTileModel = tilesContainerInstance.tiles.find((tile) => tile.id === 'Banana');
                expandTileModel.templateModel.name = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br /> Mauris auctor sit amet odio et aliquet. Curabitur auctor eleifend mattis. <br /> Nullam sit amet quam tellus. Ut mattis tellus sed erat ultricies ornare. <br /> Nulla dictum nisi eu tortor lacinia porttitor. Donec eu arcu et enim cursus viverra. <br /> Praesent pulvinar dui nisi, a tincidunt arcu finibus sed.';

                tilesContainerInstance.designMode = false;
                fixture.detectChanges();

                return expandTileModel;
            })
            .delay(20)
            .do((expandTileModel: HTMLElement) => {
                tilesInstance.expandTile(expandTileModel, 200);
            })
            .delay(600)
            .do(() => {
                const sizeElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Banana'));
                const bounds = sizeElement.nativeElement.getBoundingClientRect();
                const testElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Pineapple'));
                const testBounds = testElement.nativeElement.getBoundingClientRect();
                const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();

                expect(bounds.left).toBe(tilesContainerBounds.left + 120);
                expect(bounds.top).toBe(tilesContainerBounds.top);
                expect(bounds.width).toBe(120);
                expect(bounds.height).toBe(200);
                expect(testBounds.left).toBe(tilesContainerBounds.left + 120);
                expect(testBounds.top).toBe(tilesContainerBounds.top + 440);
            })
            .delay(20)
            .do(() => {
                tilesInstance.cancelExpand();
            })
            .delay(600)
            .do(() => {
                const sizeElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Banana'));
                const bounds = sizeElement.nativeElement.getBoundingClientRect();
                const testElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Pineapple'));
                const testBounds = testElement.nativeElement.getBoundingClientRect();
                const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();

                expect(bounds.left).toBe(tilesContainerBounds.left + 120);
                expect(bounds.top).toBe(tilesContainerBounds.top);
                expect(bounds.width).toBe(120);
                expect(bounds.height).toBe(120);
                expect(testBounds.left).toBe(tilesContainerBounds.left + 120);
                expect(testBounds.top).toBe(tilesContainerBounds.top + 360);
            })
            .subscribe(() => {
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should cut, copy and paste the selected tiles', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tiles1DebugElement = fixture.debugElement.query(By.css('deja-tiles#tiles1'));
        const tiles1Instance = tiles1DebugElement.componentInstance as DejaTilesComponent;
        const tiles2DebugElement = fixture.debugElement.query(By.css('deja-tiles#tiles2'));
        const tiles2Instance = tiles2DebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendKeyUp = (element: EventTarget, code: string, ctrlKey: boolean) => {
            const event = new KeyboardEvent('keyup', {
                code: `Key${code.toUpperCase()}`,
                key: code,
                ctrlKey: ctrlKey,
            } as KeyboardEventInit);
            element.dispatchEvent(event);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .first()
            .do(() => sendKeyUp(tilesContainerElement.ownerDocument, 'X', true))
            .delay(1)
            .do(() => {
                const cuttedElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile[cutted="true"]'));
                expect(cuttedElements.length).toBe(0);
                const elements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles2 > #tiles > deja-tile'));
                expect(elements.length).toBe(0);
                tiles1Instance.onFocus();
            })
            .delay(1)
            .do(() => sendKeyUp(tilesContainerElement.ownerDocument, 'X', true))
            .delay(1)
            .do(() => {
                const cuttedElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile[cutted="true"]'));
                expect(cuttedElements.length).toBe(2);
                tiles1Instance.onBlur();
                tiles2Instance.onFocus();
            })
            .delay(1)
            .do(() => sendKeyUp(tilesContainerElement.ownerDocument, 'V', true))
            .delay(20)
            .do(() => {
                const cuttedElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile[cutted="true"]'));
                expect(cuttedElements.length).toBe(0);
                tiles2Instance.refresh();
            })
            .delay(1)
            .do(() => {
                const elements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles2 > #tiles > deja-tile'));
                expect(elements.length).toBe(2);
                tiles2Instance.selectedTiles = tiles2Instance.tiles$.getValue().map((tile) => tile.id);
            })
            .delay(1)
            .do(() => sendKeyUp(tilesContainerElement.ownerDocument, 'C', true))
            .delay(1)
            .do(() => {
                tiles2Instance.onBlur();
                tiles1Instance.onFocus();
            })
            .delay(1)
            .do(() => sendKeyUp(tilesContainerElement.ownerDocument, 'V', true))
            .delay(20)
            .do(() => {
                tiles1Instance.refresh();
                tiles2Instance.refresh();
            })
            .delay(1)
            .subscribe(() => {
                const elements1 = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                expect(elements1.length).toBe(12);
                const elements2 = fixture.debugElement.queryAll(By.css('deja-tiles#tiles2 > #tiles > deja-tile'));
                expect(elements2.length).toBe(2);
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();
        tiles1Instance.selectedTiles = ['Guava', 'Mango'];

        fixture.whenStable().then(() => {
            tiles1Instance.refresh();
            tiles1Instance.onBlur();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should invert two tiles when a tile is drag and dropped into another', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendMouseEventRelative = (element: EventTarget, type: string, x: number, y: number, buttons = 0) => {
            const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
            sendMouseEvent(element, type, tilesContainerBounds.left + x, tilesContainerBounds.top + y, buttons);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .map(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                const dragTile = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Peach'));

                const dragElement = dragTile.nativeElement as HTMLElement;

                expect(tileElements.length).toBe(12);
                expect(dragElement).toBeDefined();
                sendMouseEventRelative(tilesContainerElement, 'mouseenter', 0, 0);

                sendMouseEventRelative(dragElement, 'mousemove', 60, 60);
                fixture.detectChanges();
                return dragElement;
            })
            .delay(20)
            .do((dragElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('move');
                sendMouseEventRelative(dragElement, 'mousedown', 60, 60, 1);
            })
            .delay(20)
            .do((dragElement: HTMLElement) => {
                // Start drag
                sendMouseEventRelative(dragElement, 'mousemove', 70, 70, 1);
            })
            .delay(20)
            .do((dragElement: HTMLElement) => {
                // Drag on another tile
                sendMouseEventRelative(dragElement, 'mousemove', 190, 190, 1);
            })
            .delay(600)
            .do((dragElement: HTMLElement) => {
                // Drop
                sendMouseEventRelative(dragElement.ownerDocument, 'mouseup', 190, 190, 0);
            })
            .delay(10)
            .do((dragElement: HTMLElement) => {
                const bounds = dragElement.getBoundingClientRect();
                const invertedElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#ChinesePears'));
                const invertedBounds = invertedElement.nativeElement.getBoundingClientRect();
                const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();

                expect(bounds.left).toBe(tilesContainerBounds.left + 120);
                expect(bounds.top).toBe(tilesContainerBounds.top + 120);
                expect(invertedBounds.left).toBe(tilesContainerBounds.left);
                expect(invertedBounds.top).toBe(tilesContainerBounds.top);
            })
            .delay(20)
            .subscribe(() => {
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should be able to size a tile with the mouse from the right border', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendMouseEventRelative = (element: EventTarget, type: string, x: number, y: number, buttons = 0) => {
            const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
            sendMouseEvent(element, type, tilesContainerBounds.left + x, tilesContainerBounds.top + y, buttons);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .map(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                const sizeTile = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Peach'));

                const sizeElement = sizeTile.nativeElement as HTMLElement;

                expect(tileElements.length).toBe(12);
                expect(sizeElement).toBeDefined();
                sendMouseEventRelative(tilesContainerElement, 'mouseenter', 0, 0);

                return sizeElement;
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                sendMouseEventRelative(sizeElement, 'mousemove', 119, 60);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('e-resize');
                // Start size
                sendMouseEventRelative(sizeElement, 'mousedown', 119, 60, 1);
            })
            .delay(20)
            .do((dragElement: HTMLElement) => {
                // Start drag
                sendMouseEventRelative(dragElement, 'mousemove', 129, 60, 1);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                // Size on left
                sendMouseEventRelative(sizeElement, 'mousemove', 240, 60, 1);
            })
            .delay(600)
            .do((sizeElement: HTMLElement) => {
                // Drop
                sendMouseEventRelative(sizeElement.ownerDocument, 'mouseup', 240, 60, 0);
            })
            .do((sizeElement: HTMLElement) => {
                const bounds = sizeElement.getBoundingClientRect();
                const testElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Pineapple'));
                const testBounds = testElement.nativeElement.getBoundingClientRect();
                const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
                expect(bounds.left).toBe(tilesContainerBounds.left);
                expect(bounds.top).toBe(tilesContainerBounds.top);
                expect(bounds.width).toBe(200);
                expect(bounds.height).toBe(120);
                expect(testBounds.left).toBe(tilesContainerBounds.left + 120);
                expect(testBounds.top).toBe(tilesContainerBounds.top + 480);
            })
            .delay(20)
            .subscribe(() => {
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should be able to size a tile with the mouse from the left border', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendMouseEventRelative = (element: EventTarget, type: string, x: number, y: number, buttons = 0) => {
            const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
            sendMouseEvent(element, type, tilesContainerBounds.left + x, tilesContainerBounds.top + y, buttons);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .map(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                const sizeTile = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Cantaloupe'));

                const sizeElement = sizeTile.nativeElement as HTMLElement;

                expect(tileElements.length).toBe(12);
                expect(sizeElement).toBeDefined();
                sendMouseEventRelative(tilesContainerElement, 'mouseenter', 0, 0);

                return sizeElement;
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                sendMouseEventRelative(sizeElement, 'mousemove', 241, 60);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('w-resize');
                // Start size
                sendMouseEventRelative(sizeElement, 'mousedown', 241, 60, 1);
            })
            .delay(20)
            .do((dragElement: HTMLElement) => {
                // Start drag
                sendMouseEventRelative(dragElement, 'mousemove', 231, 60, 1);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                // Size on left
                sendMouseEventRelative(sizeElement, 'mousemove', 0, 60, 1);
            })
            .delay(600)
            .do((sizeElement: HTMLElement) => {
                // Drop
                sendMouseEventRelative(sizeElement.ownerDocument, 'mouseup', 0, 60, 0);
            })
            .do((sizeElement: HTMLElement) => {
                const bounds = sizeElement.getBoundingClientRect();
                const testElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Pineapple'));
                const testBounds = testElement.nativeElement.getBoundingClientRect();
                const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
                expect(bounds.left).toBe(tilesContainerBounds.left + 160);
                expect(bounds.top).toBe(tilesContainerBounds.top);
                expect(bounds.width).toBe(200);
                expect(bounds.height).toBe(120);
                expect(testBounds.left).toBe(tilesContainerBounds.left + 120);
                expect(testBounds.top).toBe(tilesContainerBounds.top + 480);
            })
            .delay(20)
            .subscribe(() => {
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should be able to size a tile with the mouse from the bottom border', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendMouseEventRelative = (element: EventTarget, type: string, x: number, y: number, buttons = 0) => {
            const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
            sendMouseEvent(element, type, tilesContainerBounds.left + x, tilesContainerBounds.top + y, buttons);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .map(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                const sizeTile = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Banana'));

                const sizeElement = sizeTile.nativeElement as HTMLElement;

                expect(tileElements.length).toBe(12);
                expect(sizeElement).toBeDefined();
                sendMouseEventRelative(tilesContainerElement, 'mouseenter', 0, 0);

                return sizeElement;
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                sendMouseEventRelative(sizeElement, 'mousemove', 180, 119);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('s-resize');
                // Start size
                sendMouseEventRelative(sizeElement, 'mousedown', 180, 119, 1);
            })
            .delay(20)
            .do((dragElement: HTMLElement) => {
                // Start drag
                sendMouseEventRelative(dragElement, 'mousemove', 180, 129, 1);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                // Size on left
                sendMouseEventRelative(sizeElement, 'mousemove', 180, 150, 1);
            })
            .delay(600)
            .do((sizeElement: HTMLElement) => {
                // Drop
                sendMouseEventRelative(sizeElement.ownerDocument, 'mouseup', 180, 150, 0);
            })
            .do((sizeElement: HTMLElement) => {
                const bounds = sizeElement.getBoundingClientRect();
                const testElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Pineapple'));
                const testBounds = testElement.nativeElement.getBoundingClientRect();
                const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
                expect(bounds.left).toBe(tilesContainerBounds.left + 120);
                expect(bounds.top).toBe(tilesContainerBounds.top);
                expect(bounds.width).toBe(120);
                expect(bounds.height).toBe(141);
                expect(testBounds.left).toBe(tilesContainerBounds.left + 120);
                expect(testBounds.top).toBe(tilesContainerBounds.top + 380);
            })
            .delay(20)
            .subscribe(() => {
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should be able to size a tile with the mouse from the top border', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendMouseEventRelative = (element: EventTarget, type: string, x: number, y: number, buttons = 0) => {
            const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
            sendMouseEvent(element, type, tilesContainerBounds.left + x, tilesContainerBounds.top + y, buttons);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .map(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                const sizeTile = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Grapes'));

                const sizeElement = sizeTile.nativeElement as HTMLElement;

                expect(tileElements.length).toBe(12);
                expect(sizeElement).toBeDefined();
                sendMouseEventRelative(tilesContainerElement, 'mouseenter', 0, 0);

                return sizeElement;
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                sendMouseEventRelative(sizeElement, 'mousemove', 180, 241);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('n-resize');
                // Start size
                sendMouseEventRelative(sizeElement, 'mousedown', 180, 241, 1);
            })
            .delay(20)
            .do((dragElement: HTMLElement) => {
                // Start drag
                sendMouseEventRelative(dragElement, 'mousemove', 180, 231, 1);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                // Size on left
                sendMouseEventRelative(sizeElement, 'mousemove', 180, 200, 1);
            })
            .delay(600)
            .do((sizeElement: HTMLElement) => {
                // Drop
                sendMouseEventRelative(sizeElement.ownerDocument, 'mouseup', 180, 200, 0);
            })
            .do((sizeElement: HTMLElement) => {
                const bounds = sizeElement.getBoundingClientRect();
                const testElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Pineapple'));
                const testBounds = testElement.nativeElement.getBoundingClientRect();
                const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
                expect(bounds.left).toBe(tilesContainerBounds.left + 120);
                expect(bounds.top).toBe(tilesContainerBounds.top + 209);
                expect(bounds.width).toBe(120);
                expect(bounds.height).toBe(151);
                expect(testBounds.left).toBe(tilesContainerBounds.left + 120);
                expect(testBounds.top).toBe(tilesContainerBounds.top + 400);
            })
            .delay(20)
            .subscribe(() => {
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should be able to size a tile with the mouse from the bottom right corner', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendMouseEventRelative = (element: EventTarget, type: string, x: number, y: number, buttons = 0) => {
            const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
            sendMouseEvent(element, type, tilesContainerBounds.left + x, tilesContainerBounds.top + y, buttons);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .map(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                const sizeTile = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Peach'));

                const sizeElement = sizeTile.nativeElement as HTMLElement;

                expect(tileElements.length).toBe(12);
                expect(sizeElement).toBeDefined();
                sendMouseEventRelative(tilesContainerElement, 'mouseenter', 0, 0);

                return sizeElement;
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                sendMouseEventRelative(sizeElement, 'mousemove', 119, 119);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('se-resize');
                // Start size
                sendMouseEventRelative(sizeElement, 'mousedown', 119, 119, 1);
            })
            .delay(20)
            .do((dragElement: HTMLElement) => {
                // Start drag
                sendMouseEventRelative(dragElement, 'mousemove', 129, 129, 1);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                // Size on left
                sendMouseEventRelative(sizeElement, 'mousemove', 240, 240, 1);
            })
            .delay(600)
            .do((sizeElement: HTMLElement) => {
                // Drop
                sendMouseEventRelative(sizeElement.ownerDocument, 'mouseup', 240, 240, 0);
            })
            .do((sizeElement: HTMLElement) => {
                const bounds = sizeElement.getBoundingClientRect();
                const testElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Pineapple'));
                const testBounds = testElement.nativeElement.getBoundingClientRect();
                const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
                expect(bounds.left).toBe(tilesContainerBounds.left);
                expect(bounds.top).toBe(tilesContainerBounds.top);
                expect(bounds.width).toBe(200);
                expect(bounds.height).toBe(200);
                expect(testBounds.left).toBe(tilesContainerBounds.left + 120);
                expect(testBounds.top).toBe(tilesContainerBounds.top + 560);
            })
            .delay(20)
            .subscribe(() => {
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should be able to size a tile with the mouse from the top right corner', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendMouseEventRelative = (element: EventTarget, type: string, x: number, y: number, buttons = 0) => {
            const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
            sendMouseEvent(element, type, tilesContainerBounds.left + x, tilesContainerBounds.top + y, buttons);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .map(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                const sizeTile = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Grapes'));

                const sizeElement = sizeTile.nativeElement as HTMLElement;

                expect(tileElements.length).toBe(12);
                expect(sizeElement).toBeDefined();
                sendMouseEventRelative(tilesContainerElement, 'mouseenter', 0, 0);

                return sizeElement;
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                sendMouseEventRelative(sizeElement, 'mousemove', 239, 241);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('ne-resize');
                // Start size
                sendMouseEventRelative(sizeElement, 'mousedown', 239, 241, 1);
            })
            .delay(20)
            .do((dragElement: HTMLElement) => {
                // Start drag
                sendMouseEventRelative(dragElement, 'mousemove', 249, 231, 1);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                // Size on left
                sendMouseEventRelative(sizeElement, 'mousemove', 300, 200, 1);
            })
            .delay(600)
            .do((sizeElement: HTMLElement) => {
                // Drop
                sendMouseEventRelative(sizeElement.ownerDocument, 'mouseup', 300, 200, 0);
            })
            .do((sizeElement: HTMLElement) => {
                const bounds = sizeElement.getBoundingClientRect();
                const testElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Pineapple'));
                const testBounds = testElement.nativeElement.getBoundingClientRect();
                const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
                expect(bounds.left).toBe(tilesContainerBounds.left + 120);
                expect(bounds.top).toBe(tilesContainerBounds.top + 209);
                expect(bounds.width).toBe(171);
                expect(bounds.height).toBe(151);
                expect(testBounds.left).toBe(tilesContainerBounds.left + 120);
                expect(testBounds.top).toBe(tilesContainerBounds.top + 520);
            })
            .delay(20)
            .subscribe(() => {
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should be able to size a tile with the mouse from the top left corner', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendMouseEventRelative = (element: EventTarget, type: string, x: number, y: number, buttons = 0) => {
            const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
            sendMouseEvent(element, type, tilesContainerBounds.left + x, tilesContainerBounds.top + y, buttons);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .map(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                const sizeTile = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Lemon'));

                const sizeElement = sizeTile.nativeElement as HTMLElement;

                expect(tileElements.length).toBe(12);
                expect(sizeElement).toBeDefined();
                sendMouseEventRelative(tilesContainerElement, 'mouseenter', 0, 0);

                return sizeElement;
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                sendMouseEventRelative(sizeElement, 'mousemove', 241, 241);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('nw-resize');
                // Start size
                sendMouseEventRelative(sizeElement, 'mousedown', 241, 241, 1);
            })
            .delay(20)
            .do((dragElement: HTMLElement) => {
                // Start drag
                sendMouseEventRelative(dragElement, 'mousemove', 231, 231, 1);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                // Size on left
                sendMouseEventRelative(sizeElement, 'mousemove', 200, 200, 1);
            })
            .delay(600)
            .do((sizeElement: HTMLElement) => {
                // Drop
                sendMouseEventRelative(sizeElement.ownerDocument, 'mouseup', 200, 200, 0);
            })
            .do((sizeElement: HTMLElement) => {
                const bounds = sizeElement.getBoundingClientRect();
                const testElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Watermelon'));
                const testBounds = testElement.nativeElement.getBoundingClientRect();
                const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
                expect(bounds.left).toBe(tilesContainerBounds.left + 209);
                expect(bounds.top).toBe(tilesContainerBounds.top + 209);
                expect(bounds.width).toBe(151);
                expect(bounds.height).toBe(151);
                expect(testBounds.left).toBe(tilesContainerBounds.left + 240);
                expect(testBounds.top).toBe(tilesContainerBounds.top + 400);
            })
            .delay(20)
            .subscribe(() => {
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should be able to size a tile with the mouse from the bottom left corner', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendMouseEventRelative = (element: EventTarget, type: string, x: number, y: number, buttons = 0) => {
            const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
            sendMouseEvent(element, type, tilesContainerBounds.left + x, tilesContainerBounds.top + y, buttons);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .map(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));
                const sizeTile = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Lemon'));

                const sizeElement = sizeTile.nativeElement as HTMLElement;

                expect(tileElements.length).toBe(12);
                expect(sizeElement).toBeDefined();
                sendMouseEventRelative(tilesContainerElement, 'mouseenter', 0, 0);

                return sizeElement;
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                sendMouseEventRelative(sizeElement, 'mousemove', 241, 359);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                expect(tilesContainerElement.style.cursor).toBe('sw-resize');
                // Start size
                sendMouseEventRelative(sizeElement, 'mousedown', 241, 359, 1);
            })
            .delay(20)
            .do((dragElement: HTMLElement) => {
                // Start drag
                sendMouseEventRelative(dragElement, 'mousemove', 231, 369, 1);
            })
            .delay(20)
            .do((sizeElement: HTMLElement) => {
                // Size on left
                sendMouseEventRelative(sizeElement, 'mousemove', 200, 400, 1);
            })
            .delay(600)
            .do((sizeElement: HTMLElement) => {
                // Drop
                sendMouseEventRelative(sizeElement.ownerDocument, 'mouseup', 200, 400, 0);
            })
            .do((sizeElement: HTMLElement) => {
                const bounds = sizeElement.getBoundingClientRect();
                const testElement = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles > deja-tile#Watermelon'));
                const testBounds = testElement.nativeElement.getBoundingClientRect();
                const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
                expect(bounds.left).toBe(tilesContainerBounds.left + 209);
                expect(bounds.top).toBe(tilesContainerBounds.top + 240);
                expect(bounds.width).toBe(151);
                expect(bounds.height).toBe(151);
                expect(testBounds.left).toBe(tilesContainerBounds.left + 240);
                expect(testBounds.top).toBe(tilesContainerBounds.top + 400);
            })
            .delay(20)
            .subscribe(() => {
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));

    it('should select by drag and drop with the mouse', async(() => {
        const fixture = TestBed.createComponent(DejaTilesContainerComponent);
        const tilesContainerInstance = fixture.componentInstance as DejaTilesContainerComponent;
        const tilesDebugElement = fixture.debugElement.query(By.directive(DejaTilesComponent));
        const tilesInstance = tilesDebugElement.componentInstance as DejaTilesComponent;
        const tilesContainer = fixture.debugElement.query(By.css('deja-tiles#tiles1 > #tiles'));
        const tilesContainerElement = tilesContainer.nativeElement as HTMLElement;

        const sendMouseEventRelative = (element: EventTarget, type: string, x: number, y: number, buttons = 0) => {
            const tilesContainerBounds = tilesContainerElement.getBoundingClientRect();
            sendMouseEvent(element, type, tilesContainerBounds.left + x, tilesContainerBounds.top + y, buttons);
            fixture.detectChanges();
        };

        observeDom$(fixture)
            .debounceTime(10)
            .first()
            .map(() => {
                fixture.detectChanges();
                const tileElements = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile'));

                expect(tileElements.length).toBe(12);
                sendMouseEventRelative(tilesContainerElement, 'mouseenter', 0, 0);
            })
            .delay(20)
            .do(() => {
                sendMouseEventRelative(tilesContainerElement, 'mousemove', 365, 20);
            })
            .delay(20)
            .do(() => {
                expect(tilesContainerElement.style.cursor).toBe('');
                // Start selection
                sendMouseEventRelative(tilesContainerElement, 'mousedown', 365, 20, 1);
            })
            .delay(20)
            .do(() => {
                // Select
                sendMouseEventRelative(tilesContainerElement, 'mousemove', 20, 230, 1);
            })
            .delay(20)
            .do(() => {
                // Drop
                sendMouseEventRelative(tilesContainerElement.ownerDocument, 'mouseup', 20, 230, 0);
            })
            .subscribe(() => {
                const selectedTiles = fixture.debugElement.queryAll(By.css('deja-tiles#tiles1 > #tiles > deja-tile[selected="true"]'));
                expect(selectedTiles.length).toBe(6);
                tilesContainerInstance.testDone();
            });

        spyOn(tilesContainerInstance, 'testDone');

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            tilesInstance.refresh();
            expect(tilesContainerInstance.testDone).toHaveBeenCalled();
        });
    }));
});
