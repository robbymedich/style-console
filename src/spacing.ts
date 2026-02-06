const leadingWhitespace = /\n{0,1}(?<indent>\s*)(?<line>.*)/g
const isWhitespace = /^\s+$/

// export function indent(text: string, indentWith: string): string {
//     if (indentWith === '') {
//         return text
//     }
//     const prefix = text.startsWith('\n') ? '' : indentWith
//     const indentedText = prefix + text.split('\n').join(`\n${indentWith}`)
//     return text.endsWith('\n')
//         ? indentedText.slice(0, indentedText.length - indentWith.length)
//         : indentedText
// }

export function indent(text: string, indentWith: string): string {
    if (indentWith === '') {
        return text
    }
    return text.split('\n').join(`\n${indentWith}`)
}

export function dedent(text: string, dedentPrefix?: string): string {
    const splitLine = /(?<indent>[^\S\n]*)(?<line>.*\n{0,1})/g
    const indentLines = []
    const textLines = []
    let minIndent: string | null = null

    for (const reMatch of text.matchAll(splitLine)) {
        const indent = reMatch.groups!['indent']!
        const line = reMatch.groups!['line']!

        if (
            (line !== '' && line !== '\n') &&
            (minIndent === null || indent.length < minIndent.length)
        ) {
            minIndent = indent
        }
        indentLines.push(indent)
        textLines.push(line)
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
