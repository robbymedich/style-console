// https://developer.chrome.com/docs/devtools/console/format-style#style-ansi
export type { Color } from './colors.js'
export type { TextModifier, FontStyle } from './modifiers.js'
export type {
    Style,
    LazyStyledText,
    StringToLazyStyledText,
    ArrayToLazyStyledText,
    Stylist,
    StyleBuilderChain,
    StyleBuilder,
} from './style.js'
export { indent, dedent } from './spacing.js'
export { colors } from './colors.js'
export { textModifiers } from './modifiers.js'
export { style } from './style.js'
