// https://developer.chrome.com/docs/devtools/console/format-style#style-ansi
export type { Color, BackgroundColor, FontStyle } from './options.js'
export type {
    Style,
    LazyStyledText,
    Stylist,
    StylistBuilder,
    StylistInitializer,
} from './style.js'
export { indent, dedent } from './spacing.js'
export {
    colors,
    backgroundColors,
    colorOption,
    fontStyles,
    fontStyleOption,
} from './options.js'
export { style, createStylist } from './style.js'
export {
    stripAnsi,
    renderAnsi,
    cssStyle,
    setCssColors,
    stripWeb,
    renderWeb,
} from './render.js'
