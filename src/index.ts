// https://developer.chrome.com/docs/devtools/console/format-style#style-ansi
export type { Color } from './colors.js'
export type { FontStyle } from './modifiers.js'
export { indent, dedent } from './spacing.js'
export {
    Style,
    StyledText,
    style,
    getDefaultIndent,
    setDefaultIndent,
} from './style.js'
