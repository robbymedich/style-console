import { expect, test, describe } from 'bun:test'
import { colors } from '../src/colors.ts'
import { textModifiers } from '../src/modifiers.ts'
import {
    getDefaultIndent,
    setDefaultIndent,
    stripStyle,
    Style,
    LazyStyledText,
    StyledText,
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
            `${colors.blue.text.set}hello${colors.blue.text.unset}`
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
            colors.red.text.unset
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
