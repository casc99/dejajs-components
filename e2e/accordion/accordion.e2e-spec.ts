/*
 *  @license
 *  Copyright Hôpitaux Universitaires de Genève. All Rights Reserved.
 *
 *  Use of this source code is governed by an Apache-2.0 license that can be
 *  found in the LICENSE file at https://github.com/DSI-HUG/dejajs-components/blob/master/LICENSE
 */

// import { by, element, browser } from 'protractor';
import { Util } from '../util/index';
import { AccordionPage } from './accordion.po';

describe('Accordion component', () => {
    let page: AccordionPage;

    beforeEach(() => {
        Util.init();
        page = new AccordionPage();
    });

    // it('all accordion should be opening on click', () => {
    //     page.navigateTo();
    //     element.all(by.css('deja-accordion-group')).each((item) => {
    //         const header = item.element(by.css('deja-accordion-header'));
    //         const body = item.element(by.css('deja-accordion-body'));

    //         expect(page.headerIsOpen(body)).toBe(false);
    //         page.openHeader(header);
    //         page.headerIsOpenAfterAnimation(body).then((resp) => {
    //             expect(resp).toBe(true);
    //         });
    //     });

    // });
});
