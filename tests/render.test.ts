/* eslint-disable prefer-template */
import { expect, describe, test } from 'bun:test'
import {
    colors,
    fontStyles,
    colorOption,
    fontStyleOption,
} from '../src/options'
import { style } from '../src/style'
import {
    stripAnsi,
    renderAnsi,
    cssStyle,
    setCssColors,
    stripWeb,
    renderWeb,
    equal, // internal only
} from '../src/render'
import type { Color } from '../src/options'
import type { StyledText } from '../src/style'

const namedColors = Object.fromEntries(
    colors.map((color) => [color, color]),
) as Record<Color, Color>
setCssColors(namedColors)

describe('fontStyle equal', () => {
    test('undefined or empty', () => {
        expect(equal(undefined, ['bold'])).toBe(false)
        expect(equal(['bold'], undefined)).toBe(false)
        expect(equal([], [])).toBe(true)
        expect(equal([], undefined)).toBe(false)
    })

    test('simple lists', () => {
        expect(equal(['bold'], ['bold'])).toBe(true)
        expect(equal(['bold'], ['bold', 'italic'])).toBe(false)
        expect(equal(['bold', 'italic'], ['bold', 'italic'])).toBe(true)
        expect(equal(['italic', 'bold'], ['bold', 'italic'])).toBe(false)
    })
})

describe('cssStyle', () => {
    test('push, no handling', () => {
        expect(
            cssStyle(undefined, undefined, [
                'bold',
                'italic',
                'framed',
                'blink',
            ]),
        ).toEqual(
            'font-weight: bold; ' +
                'font-style: italic; ' +
                'padding: 1px; ' +
                'border: 1px solid currentColor',
        )
        expect(
            cssStyle(undefined, undefined, [
                'blink',
                'italic',
                'framed',
                'bold',
            ]),
        ).toEqual(
            'font-style: italic; ' +
                'padding: 1px; ' +
                'border: 1px solid currentColor; ' +
                'font-weight: bold',
        )
    })

    test('push, with a color', () => {
        expect(cssStyle('red', undefined, ['bold', 'italic'])).toEqual(
            'font-weight: bold; font-style: italic; color: red',
        )
    })

    test('text-decoration', () => {
        expect(cssStyle(undefined, undefined, ['underline'])).toEqual(
            'text-decoration: underline',
        )
        expect(cssStyle(undefined, undefined, ['strikethrough'])).toEqual(
            'text-decoration: line-through',
        )
        expect(
            cssStyle(undefined, undefined, [
                'underline',
                'strikethrough',
                'overlined',
            ]),
        ).toEqual('text-decoration: underline line-through overline')
        expect(
            cssStyle(undefined, undefined, [
                'doubleunderline',
                'strikethrough',
                'overlined',
            ]),
        ).toEqual('text-decoration: underline line-through overline')
        expect(
            cssStyle(undefined, undefined, ['doubleunderline', 'italic']),
        ).toEqual('font-style: italic; text-decoration: underline double')
    })

    test('text and background color', () => {
        expect(cssStyle('blue', 'red')).toEqual('color: blue; background: red')
        expect(cssStyle('red', undefined, ['dim'])).toEqual(
            'color: rgb(from red r g b / 0.5)',
        )
        expect(cssStyle(undefined, 'red', ['dim'])).toEqual(
            'color: rgb(from currentColor r g b / 0.5); ' +
                'background: rgb(from red r g b / 0.5)',
        )
        expect(cssStyle('red', 'blue', ['dim'])).toEqual(
            'color: rgb(from red r g b / 0.5); ' +
                'background: rgb(from blue r g b / 0.5)',
        )
        expect(cssStyle('red', 'blue', ['inverse'])).toEqual(
            'color: blue; background: red',
        )
        expect(cssStyle('red', undefined, ['inverse'])).toEqual(
            'color: rgb(from red calc(255 - r) calc(255 - g) calc(255 - b)); ' +
                'background: red',
        )
        expect(cssStyle(undefined, 'red', ['inverse'])).toEqual(
            'color: red; ' +
                'background: rgb(from currentColor calc(255 - r) calc(255 - g) calc(255 - b))',
        )
        expect(cssStyle(undefined, undefined, ['inverse'])).toEqual(
            'color: rgb(from currentColor calc(255 - r) calc(255 - g) calc(255 - b)); ' +
                'background: rgb(from currentColor calc(255 - r) calc(255 - g) calc(255 - b))',
        )
        expect(cssStyle(undefined, undefined, ['inverse', 'dim'])).toEqual(
            'color: rgb(from currentColor calc(255 - r) calc(255 - g) calc(255 - b) / 0.5); ' +
                'background: rgb(from currentColor calc(255 - r) calc(255 - g) calc(255 - b) / 0.5)',
        )
        expect(cssStyle('red', undefined, ['inverse', 'dim'])).toEqual(
            'color: rgb(from red calc(255 - r) calc(255 - g) calc(255 - b) / 0.5); ' +
                'background: rgb(from red r g b / 0.5)',
        )
        expect(cssStyle(undefined, 'red', ['inverse', 'dim'])).toEqual(
            'color: rgb(from red r g b / 0.5); ' +
                'background: rgb(from currentColor calc(255 - r) calc(255 - g) calc(255 - b) / 0.5)',
        )
        expect(cssStyle('blue', 'red', ['inverse', 'dim'])).toEqual(
            'color: rgb(from red r g b / 0.5); ' +
                'background: rgb(from blue r g b / 0.5)',
        )
        expect(cssStyle('red', undefined, ['dim', 'hidden'])).toEqual(
            'color: rgb(from currentColor r g b / 0)',
        )
        expect(cssStyle('red', undefined, ['hidden', 'dim'])).toEqual(
            'color: rgb(from red r g b / 0.5)',
        )
        expect(cssStyle('red', 'blue', ['inverse', 'hidden'])).toEqual(
            'color: rgb(from currentColor r g b / 0); background: red',
        )
        expect(cssStyle('red', 'blue', ['hidden', 'inverse'])).toEqual(
            'color: blue; background: red',
        )
    })
})

function renderAnsiWrapped(text: StyledText[]): string {
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

function renderWebWrapped(text: StyledText[]): string[] {
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
        expect(renderAnsiWrapped([{ text: '' }])).toBe('')
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
        expect(renderWebWrapped([{ text: '' }])).toEqual([
            '%c',
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

describe('color text', () => {
    test('renderAnsi', () => {
        for (const color of colors) {
            expect(
                renderAnsiWrapped([{ text: color, textColor: color }]),
            ).toEqual(
                colorOption[color].text.set +
                    color +
                    colorOption[color].text.unset,
            )
        }

        expect(
            renderAnsiWrapped([
                { text: 'hello', textColor: 'red' },
                { text: ' ', textColor: 'red' },
                { text: 'world', textColor: 'red' },
            ]),
        ).toEqual(
            colorOption.red.text.set +
                'hello world' +
                colorOption.red.text.unset,
        )

        expect(
            renderAnsiWrapped([
                { text: 'hello', textColor: 'red' },
                { text: ' ' },
                { text: 'world', textColor: 'red' },
            ]),
        ).toEqual(
            colorOption.red.text.set +
                'hello' +
                colorOption.red.text.unset +
                ' ' +
                colorOption.red.text.set +
                'world' +
                colorOption.red.text.unset,
        )
    })

    test('renderWeb', () => {
        for (const color of colors) {
            expect(
                renderWebWrapped([{ text: color, textColor: color }]),
            ).toEqual([`%c${color}`, `color: ${color}`])
        }

        expect(
            renderWebWrapped([
                { text: 'hello', textColor: 'red' },
                { text: ' ', textColor: 'red' },
                { text: 'world', textColor: 'red' },
            ]),
        ).toEqual(['%chello world', 'color: red'])

        expect(
            renderWebWrapped([
                { text: 'hello', textColor: 'red' },
                { text: ' ' },
                { text: 'world', textColor: 'red' },
            ]),
        ).toEqual(['%chello%c %cworld', 'color: red', '', 'color: red'])
    })
})

describe('background color', () => {
    test('renderAnsi', () => {
        for (const color of colors) {
            expect(
                renderAnsiWrapped([{ text: color, backgroundColor: color }]),
            ).toEqual(
                colorOption[color].background.set +
                    color +
                    colorOption[color].background.unset,
            )
        }

        expect(
            renderAnsiWrapped([
                { text: 'hello', backgroundColor: 'red' },
                { text: ' ', backgroundColor: 'red' },
                { text: 'world', backgroundColor: 'red' },
            ]),
        ).toEqual(
            colorOption.red.background.set +
                'hello world' +
                colorOption.red.background.unset,
        )

        expect(
            renderAnsiWrapped([
                { text: 'hello', backgroundColor: 'red' },
                { text: ' ' },
                { text: 'world', backgroundColor: 'red' },
            ]),
        ).toEqual(
            colorOption.red.background.set +
                'hello' +
                colorOption.red.background.unset +
                ' ' +
                colorOption.red.background.set +
                'world' +
                colorOption.red.background.unset,
        )
    })

    test('renderWeb', () => {
        for (const color of colors) {
            expect(
                renderWebWrapped([{ text: color, backgroundColor: color }]),
            ).toEqual([`%c${color}`, `background: ${color}`])
        }

        expect(
            renderWebWrapped([
                { text: 'hello', backgroundColor: 'red' },
                { text: ' ', backgroundColor: 'red' },
                { text: 'world', backgroundColor: 'red' },
            ]),
        ).toEqual(['%chello world', 'background: red'])

        expect(
            renderWebWrapped([
                { text: 'hello', backgroundColor: 'red' },
                { text: ' ' },
                { text: 'world', backgroundColor: 'red' },
            ]),
        ).toEqual([
            '%chello%c %cworld',
            'background: red',
            '',
            'background: red',
        ])
    })
})

describe('font styled', () => {
    test('renderAnsi', () => {
        for (const fontStyle of fontStyles) {
            expect(
                renderAnsiWrapped([
                    { text: fontStyle, fontStyles: [fontStyle] },
                ]),
            ).toEqual(
                fontStyleOption[fontStyle].set +
                    fontStyle +
                    fontStyleOption[fontStyle].unset,
            )
        }

        expect(
            renderAnsiWrapped([
                { text: 'hello', fontStyles: ['bold'] },
                { text: ' ', fontStyles: ['bold'] },
                { text: 'world', fontStyles: ['bold'] },
            ]),
        ).toEqual(
            fontStyleOption.bold.set +
                'hello world' +
                fontStyleOption.bold.unset,
        )

        expect(
            renderAnsiWrapped([
                { text: 'hello', fontStyles: ['bold'] },
                { text: ' ' },
                { text: 'world', fontStyles: ['bold'] },
            ]),
        ).toEqual(
            fontStyleOption.bold.set +
                'hello' +
                fontStyleOption.bold.unset +
                ' ' +
                fontStyleOption.bold.set +
                'world' +
                fontStyleOption.bold.unset,
        )
    })

    test('renderWeb', () => {
        for (const fontStyle of fontStyles) {
            const args = renderWebWrapped([
                { text: fontStyle, fontStyles: [fontStyle] },
            ])
            expect(args[0]).toEqual(`%c${fontStyle}`)
            if (fontStyle === 'blink') {
                expect(args[1]).toBe('')
            } else {
                expect(args[1]).toMatch(/^[\w-]+: [\w()./\s-;:]+$/)
            }
        }

        expect(
            renderWebWrapped([
                { text: 'hello', fontStyles: ['bold'] },
                { text: ' ', fontStyles: ['bold'] },
                { text: 'world', fontStyles: ['bold'] },
            ]),
        ).toEqual(['%chello world', 'font-weight: bold'])

        expect(
            renderWebWrapped([
                { text: 'hello', fontStyles: ['bold'] },
                { text: ' ' },
                { text: 'world', fontStyles: ['bold'] },
            ]),
        ).toEqual([
            '%chello%c %cworld',
            'font-weight: bold',
            '',
            'font-weight: bold',
        ])
    })
})

describe('multiple font styles', () => {
    test('renderAnsi', () => {
        expect(
            renderAnsiWrapped([
                { text: 'hello', fontStyles: ['bold'] },
                { text: ' ', fontStyles: ['bold', 'strikethrough'] },
                { text: 'world', fontStyles: ['bold', 'italic'] },
            ]),
        ).toEqual(
            fontStyleOption.bold.set +
                'hello' +
                fontStyleOption.strikethrough.set +
                ' ' +
                fontStyleOption.strikethrough.unset +
                fontStyleOption.italic.set +
                'world' +
                fontStyleOption.bold.unset +
                fontStyleOption.italic.unset,
        )
    })

    test('renderWeb', () => {
        expect(
            renderWebWrapped([
                { text: 'hello', fontStyles: ['bold'] },
                { text: ' ', fontStyles: ['bold', 'strikethrough'] },
                { text: 'world', fontStyles: ['bold', 'italic'] },
            ]),
        ).toEqual([
            '%chello%c %cworld',
            'font-weight: bold',
            'font-weight: bold; text-decoration: line-through',
            'font-weight: bold; font-style: italic',
        ])
    })
})

describe('full styled text', () => {
    test('renderAnsi', () => {
        expect(
            renderAnsiWrapped([
                { text: 'hello', textColor: 'blue', fontStyles: ['bold'] },
                {
                    text: ' ',
                    textColor: 'blue',
                    backgroundColor: 'red',
                    fontStyles: ['bold', 'strikethrough'],
                },
                {
                    text: 'world',
                    backgroundColor: 'red',
                    fontStyles: ['bold', 'italic'],
                },
            ]),
        ).toEqual(
            colorOption.blue.text.set +
                fontStyleOption.bold.set +
                'hello' +
                colorOption.red.background.set +
                fontStyleOption.strikethrough.set +
                ' ' +
                colorOption.blue.text.unset +
                fontStyleOption.strikethrough.unset +
                fontStyleOption.italic.set +
                'world' +
                colorOption.red.background.unset +
                fontStyleOption.bold.unset +
                fontStyleOption.italic.unset,
        )
    })

    test('renderWeb', () => {
        expect(
            renderWebWrapped([
                { text: 'hello', textColor: 'blue', fontStyles: ['bold'] },
                {
                    text: ' ',
                    textColor: 'blue',
                    backgroundColor: 'red',
                    fontStyles: ['bold', 'strikethrough'],
                },
                {
                    text: 'world',
                    backgroundColor: 'red',
                    fontStyles: ['bold', 'italic'],
                },
            ]),
        ).toEqual([
            '%chello%c %cworld',
            'font-weight: bold; color: blue',
            'font-weight: bold; color: blue; background: red; text-decoration: line-through',
            'font-weight: bold; font-style: italic; background: red',
        ])
    })
})

describe('nested style(s)', () => {
    test('bold + dim', () => {
        const text = style.bold(
            'this is bold, ',
            style.dim('this is dimmed, '),
            'and this is bold again.',
        )
        // bold and dim text share the same ANSI reset code
        expect(renderAnsi(text)).toEqual(
            fontStyleOption.bold.set +
                'this is bold, ' +
                fontStyleOption.bold.unset +
                fontStyleOption.dim.set +
                'this is dimmed, ' +
                fontStyleOption.dim.unset +
                fontStyleOption.bold.set +
                'and this is bold again.' +
                fontStyleOption.bold.unset,
        )
        expect(renderWeb(text)).toEqual([
            '%cthis is bold, %cthis is dimmed, %cand this is bold again.',
            'font-weight: bold',
            'color: rgb(from currentColor r g b / 0.5)',
            'font-weight: bold',
        ])
    })

    test('underline + doubleunderline', () => {
        const text = style.underline(
            'single',
            style.doubleunderline(' double '),
            'single',
        )
        // underline and doubleunderline text share the same ANSI reset code
        expect(renderAnsi(text)).toEqual(
            fontStyleOption.underline.set +
                'single' +
                fontStyleOption.underline.unset +
                fontStyleOption.doubleunderline.set +
                ' double ' +
                fontStyleOption.doubleunderline.unset +
                fontStyleOption.underline.set +
                'single' +
                fontStyleOption.underline.unset,
        )
        expect(renderWeb(text)).toEqual([
            '%csingle%c double %csingle',
            'text-decoration: underline',
            'text-decoration: underline double',
            'text-decoration: underline',
        ])
    })
})
