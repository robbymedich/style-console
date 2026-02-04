const leadingWhitespace = /\n{0,1}(?<indent>\s*)(?<line>.*)/g
const isWhitespace = /^\s+$/

export function getIndentPrefix(text: string): string {
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

export function dedentOld(text: string, dedentPrefix?: string): string {
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

export function splitLines(text: string): string[] {
    const length = '\n'.length
    const result: string[] = []
    let priorIx = 0

    for (const match of text.matchAll(/\n/g)) {
        const part = text.slice(priorIx, match.index + length)
        if (part !== '') {
            result.push(part)
        }
        priorIx = match.index + length
    }
    const part = text.slice(priorIx, text.length)
    if (part !== '') {
        result.push(part)
    }
    return result
}

export function dedent(text: string, dedentPrefix?: string): string {
    const splitLine = /(?<indent>[^\S\n]*)(?<line>.*)/s
    const indentLines = []
    const textLines = []
    let minIndent: string | null = null

    for (const fullLineText of splitLines(text)) {
        const reMatch = fullLineText.match(splitLine)
        if (reMatch === null) {
            throw new Error('all lines must match the splitLine pattern')
        }
        const indent = reMatch.groups!['indent']!
        const line = reMatch.groups!['line']!

        if (
            fullLineText !== '\n' &&
            (minIndent === null || indent.length < minIndent.length)
        ) {
            minIndent = indent
        }
        indentLines.push(indent)
        textLines.push(line)
        // console.log({fullLineText, indent, line})
    }

    let indentStart
    if (minIndent == null) {
        indentStart = 0
    } else if (
        typeof dedentPrefix !== 'string' ||
        minIndent.length <= dedentPrefix.length
    ) {
        indentStart = minIndent.length
    } else {
        indentStart = dedentPrefix.length
    }
    const cleanedLines = []

    for (let ix = 0; ix < textLines.length; ix++) {
        const indent = indentLines[ix]!
        const line = textLines[ix]!

        cleanedLines.push(`${indent.slice(indentStart)}${line}`)
    }

    return cleanedLines.join('')
}
