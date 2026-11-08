/* Spring 2025 run. Same order as fall 2025, except for three things: the welcome slide says "4/5 days",
 * the expert interview slides appear a second time after the day 1 milestone, and day 1 has no "Collecting unknowns" divider. */
(function () {
  var S = "versions/shared/";
  (window.DS_VERSIONS = window.DS_VERSIONS || {})["spring-2025"] = {
    label: "Spring 2025", current: false, channel: "design-sprint-spring-2025",
    summary: "The earlier run. Same four sessions as fall 2025, but the expert interview slides come twice on day 1 and the welcome still says four or five days.",
    slides: [
      { id: "title", min: 1, title: "Design Sprint", body: "<h1>Design Sprint</h1><p>Solve a big problem and test an idea with users</p><p class='dk-small'>Spring 2025 version</p>" },
      { id: "brief", include: S + "brief.js" },
      { id: "welcome", min: 2, title: "Welcome", body: "<h2>Welcome, and thanks for being here</h2><p>We are about to spend undivided time together to build and test a realistic prototype in four or five days, using the Design Sprint process.</p>" },
      { id: "expect", min: 5, title: "Your expectations", body: "<h2>Your expectations</h2><p>What do you hope to get out of this course?</p>" },
      { id: "goals", min: 3, title: "Learning goals", body: "<h2>Learning goals</h2><ul><li>Make rough prototypes and test them quickly</li><li>Understand what a Design Sprint is for</li><li>Experience the workshop and its methods, such as timeboxing</li><li>Practise making decisions quickly in a group</li></ul>" },
      { id: "intro", include: S + "intro.js" },
      { id: "teams", include: S + "kickoff.js" },
      { id: "day1", include: S + "day1-open.js" },
      { id: "experts", include: S + "experts.js" },
      { id: "interviews", include: S + "interviews.js" },
      { id: "learning", min: 5, title: "One key learning", body: "<h2>One key learning from the interviews</h2><p>Each person says the one thing they will remember.</p>" },
      { id: "goalmap", include: S + "goal-map.js" },
      { id: "asking", min: 1, title: "Asking the experts again", body: "<h2>Asking the experts</h2><p>A second round of interviews, after the map.</p>",
        notes: "<p>In the spring deck the interview slides appear twice: before the long-term goal and again after the milestone. Use the second round only if you have more experts to hear.</p>" },
      { id: "interviews2", include: S + "interviews.js" },
      { id: "target", include: S + "hmw-target.js" },
      { id: "day2", include: S + "day2-open.js" },
      { id: "topic", min: 5, title: "Topic scope and learning goals", body: "<h2>Teaching topic</h2><p>Define the learning goals and describe the scope of the topic.</p>" + DS.ph("Fill in for the run: the topic scope and what students should learn about it.") },
      { id: "sketch", include: S + "day2-a.js" },
      { id: "decide", include: S + "day2-b.js" },
      { id: "day3", include: S + "day3.js" },
      { id: "day4", include: S + "day4.js" }
    ]
  };
})();
