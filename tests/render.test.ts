import { expect, describe, test } from 'bun:test'
import { colors, fontStyles } from '../src/options'
import {
    stripAnsi,
    renderAnsi,
    cssStyle,
    stripWeb,
    renderWeb,
} from '../src/render'
import type { LazyStyledText } from '../src/style'

describe('cssStyle', () => {
    test('color text', () => {
        for (const color of colors) {
            expect(cssStyle(color)).toMatch(/^color: #\w{6}$/)
        }
    })

    test('background color', () => {
        for (const color of colors) {
            expect(cssStyle(undefined, color)).toMatch(/^background: #\w{6}$/)
        }
    })

    test('font styled', () => {
        for (const fontStyle of fontStyles) {
            if (fontStyle === 'blink') {
                expect(cssStyle(undefined, undefined, [fontStyle])).toBe('')
            } else {
                expect(
                    cssStyle(
                        undefined, // textColor
                        undefined, // backgroundColor
                        [fontStyle],
                    ),
                ).toMatch(/^[\w-]+: [\w\(\)\./\s-;:]+$/)
            }
        }
    })

    test('multiple font styles', () => {})

    test('full styled text', () => {})
})

function renderAnsiWrapped(text: (string | LazyStyledText)[]): string {
    const styledText = renderAnsi(text)
    const plainText = text
        .map((part) => {
            if (typeof part === 'string') {
                return part
            }
            return part.text
        })
        .join('')

    expect(styledText.length).toBeGreaterThanOrEqual(plainText.length)
    expect(stripAnsi(styledText)).toEqual(plainText)
    return styledText
}

function renderWebWrapped(text: (string | LazyStyledText)[]): string[] {
    const styledText = renderWeb(text)
    const plainText = text
        .map((part) => {
            if (typeof part === 'string') {
                return part
            }
            return part.text
        })
        .join('')

    expect(styledText[0].length).toBeGreaterThanOrEqual(plainText.length)
    expect(stripWeb(styledText[0])).toEqual(plainText)
    return styledText
}

describe('no style', () => {
    test('renderAnsi', () => {
        expect(renderAnsiWrapped([])).toBe('')
        expect(renderAnsiWrapped([''])).toBe('')
        expect(renderAnsiWrapped([{ text: '' }])).toBe('')
        expect(renderAnsiWrapped(['hello', ' ', 'world'])).toBe('hello world')
        expect(renderAnsiWrapped(['hello world'])).toBe('hello world')
        expect(renderAnsiWrapped([{ text: 'hello world' }])).toBe('hello world')
        expect(
            renderAnsiWrapped([
                { text: 'hello' },
                { text: ' ' },
                { text: 'world' },
            ]),
        ).toBe('hello world')
    })

    test('renderWeb', () => {
        expect(renderWebWrapped([])).toEqual(['%c', 'color: currentColor'])
        expect(renderWebWrapped([''])).toEqual(['%c', 'color: currentColor'])
        expect(renderWebWrapped([{ text: '' }])).toEqual([
            '%c',
            'color: currentColor',
        ])
        expect(renderWebWrapped(['hello', ' ', 'world'])).toEqual([
            '%chello world',
            'color: currentColor',
        ])
        expect(renderWebWrapped(['hello world'])).toEqual([
            '%chello world',
            'color: currentColor',
        ])
        expect(renderWebWrapped([{ text: 'hello world' }])).toEqual([
            '%chello world',
            'color: currentColor',
        ])
        expect(
            renderWebWrapped([
                { text: 'hello' },
                { text: ' ' },
                { text: 'world' },
            ]),
        ).toEqual(['%chello world', 'color: currentColor'])
    })
})

// describe('color text', () => {
//     test('renderAnsi', () => {

//     })

//     test('renderWeb', () => {

//     })
// })

// describe('background color', () => {
//     test('renderAnsi', () => {

//     })

//     test('renderWeb', () => {

//     })
// })

// describe('font styled', () => {
//     test('renderAnsi', () => {

//     })

//     test('renderWeb', () => {

//     })
// })

// describe('multiple font styles', () => {
//     test('renderAnsi', () => {

//     })

//     test('renderWeb', () => {

//     })
// })

// describe('full styled text', () => {
//     test('renderAnsi', () => {

//     })

//     test('renderWeb', () => {

//     })
// })
