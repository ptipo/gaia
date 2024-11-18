import { Page, Browser } from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { getRandom } from 'random-useragent';

const GRAY_THRESHOLD = 30;

const getGrayValue = (r: string, g: string, b: string) => {
    return 0.299 * parseInt(r, 10) + 0.587 * parseInt(g, 10) + 0.114 * parseInt(b, 10);
};

const isColour = (r: string, g: string, b: string) => {
    const grayscale = getGrayValue(r, g, b);
    return grayscale < 255 - GRAY_THRESHOLD && grayscale > GRAY_THRESHOLD;
};

const isBlack = (color: string) => {
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length !== 3) {
        return false;
    }
    const grayscale = getGrayValue(rgb[0], rgb[1], rgb[2]);
    return grayscale <= GRAY_THRESHOLD;
};

async function getBrowser() {
    console.log('process.env.VERCEL_ENV:', process.env.VERCEL_ENV);

    if (process.env.VERCEL_ENV) {
        const executablePath = await chromium.executablePath();
        const browser = await puppeteerCore.launch({
            args: [...chromium.args, `--user-agent=${getRandom()}`],
            defaultViewport: chromium.defaultViewport,
            executablePath,
            headless: chromium.headless,
        });
        return browser;
    } else {
        const puppeteer = await import('puppeteer').then((mod) => mod.default);
        const browser = await puppeteer.launch({
            args: [`--user-agent=${getRandom()}`],
        });
        return browser;
    }
}

export async function getWebsiteStyle(url: string) {
    const browser = (await getBrowser()) as Browser;
    const page = await browser.newPage();
    let normalizedUrl: URL;
    let result = null;

    try {
        normalizedUrl = new URL(url);
    } catch {
        // If no scheme is present, assume HTTPS
        normalizedUrl = new URL(`https://${url}`);
    }
    try {
        await page.goto(normalizedUrl.href, { waitUntil: ['domcontentloaded', 'networkidle2'] });
    } catch (error) {
        console.error(error);
    }

    try {
        result = await getStyleFromPage(page);
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        browser.close();
    }

    return result;
}

export async function getStyleFromPage(page: Page) {
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    const { colorRecord, fontFamily } = await page.evaluate(() => {
        const getButtonScore = (el: Element) => {
            switch (el.tagName) {
                case 'BUTTON':
                    return 5;
                case 'A':
                    return 1;
                case 'INPUT':
                    return 1;
                default:
                    return 0;
            }
        };
        const elements = document.body.getElementsByTagName('*');
        const colorRecord: Record<string, { elementCount: number; buttonCount: number }> = {};

        console.log('elements:', elements.length);

        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];

            const clientRect = el.getBoundingClientRect();

            // ignore non-visible elements
            if (clientRect.width === 0 || clientRect.height === 0) continue;

            const color = window.getComputedStyle(el).backgroundColor;

            if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
                if (colorRecord[color]) {
                    const data = colorRecord[color];
                    data.elementCount++;
                    data.buttonCount += getButtonScore(el);
                } else {
                    colorRecord[color] = { elementCount: 1, buttonCount: getButtonScore(el) };
                }
            }
        }

        const fontFamily = window.getComputedStyle(document.body).fontFamily;

        return { colorRecord, fontFamily };
    });

    console.log(`${page.url()} color record:`, colorRecord);

    const colorArray = Object.entries(colorRecord).sort((a, b) => b[1].elementCount - a[1].elementCount);

    let backgroundColor = colorArray[0][0];

    const buttonSortedArray = colorArray
        .filter(([color]) => color !== 'rgb(255, 255, 255)')
        .map(([color, data]) => {
            let isColorur = false;
            const rgb = color.match(/\d+/g);
            if (rgb && rgb.length === 3) {
                isColorur = isColour(rgb[0], rgb[1], rgb[2]);
            }
            return { color, buttonCount: data.buttonCount, isColorur };
        })
        .sort((a, b) => {
            if (a.isColorur && !b.isColorur) {
                return -1;
            }
            if (!a.isColorur && b.isColorur) {
                return 1;
            }
            return b.buttonCount - a.buttonCount;
        });
    console.log(`${page.url()} button sorted array:`, buttonSortedArray);

    const buttonColor = buttonSortedArray ? buttonSortedArray[0]?.color : null;

    if (backgroundColor == buttonColor && colorArray.length > 1) {
        backgroundColor = colorArray[1][0];
    }

    // don't use black as background color.
    if (isBlack(backgroundColor)) {
        backgroundColor = 'rgb(255, 255, 255)';
    }

    return { buttonColor, backgroundColor, fontFamily };
}
