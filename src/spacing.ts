const SPLIT_LINE = /(?<indent>[^\S\n]*)(?<line>.*\n{0,1})/g

export function indent(text: string, indentWith: string): string {
    if (indentWith === '') {
        return text
    }
    SPLIT_LINE.lastIndex = 0
    const cleaned = []

    for (const reMatch of text.matchAll(SPLIT_LINE)) {
        const indent = reMatch.groups!['indent']!
        const line = reMatch.groups!['line']!

        if (line !== '' && line !== '\n') {
            cleaned.push(indentWith)
        }
        cleaned.push(indent)
        cleaned.push(line)
    }

    return cleaned.join('')
}

export function dedent(text: string, dedentPrefix?: string): string {
    SPLIT_LINE.lastIndex = 0
    const indentParts = []
    const lineParts = []
    let minIndent: string | null = null

    for (const reMatch of text.matchAll(SPLIT_LINE)) {
        const indent = reMatch.groups!['indent']!
        const line = reMatch.groups!['line']!

        if (
            line !== '' &&
            line !== '\n' &&
            (minIndent === null || indent.length < minIndent.length)
        ) {
            minIndent = indent
        }
        indentParts.push(indent)
        lineParts.push(line)
    }

    let indentStart
    if (minIndent === null) {
        indentStart = 0
    } else if (
        typeof dedentPrefix !== 'string' ||
        minIndent.length <= dedentPrefix.length
    ) {
        indentStart = minIndent.length
    } else {
        indentStart = dedentPrefix.length
    }
    const cleaned = []

    for (let ix = 0; ix < lineParts.length; ix++) {
        const indent = indentParts[ix]!
        const line = lineParts[ix]!

        cleaned.push(indent.slice(indentStart))
        cleaned.push(line)
    }

    return cleaned.join('')
}
