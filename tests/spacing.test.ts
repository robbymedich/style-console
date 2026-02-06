import { expect, test, describe } from 'bun:test'
import { indent, dedent } from '../src/spacing.ts'

describe('indent', () => {
    test('no indentWith', () => {
        expect(indent('', '')).toBe('')
        expect(indent('hello', '')).toBe('hello')
        expect(indent('\nhello', '')).toBe('\nhello')
        expect(indent('hello\n', '')).toBe('hello\n')
        expect(indent('hello  \n', '')).toBe('hello  \n')
        expect(indent('  hello\n', '')).toBe('  hello\n')
        expect(indent('hello\n  ', '')).toBe('hello\n  ')
    })

    test('no new line', () => {
        expect(indent('', '  ')).toBe('')
        expect(indent('hello', '  ')).toBe('  hello')
        expect(indent('  hello', '  ')).toBe('    hello')
        expect(indent('  hello  ', '  ')).toBe('    hello  '  )
    })

    test('single new line', () => {
        expect(indent('\n', '  ')).toBe('\n')
        expect(indent('\nhello', '')).toBe('\nhello')
        expect(dedent('\n    hello')).toBe('\nhello')
        expect(dedent('    hello\n')).toBe('hello\n')
        expect(indent('hello\n', '')).toBe('hello\n')
        expect(indent('hello  \n', '')).toBe('hello  \n')
        expect(indent('  hello\n', '')).toBe('  hello\n')
        expect(indent('hello\n  ', '')).toBe('hello\n  ')
    })

    test('multiple new line', () => {
        // only new lines
        expect(indent('\n\n', '  ')).toBe('\n\n')

        //  no spaces
        expect(indent('\nhello\nworld', '  ')).toBe('\n  hello\n  world')
        expect(indent('hello\nworld', '  ')).toBe('  hello\n  world')
        expect(indent('hello\nworld\n', '  ')).toBe('  hello\n  world\n')
        expect(indent('\nhello\nworld\n', '  ')).toBe('\n  hello\n  world\n')

        // extra indent
        expect(indent('  hello\nworld\n', '  ')).toBe('    hello\n  world\n')
        expect(indent('hello\n  world\n', '  ')).toBe('  hello\n    world\n')

        // extra newlines
        expect(indent('\nhello\n\n\nworld\n', '  ')).toBe(
            '\n  hello\n\n\n  world\n',
        )
        expect(indent('\n  hello\n\n\n  world\n', '  ')).toBe(
            '\n    hello\n\n\n    world\n',
        )
    })
})

describe('dedent', () => {
    test('no new line', () => {
        expect(dedent('')).toBe('')
        expect(dedent('hello')).toBe('hello')
        expect(dedent('    hello')).toBe('hello')
        expect(dedent('    hello  ')).toBe('hello  '  )
    })

    test('single new line', () => {
        expect(dedent('\n')).toBe('\n')
        expect(dedent('\nhello')).toBe('\nhello')
        expect(dedent('\n    hello')).toBe('\nhello')
        expect(dedent('hello\n')).toBe('hello\n')
        expect(dedent('    hello\n')).toBe('hello\n')
        expect(dedent('    hello  \n')).toBe('hello  \n')
        expect(dedent('    hello  \n  ')).toBe('hello  \n')
    })

    test('multiple new line', () => {
        // only new lines
        expect(dedent('\n\n')).toBe('\n\n')
        // no spaces
        expect(dedent('\nhello\nworld')).toBe('\nhello\nworld')
        expect(dedent('hello\nworld')).toBe('hello\nworld')
        expect(dedent('hello\nworld\n')).toBe('hello\nworld\n')
        expect(dedent('\nhello\nworld\n')).toBe('\nhello\nworld\n')
        // right spaces only
        expect(dedent('\nhello\n    world')).toBe('\nhello\n    world')
        expect(dedent('hello\n    world')).toBe('hello\n    world')
        expect(dedent('hello\n    world\n')).toBe('hello\n    world\n')
        expect(dedent('\nhello\n    world\n')).toBe('\nhello\n    world\n')
        // left spaces only
        expect(dedent('\n    hello\nworld')).toBe('\n    hello\nworld')
        expect(dedent('    hello\nworld')).toBe('    hello\nworld')
        expect(dedent('    hello\nworld\n')).toBe('    hello\nworld\n')
        expect(dedent('\n    hello\nworld\n')).toBe('\n    hello\nworld\n')
        // both spaces
        expect(dedent('\n    hello\n    world')).toBe('\nhello\nworld')
        expect(dedent('    hello\n    world')).toBe('hello\nworld')
        expect(dedent('    hello\n    world\n')).toBe('hello\nworld\n')
        expect(dedent('\n    hello\n    world\n')).toBe('\nhello\nworld\n')
        // right spaces doubled
        expect(dedent('\n    hello\n        world')).toBe('\nhello\n    world')
        expect(dedent('    hello\n        world')).toBe('hello\n    world')
        expect(dedent('    hello\n        world\n')).toBe('hello\n    world\n')
        expect(dedent('\n    hello\n        world\n')).toBe(
            '\nhello\n    world\n',
        )
        // left spaces doubled
        expect(dedent('\n        hello\n    world')).toBe('\n    hello\nworld')
        expect(dedent('        hello\n    world')).toBe('    hello\nworld')
        expect(dedent('        hello\n    world\n')).toBe('    hello\nworld\n')
        expect(dedent('\n        hello\n    world\n')).toBe(
            '\n    hello\nworld\n',
        )
        // extra newlines
        expect(dedent('\n    hello\n\n\n    world\n')).toBe(
            '\nhello\n\n\nworld\n',
        )
        expect(dedent('    hello\n\n\n    world\n')).toBe(
            'hello\n\n\nworld\n',
        )
        expect(dedent('    hello\n\n\n    world')).toBe(
            'hello\n\n\nworld',
        )
        // indent only lines with less than main indent
        expect(dedent(`
            Hello there,
            my name
            is Robby
        `)).toBe('\nHello there,\nmy name\nis Robby\n')
    })
})
