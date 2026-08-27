// Validated categorical palette (dark surface), fixed order — see the dataviz skill's palette.md.
// Never reorder or cycle past these slots; fold additional series into "otherColor" instead.
export const categoricalPalette = [
  '#3987e5', // blue
  '#d95926', // orange
  '#199e70', // aqua
  '#c98500', // yellow
  '#d55181', // magenta
  '#008300', // green
] as const

export const otherColor = '#52514e'
