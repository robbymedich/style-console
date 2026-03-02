// https://developer.chrome.com/docs/devtools/console/format-style#style-ansi
export type { Color, FontStyle } from './options.js'
export type {
    Style,
    LazyStyledText,
    Stylist,
    StylistBuilder,
    StylistInitializer,
} from './style.js'
export { indent, dedent } from './spacing.js'
export { colors, colorOption, fontStyles, fontStyleOption } from './options.js'
export { style } from './style.js'
export { renderAnsi, stripAnsi, renderWeb } from './render.js'
