// Day 4: test with users.
Deck.module({ id: "day4", title: "Day 4: testing", slides: [
  { id: "open", min: 2, title: "Day 4: testing",
    body: DS.agenda(4, "Today we learn from users."),
    notes: DS.n("Show the plan of the day.") },
  { id: "five", min: 3, title: "Five users",
    body: "<h2>Five interviews are enough to see patterns</h2><p>A widely quoted usability rule of thumb says five users reveal most major problems. Five one-hour interviews also fit into one day.</p>",
    notes: DS.n("Treat this as a rule of thumb, not a guarantee. If the audience cares about the source, look it up before you cite it; it is not given in the original slides.") },
  { id: "five-acts", min: 4, title: "A five-part interview",
    body: "<h2>Interview in five parts</h2><ol><li>A friendly welcome: we test the product, not you</li><li>Context questions about their life</li><li>Introduce the prototype and ask them to think aloud</li><li>Realistic tasks, with gentle nudges</li><li>Short debrief: how would you describe it to a friend?</li></ol>" },
  { id: "together", min: 2, title: "Watch together",
    body: "<h2>Watch together, learn together</h2><p>When everyone sees the same interview, learning is faster and the conclusions are better. At the end of the day the team can decide the next step on what it saw.</p>" },
  { id: "grid", min: 3, title: "Take notes in a grid",
    body: "<h2>A shared note grid</h2><ul><li>Draw columns for the five users and rows for the parts of the prototype or sprint questions</li><li>Everybody writes quotes, observations and interpretations on notes, marked as positive, neutral or negative</li><li>Be quiet during the interviews</li><li>After each interview, stick the notes in the right cell</li></ul>",
    notes: DS.n("Image placeholder: the original shows a grid with five named columns, sample notes and a legend for the markers. Draw your own on the board.") },
  DS.timer({ id: "interview-clock", min: 60, title: "One interview", text: "Everyone writes notes. Be quiet. Reset for the next user.",
    notes: DS.n("Take a break after each interview, then put the notes on the grid.") }),
  { id: "debrief", min: 3, title: "Debrief",
    body: "<h2>Find the patterns</h2><ol><li>Spend five to ten minutes silently looking for patterns</li><li>Read them out; the facilitator records them as positive, negative or neutral</li><li>Review the sprint questions to see which patterns matter most</li><li>Decide on next steps: the Decider decides</li></ol>" },
  { id: "end", min: 2, title: "End",
    body: "<h2>You cannot lose a sprint</h2><p>If you test with users you learn, in a few days, whether you are on the right track.</p><p>Thank you.</p>" }
] });
