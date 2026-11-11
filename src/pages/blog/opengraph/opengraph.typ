#set page(width: 1200pt, height: 630pt, margin: 80pt, fill: rgb(25, 25, 25))
#set text(font: "Anonymous Pro", fill: white, lang: "no")

#let title = sys.inputs.at("title", default: "An Untitled Post With An Appropriate Amount Of Untitledness")

#grid(
  rows: (1fr, auto),
  align(left + horizon, {
    text(
      size: if title.len() > 70 { 60pt } else { 72pt },
      weight: 800,
      title,
    )
  }),
  text(size: 24pt, "PolyWolf's blog"),
)
