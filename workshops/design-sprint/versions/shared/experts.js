// Day 1 block: asking the experts and writing How Might We notes.
Deck.module({ id: "experts", title: "Ask the experts", slides: [
  { id: "why", min: 3, title: "Ask the experts",
    body: "<h2>Nobody knows everything</h2><p>What we need to know is spread over the team, the organisation and outside people. Interviewing experts is the quickest way to pull it together.</p>",
    notes: DS.n("Experts can be people in the team, colleagues, or outsiders. If real experts are not available, role-play them with team members who know the topic.") },
  { id: "how", min: 3, title: "How to interview an expert",
    body: "<h2>Let the expert correct us</h2><ul><li>Ask them to retell what we think we know</li><li>Ask where we have it wrong</li><li>Is anything missing from the map or the questions?</li><li>Keep asking: why? tell me more</li></ul>",
    notes: DS.n("The goal of the interview is to improve the map, not to collect polite answers.") },
  { id: "hmw", min: 3, title: "How Might We notes",
    body: "<h2>Take notes as How Might We questions</h2><p>While you listen, turn every problem you hear into a question that starts with How Might We (HMW).</p><ul><li><b>How:</b> a solution exists, we just have to find it</li><li><b>Might:</b> no judging, anything is allowed</li><li><b>We:</b> we solve it together</li></ul>",
    notes: DS.n("This creates a shared pool of short notes straight from the interviews, which the team organises right after.") },
  { id: "hmw-size", min: 3, title: "Not too narrow, not too broad",
    body: "<h2>Find the right size</h2><table><tr><td>Too narrow</td><td>HMW add a search box?</td></tr><tr><td>Too broad</td><td>HMW redesign the whole school website?</td></tr><tr><td>About right</td><td>HMW help a parent find a pupil's latest work in under a minute?</td></tr></table><p class='dk-small'>Too narrow already contains the answer. Too broad gives no focus.</p>",
    notes: DS.n("These examples are written for this workshop. Ask the group for one more example per row.") },
  { id: "hmw-write", min: 2, title: "How to write HMW notes",
    body: "<h2>Writing the notes</h2><ol><li>Write HMW in the corner of a sticky note</li><li>Listen</li><li>When you hear something interesting, turn it into a question</li><li>One idea per note, set it aside</li><li>Keep going until the interview ends</li></ol>",
    notes: DS.n("Write quietly so as not to disturb the interview.") }
] });
