import { expect, test, describe } from 'bun:test'
import {
    getDefaultIndent,
    setDefaultIndent,
    Style,
    LazyStyledText,
    StyledText,
    style,
} from '../src/style.ts'

describe('quick', () => {
    test('hi', () => {
        const theme = {
            default: style.default(),
            red: style.color('red'),
            bold: style.fontStyle('bold'),
        }
        console.log('')

        const out1 = new StyledText(theme.default)
            .text('this is ')
            .style(theme.red)
            .text('red')
            .style(theme.default)
            .text('.')
            .newLine()
            .toString()
        console.log(out1)

        const out2 = new StyledText(theme.default)
            .text('this is ')
            .text('red', { style: theme.red })
            .text('.')
            .newLine()
            .toString()
        console.log(out2)

        const out3 = new StyledText(theme.default)
            .text('and this is... ')
            .style(theme.bold)
            .text('bold')
            .style(theme.default)
            .text('.')
            .newLine()
            .toString()
        console.log(out3)

        const out4 = new StyledText(theme.default)
            .text('hi')
            .text('\nwith background', { style: style.background('blue') })
            .text('\nhello')
            .toString()
        console.log(out4)
    })
})
