// Day 1 block: organise and vote on HMW notes, choose the target, close the day.
Deck.module({ id: "target", title: "Organise, vote, choose the target", slides: [
  { id: "organise", min: 3, title: "Organise the notes",
    body: "<h2>Too many notes to use</h2><p>The interviews produce thirty to a hundred notes. We have to sort them before we can use them.</p><ol><li>Stick them up with no order</li><li>Spot themes and name them</li><li>Group the notes under their theme</li></ol>",
    notes: DS.n("Image placeholder: the original shows notes grouped under theme labels. Do it live on the wall.",
      "Expect a leftover group of oddments. Keep it, those notes are sometimes the most interesting.") },
  DS.timer({ id: "organise-clock", min: 5, title: "Group the HMW notes", text: "Stick up, name the themes, move notes under them." }),
  { id: "vote", min: 2, title: "Vote on the notes",
    body: "<h2>Dot voting</h2><ol><li>Two dots for each team member, four for the Decider</li><li>Reread the goal and sprint questions</li><li>Pick the most useful notes, in silence</li><li>Voting for your own note, or twice for one, is fine</li></ol>",
    notes: DS.n("Dots can be stickers or marker dots.") },
  DS.timer({ id: "vote-clock", min: 10, title: "Vote in silence", text: "Review the goal and sprint questions first." }),
  { id: "place", min: 2, title: "Place the voted notes on the map",
    body: "<h2>Put the winners on the map</h2><p>Take the notes with several votes off the wall and put each one at the step of the journey it belongs to. Do not discuss for long. When in doubt, place it further to the left.</p>" },
  DS.timer({ id: "place-clock", min: 5, title: "Place the notes", text: "Quickly, no long debate." }),
  { id: "target-how", min: 2, title: "Choose one target",
    body: "<h2>The big decision of the day</h2><p>Look back at the goal, the questions, the map and the notes. Then choose <b>one customer</b> and <b>one moment</b> on the map to focus on for the rest of the sprint.</p><ul><li>The Decider makes the call</li><li>If the Decider wants help, everyone writes a private choice first, then compare</li></ul>",
    notes: DS.n("Discuss only large differences of opinion. Then the Decider chooses.") },
  DS.timer({ id: "target-clock", min: 10, title: "Choose the target", text: "Focus on the notes. If in doubt, go further left." }),
  { id: "recheck", min: 3, title: "Back to the sprint questions",
    body: "<h2>Which sprint questions does the target answer?</h2><p>One sprint cannot answer them all. Mark those that fit the target.</p>" },
  { id: "wrap", min: 2, title: "End of day 1",
    body: "<h2>End of day 1</h2><ul><li>Long-term goal and sprint questions</li><li>A map and one target</li><li>One shared picture of the week</li></ul><p>See you next time.</p>" }
] });
