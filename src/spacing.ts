const leadingWhitespace = /\n{0,1}(?<indent>\s*)(?<line>.*)/g
const isWhitespace = /^\s+$/

function getIndentPrefix(text: string): string {
    leadingWhitespace.lastIndex = 0

    for (const reMatch of text.matchAll(leadingWhitespace)) {
        if (reMatch === null || reMatch.groups === undefined) {
            break
        }
        const { indent, line } = reMatch.groups
        if (
            line !== undefined &&
            !isWhitespace.test(line) &&
            indent !== undefined &&
            indent !== ''
        ) {
            return indent
        }
    }

    return ''
}

export function dedent(text: string, dedentPrefix?: string): string {
    const indent =
        dedentPrefix === undefined ? getIndentPrefix(text) : dedentPrefix
    if (indent === '') {
        return text
    }
    const parts = []
    const start = indent.length

    for (const line of text.split('\n')) {
        parts.push(line.startsWith(indent) ? line.slice(start) : line)
    }
    return parts.join('\n')
}

export function indent(text: string, indentWith: string): string {
    if (indentWith === '') {
        return text
    }
    const prefix = text.startsWith('\n') ? '' : indentWith
    const indentedText = prefix + text.split('\n').join(`\n${indentWith}`)
    return text.endsWith('\n')
        ? indentedText.slice(0, indentedText.length - indentWith.length)
        : indentedText
}
