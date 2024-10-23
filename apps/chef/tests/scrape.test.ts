// @vitest-environment node
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { getStyleFromPage } from '../server/utils/scrape';
import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';

describe('scrape', () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: false });
        return () => {
            browser.close();
        };
    });

    beforeEach(async () => {
        page = await browser.newPage();

        return () => {
            page.close();
        };
    });

    it('fanka', async () => {
        await page.goto('https://www.fanka.com/', { waitUntil: 'domcontentloaded' });

        const result = await getStyleFromPage(page);

        expect(result.buttonColor).toEqual('rgb(212, 62, 98)');
        expect(result.backgroundColor).toEqual('rgb(255, 255, 255)');
        expect(result.fontFamily).toEqual('Montserrat, sans-serif');
    });

    it('jessemade', async () => {
        await page.goto('https://www.jessemade.fr', { waitUntil: 'domcontentloaded' });

        const result = await getStyleFromPage(page);

        expect(result.buttonColor).toEqual('rgb(255, 117, 81)');
        expect(result.backgroundColor).toEqual('rgb(244, 247, 251)');
    });

    it('xtool', async () => {
        await page.goto('https://www.xtool.com/', { waitUntil: 'domcontentloaded' });

        const result = await getStyleFromPage(page);

        expect(result.buttonColor).toEqual('rgb(0, 198, 1)');
        expect(result.backgroundColor).toEqual('rgb(255, 255, 255)');
    });

    it('popilush', async () => {
        await page.goto('https://www.popilush.com/', { waitUntil: 'domcontentloaded' });

        const result = await getStyleFromPage(page);

        expect(result.buttonColor).toEqual('rgb(0, 0, 0)');
        expect(result.backgroundColor).toEqual('rgb(255, 255, 255)');
    });

    it('vivaia', async () => {
        try {
            await page.goto('https://vivaia.jp/', { waitUntil: 'domcontentloaded' });
        } catch {}

        const result = await getStyleFromPage(page);

        expect(result.buttonColor).toEqual('rgb(128, 76, 26)');
        expect(result.backgroundColor).toEqual('rgb(255, 255, 255)');
    });
});
