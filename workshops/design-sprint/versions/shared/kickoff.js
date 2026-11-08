// Opening of the first working session: introductions, ground rules, the challenge.
Deck.module({ id: "kickoff", title: "Kick-off", slides: [
  { id: "round", min: 10, title: "Do you know each other?",
    body: "<h2>Quick introductions</h2><p>Say your name, your role and the area you work in, or why you are here.</p><p class='dk-small'>Facilitator and Decider: say what your job is in this workshop.</p>",
    notes: DS.n("About ten minutes for a team of twenty if you keep each introduction to one sentence. Use the team picker slide if you want a random order.") },
  { id: "rules", min: 3, title: "Ground rules",
    body: "<h2>Four ground rules</h2><ul class='ds-icons'><li><img class='ds-icon' src='../../assets/icon-timebox.webp' alt='Clock icon'><b>Timebox:</b> we keep to the clock and the breaks, it will feel fast</li><li><img class='ds-icon' src='../../assets/icon-no-devices.webp' alt='Crossed-out phone icon'><b>No distractions:</b> devices away, step out when you need to</li><li><img class='ds-icon' src='../../assets/icon-one-conversation.webp' alt='Speech bubbles icon'><b>Engagement:</b> be helpful, be flexible</li><li><img class='ds-icon' src='../../assets/icon-sticky-notes.webp' alt='Sticky notes icon'><b>Alone together:</b> think on your own, share in an agreed order</li></ul>",
    notes: DS.n("The rules are the same as in the original decks, paraphrased here; the icons are from The Design Sprint deck by Jake Knapp. Ask for a nod from everyone before moving on.") },
  { id: "challenge", min: 5, title: "The challenge",
    body: "<h2>The challenge</h2>" + DS.ph("Present the brief for this run here: who it is for, what the challenge is and what we hope to have at the end."),
    notes: DS.n("The brief changes with every run, so this slide is left as a prompt. Edit it in your own copy or talk over it.") }
] });
