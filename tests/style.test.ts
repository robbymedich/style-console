import { expect, test, describe } from 'bun:test'
import { colors } from '../src/colors.ts'
import { textModifiers } from '../src/modifiers.ts'
import {
    getDefaultIndent,
    setDefaultIndent,
    stripStyle,
    Style,
    LazyStyledText,
    StyledTextBuilder,
    style,
} from '../src/style.ts'

test('default indent', () => {
    expect(getDefaultIndent()).toBe('    ')
    setDefaultIndent('  ')
    expect(getDefaultIndent()).toBe('  ')
    setDefaultIndent('    ')
    expect(getDefaultIndent()).toBe('    ')
})

describe('class Style', () => {
    test('no style', () => {
        const empty = new Style()
        expect(empty.getBackgroundColor()).toBe(undefined)
        expect(empty.getTextColor()).toBe(undefined)
        expect(empty.getFontStyle()).toEqual([])
        expect(empty.getStyledText('hello')).toBe('hello')
        expect(empty.getStyleSetters()).toEqual({
            setStyle: '',
            unsetStyle: '',
        })
    })

    test('class interface', () => {
        let myStyle = new Style({
            textColor: 'red',
            backgroundColor: 'blue',
            fontStyle: 'bold',
        })
        expect(myStyle.getBackgroundColor()).toEqual('blue')
        expect(myStyle.getTextColor()).toEqual('red')
        expect(myStyle.getFontStyle()).toEqual(['bold'])

        myStyle.backgroundColor('magentaBright')
        expect(myStyle.getBackgroundColor()).toBe('magentaBright')
        myStyle.reset('backgroundColor')
        expect(myStyle.getBackgroundColor()).toEqual(undefined)

        myStyle.textColor('black')
        expect(myStyle.getTextColor()).toBe('black')
        myStyle.reset('textColor')
        expect(myStyle.getTextColor()).toEqual(undefined)

        myStyle.fontStyle('bold', 'italic')
        expect(myStyle.getFontStyle()).toEqual(['bold', 'italic'])
        myStyle.reset('fontStyle')
        expect(myStyle.getFontStyle()).toEqual([])
        myStyle.fontStyle('strikethrough')
        expect(myStyle.getFontStyle()).toEqual(['strikethrough'])

        myStyle = new Style({
            textColor: 'black',
            backgroundColor: 'white',
            fontStyle: ['bold', 'italic'],
        })
        expect(myStyle).toEqual(
            new Style()
                .textColor('black')
                .backgroundColor('white')
                .fontStyle('bold', 'italic'),
        )
        myStyle.reset('all')
        expect(myStyle.getBackgroundColor()).toBe(undefined)
        expect(myStyle.getTextColor()).toBe(undefined)
        expect(myStyle.getFontStyle()).toEqual([])

        myStyle = new Style({
            textColor: 'black',
            backgroundColor: 'white',
            fontStyle: ['bold', 'italic'],
        })
        myStyle.reset()
        expect(myStyle.getBackgroundColor()).toBe(undefined)
        expect(myStyle.getTextColor()).toBe(undefined)
        expect(myStyle.getFontStyle()).toEqual([])
    })

    test('style setter(s) and unsetter(s)', () => {
        expect(new Style().getStyleSetters()).toEqual({
            setStyle: '',
            unsetStyle: '',
        })
        expect(new Style({ textColor: 'red' }).getStyleSetters()).toEqual({
            setStyle: colors.red.text.set,
            unsetStyle: colors.red.text.unset,
        })
        expect(
            new Style({
                textColor: 'red',
                backgroundColor: 'blue',
            }).getStyleSetters(),
        ).toEqual({
            setStyle: colors.red.text.set + colors.blue.background.set,
            unsetStyle: colors.blue.background.unset + colors.red.text.unset,
        })
        expect(
            new Style({
                textColor: 'red',
                backgroundColor: 'blue',
                fontStyle: 'bold',
            }).getStyleSetters(),
        ).toEqual({
            setStyle:
                colors.red.text.set +
                colors.blue.background.set +
                textModifiers.bold.set,
            unsetStyle:
                textModifiers.bold.unset +
                colors.blue.background.unset +
                colors.red.text.unset,
        })
        const myStyle = new Style({
            textColor: 'red',
            backgroundColor: 'blue',
            fontStyle: ['bold', 'italic'],
        })
        expect(myStyle.getStyleSetters()).toEqual({
            setStyle:
                colors.red.text.set +
                colors.blue.background.set +
                textModifiers.bold.set +
                textModifiers.italic.set,
            unsetStyle:
                textModifiers.italic.unset +
                textModifiers.bold.unset +
                colors.blue.background.unset +
                colors.red.text.unset,
        })
        myStyle.reset()
        expect(myStyle.getStyleSetters()).toEqual({
            setStyle: '',
            unsetStyle: '',
        })
    })

    test('get styled text', () => {
        const basicStyle = new Style({ textColor: 'blue' })
        expect(basicStyle.getStyledText('hello')).toBe(
            `${colors.blue.text.set}hello${colors.blue.text.unset}`,
        )

        const fancyStyle = new Style({
            textColor: 'red',
            backgroundColor: 'blue',
            fontStyle: ['bold', 'italic'],
        })
        expect(fancyStyle.getStyledText('hello')).toBe(
            colors.red.text.set +
                colors.blue.background.set +
                textModifiers.bold.set +
                textModifiers.italic.set +
                'hello' +
                textModifiers.italic.unset +
                textModifiers.bold.unset +
                colors.blue.background.unset +
                colors.red.text.unset,
        )
    })
})

describe('strip style', () => {
    test('no styling', () => {
        expect(stripStyle('hello world!')).toBe('hello world!')
    })

    test('basic styling', () => {
        const basicStyle = new Style({ textColor: 'blue' })
        const styledText = basicStyle.getStyledText('hello world!')
        expect(styledText.length > 'hello world!'.length)
        expect(stripStyle(styledText)).toBe('hello world!')
    })

    test('multi-modifiers', () => {
        const fancyStyle = new Style({
            textColor: 'red',
            backgroundColor: 'blue',
            fontStyle: ['bold', 'italic'],
        })
        const styledText = fancyStyle.getStyledText('hello world!')
        expect(styledText.length > 'hello world!'.length)
        expect(stripStyle(styledText)).toBe('hello world!')
    })
})

describe('class LazyStyledText', () => {
    test('no modifications', () => {
        const text = new LazyStyledText('hello world')
        expect(text.getStyledText()).toBe('hello world')
    })

    test('with indent', () => {
        const text = new LazyStyledText('hello world')
        text.indent = '  '
        expect(text.getStyledText()).toBe('  hello world')
    })

    test('with dedent', () => {
        const text = new LazyStyledText('  hello world')
        text.dedent = true
        expect(text.getStyledText()).toBe('hello world')
    })

    test('with dedent and indent', () => {
        const text = new LazyStyledText('  hello world')
        text.dedent = true
        text.indent = '    '
        expect(text.getStyledText()).toBe('    hello world')
    })

    test('with style', () => {
        const text = new LazyStyledText('hello world')
        text.style = new Style({ textColor: 'blue' })
        expect(text.getStyledText()).toBe(
            `${colors.blue.text.set}hello world${colors.blue.text.unset}`,
        )
    })

    test('with all options', () => {
        const text = new LazyStyledText('  hello world')
        text.style = new Style({ textColor: 'blue' })
        text.dedent = true
        text.indent = '    '
        expect(text.getStyledText()).toBe(
            `${colors.blue.text.set}    hello world${colors.blue.text.unset}`,
        )
    })
})

describe('class StyledTextBuilder', () => {
    test('defaults', () => {
        const output = new StyledTextBuilder(style.default())
        expect(output.getIndent()).toBe('')
        expect(output.getStyle()).toEqual(new Style())
        expect(output.toString()).toBe('')
    })

    test('with basic style', () => {
        expect(
            new StyledTextBuilder(style.textColor('blue'))
                .text('hello world')
                .toString()
        ).toBe(
            `${colors.blue.text.set}hello world${colors.blue.text.unset}`
        )
        expect(
            new StyledTextBuilder(style.textColor('blue'), '  ')
                .text('hello world')
                .toString()
        ).toBe(
            `${colors.blue.text.set}  hello world${colors.blue.text.unset}`
        )
    })

    test('with fancy style', () => {
        const fancyStyle = new Style({
            textColor: 'red',
            backgroundColor: 'blue',
            fontStyle: ['bold', 'italic'],
        })
        const output = new StyledTextBuilder(fancyStyle, '  ')
        output.text('hello world')
        expect(output.getIndent()).toBe('  ')
        expect(output.getStyle()).toBe(fancyStyle)
        expect(output.toString()).toBe(
            colors.red.text.set +
                colors.blue.background.set +
                textModifiers.bold.set +
                textModifiers.italic.set +
                '  hello world' +
                textModifiers.italic.unset +
                textModifiers.bold.unset +
                colors.blue.background.unset +
                colors.red.text.unset,
        )
    })

    test('with newlines and indent', () => {
        let output = new StyledTextBuilder(style.backgroundColor('blue'), ' ')
        output.text('hi')
        output.newLine()
        output.text('there')
        expect(output.toString()).toBe(
            `${colors.blue.background.set} hi${colors.blue.background.unset}` +
            '\n' +
            `${colors.blue.background.set} there${colors.blue.background.unset}`
        )

        output = new StyledTextBuilder(style.backgroundColor('blue'), ' ')
        output.text('hi\nthere')
        expect(output.toString()).toBe(
            colors.blue.background.set +
            ' hi\n there' +
            colors.blue.background.unset
        )
    })

    test('text options', () => {
        let output = new StyledTextBuilder(style.backgroundColor('blue'), ' ')
        output.text('hi', { applyStyle: false })
        output.newLine()
        output.text('there', { applyIndent: false })
        expect(output.toString()).toBe(
            ' hi\n' +
            `${colors.blue.background.set}there${colors.blue.background.unset}`
        )

        output = new StyledTextBuilder(style.backgroundColor('blue'), ' ')
        output.text('!', { style: style.textColor('red') } )
        output.newLine()
        output.text('    another line...', { dedentText: true, newLine: true })
        output.text('final line', { applyStyle: false })
        expect(output.toString()).toBe(
            `${colors.red.text.set} !${colors.red.text.unset}` +
            '\n' +
            colors.blue.background.set +
            ' another line...' +
            colors.blue.background.unset +
            '\n final line'
        )
    })

    test('changing text colors', () => {
        const output = new StyledTextBuilder()
        output.text('red', { style: style.textColor('red') })
        output.text('blue', { style: style.textColor('blue') })
        output.text('green', { style: style.textColor('green') })
        expect(output.toString()).toBe(
            `${colors.red.text.set}red${colors.red.text.unset}` +
            `${colors.blue.text.set}blue${colors.blue.text.unset}` +
            `${colors.green.text.set}green${colors.green.text.unset}`
        )
    })
})
