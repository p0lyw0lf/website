#let white = rgb(255, 255, 255)
#let off_black = rgb(25, 25, 25)
#let cherry = rgb(124, 12, 63)
#let longan = rgb(255, 216, 168)

#set page(width: 1200pt, height: 630pt, margin: 0pt, fill: off_black)
#set text(font: "Montserrat", lang: "no", weight: 600)

#let title = sys.inputs.at("title", default: "Untitled")
#let tags = sys.inputs.at("tags", default: "#untitled")
#let padding = 90pt


#place(
  bottom,
  rect(
    width: 100%,
    height: padding * 2 + 18pt,
    fill: cherry,
  ),
)

#pad(
  rest: padding,
  grid(
    rows: (1fr, auto),
    columns: (1fr, auto),
    gutter: padding,
    grid.cell(
      colspan: 2,
      align: left + horizon,
      text(
        fill: white,
        size: if title.len() > 70 { 60pt } else { 72pt },
        title,
      ),
    ),
    grid.cell(
      align: left,
      text(size: 24pt, fill: longan, tags),
    ),
    grid.cell(
      align: right,
      text(size: 24pt, fill: longan, "PolyWolf's blog"),
    ),
  ),
)
