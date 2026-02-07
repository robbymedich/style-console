// https://developer.chrome.com/docs/devtools/console/format-style#style-ansi
export type { Color } from './colors.js'
export type { TextModifier, FontStyle } from './modifiers.js'
export { indent, dedent } from './spacing.js'
export { colors } from './colors.js'
export { textModifiers } from './modifiers.js'
export {
    setDefaultIndent,
    getDefaultIndent,
    getIndentPrefix,
    Style,
    LazyStyledText,
    StyledText,
    style,
} from './style.js'
