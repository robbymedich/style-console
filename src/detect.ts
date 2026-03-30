export type RenderTarget = 'ANSI' | 'Web'
export type ColorSupport =
    | 'none' // 0 colors
    | 'basic' // 16 colors
    | '256color' // 256 colors
    | 'truecolor' // 16M colors with direct rgb support

export function detectRenderTarget(): RenderTarget {
    throw new Error('ah')
}

export function detectColorSupport(): ColorSupport {
    throw new Error('ah')
}
