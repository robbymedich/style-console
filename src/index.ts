/**
 * Public entry point for the style-console package.
 *
 * Re-exports the builder API, rendering utilities, spacing helpers, and the
 * option/type definitions that power the style system.
 */
// https://developer.chrome.com/docs/devtools/console/format-style#style-ansi
export type { Color, BackgroundColor, FontStyle } from './options.js'
export type {
    Style,
    StyledText,
    Stylist,
    StylistBuilder,
    StylistInitializer,
} from './style.js'
export { indent, dedent } from './spacing.js'
export { colors, backgroundColors, fontStyles } from './options.js'
export { style, IterStyledText } from './style.js'
export { style2, renderAnsi2 } from './style2.js'
export {
    concat,
    // concatWs,
    stripAnsi,
    renderAnsi,
    cssStyle,
    setCssColors,
    stripWeb,
    renderWeb,
} from './render.js'
