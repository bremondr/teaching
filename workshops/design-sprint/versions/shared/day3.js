// Day 3: build the prototype.
Deck.module({ id: "day3", title: "Day 3: prototype", slides: [
  { id: "open", min: 2, title: "Day 3: build a prototype",
    body: DS.agenda(3, "Today is about building something that looks real."),
    notes: DS.n("Show the plan of the day.") },
  { id: "fake", min: 3, title: "Fake it",
    body: "<h2>Faking it</h2><p>Instead of weeks of building, we make a front that looks and acts real but is not. That is enough to get honest reactions from users.</p>",
    notes: DS.n("Because the earlier days decided what matters, simple tools are enough.") },
  { id: "mindset", min: 3, title: "The prototype mindset",
    body: "<h2>Four ideas</h2><ol><li>You can prototype anything: an app, a leaflet, a service, a space</li><li>It is disposable. Do not make what you are not willing to throw away</li><li>Build just enough to learn</li><li>It has to look real, or users will not react honestly</li></ol>" },
  { id: "tools", min: 3, title: "Pick the right tools",
    body: "<h2>Choose tools by what you are making</h2><table><tr><td>On a screen</td><td>slides or a design tool</td></tr><tr><td>On paper</td><td>slides or a text editor</td></tr><tr><td>A service</td><td>a script, team members act it out</td></tr><tr><td>A space</td><td>change an existing room</td></tr><tr><td>An object</td><td>modify one, or fake the marketing</td></tr></table>",
    notes: DS.n("Add the tools your group already knows.") },
  { id: "roles", min: 3, title: "Roles",
    body: "<h2>Divide and conquer</h2><ul><li><b>Makers</b> (two or more) build the parts</li><li><b>Stitcher</b> joins the parts into one coherent whole</li><li><b>Writer</b> writes realistic text</li><li><b>Asset collector</b> finds images and other material</li><li><b>Interviewer</b> writes the script and will run the interviews</li></ul>",
    notes: DS.n("Show the roles, then let the team assign them. One person can hold more than one role in a small team.") },
  DS.timer({ id: "prep-clock", min: 10, title: "Prepare to prototype", text: "Choose tools, assign roles, agree on a time for the trial run." }),
  { id: "stitch", min: 2, title: "Stitching and the trial run",
    body: "<h2>Stitch it together, then rehearse</h2><ul><li>The stitcher checks dates, names and other fake details</li><li>Fix typos: small slips remind users it is fake</li><li>Trial run in the afternoon, leaving time to fix holes</li><li>Check it against the storyboard and the sprint questions</li><li>The interviewer practises with it</li></ul>" },
  DS.timer({ id: "build-clock", min: 240, title: "Build the prototype", text: "Check regularly that the parts still fit together." }),
  DS.timer({ id: "trial-clock", min: 10, title: "Trial run", text: "Does it work as intended? What breaks?" }),
  { id: "day3-wrap", min: 2, title: "End of day 3",
    body: "<h2>End of day 3</h2><p>We have a realistic prototype. Next we watch real users react to it.</p>" }
] });
