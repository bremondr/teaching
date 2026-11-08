/* Fall 2025 run: the canonical version (newest). Four working sessions.
 * Day 1 order: experts and HMW notes first, then lightning talks, goal, questions, map, then voting and the target. */
(function () {
  var S = "versions/shared/";
  (window.DS_VERSIONS = window.DS_VERSIONS || {})["fall-2025"] = {
    label: "Fall 2025", current: true, channel: "design-sprint-fall-2025",
    summary: "The newest run and the canonical version. Four sessions, experts on day 1 before the goal and the map, with expectations and learning goals at the start.",
    slides: [
      { id: "title", min: 1, title: "Design Sprint", body: "<h1>Design Sprint</h1><p>Solve a big problem and test an idea with users in four sessions</p><p class='dk-small'>Fall 2025 version</p>" },
      { id: "brief", include: S + "brief.js" },
      { id: "welcome", min: 2, title: "Welcome", body: "<h2>Welcome, and thanks for being here</h2><p>We are about to spend undivided time together to build and test a realistic prototype in four sessions, using the Design Sprint process.</p>" },
      { id: "expect", min: 5, title: "Your expectations", body: "<h2>Your expectations</h2><p>What do you hope to get out of this course?</p>",
        notes: "<p>Ask for a few answers aloud or on sticky notes. Compare them with the learning goals on the next slide.</p>" },
      { id: "goals", min: 3, title: "Learning goals", body: "<h2>Learning goals</h2><ul><li>Make rough prototypes and test them quickly</li><li>Understand what a Design Sprint is for</li><li>Experience the workshop and its methods, such as timeboxing</li><li>Practise making decisions quickly in a group</li></ul>" },
      { id: "intro", include: S + "intro.js" },
      { id: "teams", include: S + "kickoff.js" },
      { id: "day1", include: S + "day1-open.js" },
      { id: "unknowns", min: 1, title: "Collecting unknowns", body: "<h2>Collecting unknowns</h2><p>First we find out what we do not know yet.</p>" },
      { id: "experts", include: S + "experts.js" },
      { id: "interviews", include: S + "interviews.js" },
      { id: "learning", min: 5, title: "One key learning", body: "<h2>One key learning from the interviews</h2><p>Each person says the one thing they will remember.</p>" },
      { id: "goalmap", include: S + "goal-map.js" },
      { id: "target", include: S + "hmw-target.js" },
      { id: "day2", include: S + "day2-open.js" },
      { id: "topic", min: 5, title: "Topic scope and learning goals", body: "<h2>Teaching topic</h2><p>Define the learning goals and describe the scope of the topic.</p>" + DS.ph("Fill in for the run: the topic scope and what students should learn about it."),
        notes: "<p>Spring and fall versions have this block on day 2. Its content is specific to each run, so it is left as a prompt.</p>" },
      { id: "sketch", include: S + "day2-a.js" },
      { id: "decide", include: S + "day2-b.js" },
      { id: "day3", include: S + "day3.js" },
      { id: "day4", include: S + "day4.js" }
    ]
  };
})();
