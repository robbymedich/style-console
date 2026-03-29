/**
 * Global line-splitting pattern used by {@link indent} and {@link dedent}.
 *
 * Each match captures leading horizontal whitespace separately from the rest of
 * the line, including an optional trailing newline.
 */
const SPLIT_LINE = /(?<indent>[^\S\n]*)(?<line>.*\n{0,1})/g

/**
 * Prefixes each non-empty line in a block of text.
 *
 * Existing indentation is preserved. Blank lines and lines that only contain a
 * newline are left untouched.
 *
 * @param text - Text block to indent.
 * @param indentWith - Prefix inserted before each non-empty line.
 * @returns The indented text.
 */
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

/**
 * Removes a shared amount of leading indentation from each line.
 *
 * The amount removed is based on the smallest indentation found across
 * non-empty lines. When `dedentPrefix` is provided, at most that many leading
 * characters are removed even if the minimum indentation is larger.
 *
 * @param text - Text block to dedent.
 * @param dedentPrefix - Maximum indentation prefix to remove from each line.
 * @returns The dedented text.
 */
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

// TODO: Create a seprate packages for spacing
