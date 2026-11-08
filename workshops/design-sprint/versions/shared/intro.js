// The explanation intro: what a Design Sprint is and how the week looks (the 5 day outline).
// Used by the fall 2025 and spring 2025 versions. Based on the author's own "Design sprint explanation" slides.
Deck.module({ id: "intro", title: "What is a Design Sprint", slides: [
  { id: "what", min: 3, title: "What is a Design Sprint?",
    body: "<h2>What is a Design Sprint?</h2><p>A short, structured process for answering an important question: build a rough prototype, put it in front of real users, and learn from what they do.</p><p class='dk-small'>The method was described by Jake Knapp, John Zeratsky and Braden Kowitz (Google Ventures).</p>",
    notes: DS.n("Keep this short: the point is that a sprint trades long debate for a quick test.",
      "Image placeholder: the original deck linked a short video that explains the process in about ninety seconds. It is a third-party video and is not included. Use your own sketch of the week instead.") },
  { id: "week", min: 3, title: "The week at a glance", body: DS.week(5),
    notes: DS.n("This is the full five-day outline of the method. In the course the work is delivered in four sessions, so the prototype day and the testing day are the last two sessions; say so out loud.") },
  { id: "d1", min: 1, title: "Day 1 in a nutshell",
    body: "<h2>Day 1: define the scope of the week</h2><p>Agree on a long-term goal, draw a map of the challenge, hear from experts and pick one target.</p>",
    notes: DS.n("Image placeholder: the original slide shows a stock photo of a team at a whiteboard.") },
  { id: "d2", min: 1, title: "Day 2 in a nutshell",
    body: "<h2>Day 2: collect and sketch solutions</h2><p>Look at existing ideas to remix, then sketch alone with a four-step routine that turns thinking into something concrete.</p>",
    notes: DS.n("Image placeholder: stock photo of sketching on paper.") },
  { id: "d34", min: 1, title: "Days 3 and 4 in a nutshell",
    body: "<h2>Days 3 and 4: build a realistic prototype</h2><p>We fake it on purpose: a convincing front, built from the storyboard in about seven hours.</p>",
    notes: DS.n("Image placeholder: stock photo of a laptop with an interface being built.") },
  { id: "d5", min: 1, title: "Day 5 in a nutshell",
    body: "<h2>Day 5: learn from users</h2><p>Interview users while they try the prototype. By the end of the day we know how far we are and what to do next.</p>",
    notes: DS.n("Image placeholder: stock photo of a user test in progress.") },
  { id: "outcome", min: 1, title: "What we will have at the end",
    body: "<h2>At the end we know what to do next</h2><p>Clarity about the challenge, and solutions that real users have already reacted to.</p>" }
] });
