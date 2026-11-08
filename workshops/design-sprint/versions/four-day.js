/* The 4 day variant (Nov 2024), written for a sprint team working on its own project. */
(function () {
  var S = "versions/shared/";
  (window.DS_VERSIONS = window.DS_VERSIONS || {})["four-day"] = {
    label: "4 day variant", current: false, channel: "design-sprint-four-day",
    summary: "The first four day version (2024). Day 1 starts with lightning talks, goal, questions and map, and the experts come in the afternoon. No expectations or learning-goal slides, and a slide for the roles in the team.",
    slides: [
      { id: "title", min: 1, title: "4 Day Design Sprint", body: "<h1>4 Day Design Sprint</h1><p>Solve a big problem and test an idea in four days</p>" },
      { id: "brief", include: S + "brief.js" },
      { id: "welcome", min: 2, title: "Welcome", body: "<h2>Welcome, and thanks for being here</h2><p>We are about to spend undivided time together to build and test a realistic prototype in just four days, using the Design Sprint process.</p>" },
      { id: "team", min: 5, title: "The sprint team",
        body: "<h2>The sprint team</h2><p>Who is in the room and what is each person's role?</p>" + DS.ph("List the team here: person, role (for example team leader, developer, domain expert, creator) and the project they work on."),
        notes: "<p>The original slide lists the participants with their roles. Those names are not part of this repository. Fill the team in for your run.</p>" },
      { id: "round", include: S + "kickoff.js" },
      { id: "what", min: 3, title: "What is a Design Sprint?", body: "<h2>What is a Design Sprint?</h2><p>A short, structured process for answering an important question by building a prototype and testing it with real users.</p><p class='dk-small'>The method was described by Jake Knapp, John Zeratsky and Braden Kowitz (Google Ventures).</p>" },
      { id: "week", min: 3, title: "The week at a glance", body: DS.week(4),
        notes: "<p>The original day slides each carry a stock photo; the photos are on the day slides of the fall and spring versions.</p>" },
      { id: "outcome", min: 1, title: "What we will have", body: "<h2>At the end we know what to do next</h2><p>Clarity about the challenge, and solutions that real users have reacted to.</p>" },
      { id: "day1", include: S + "day1-open.js" },
      { id: "goalmap", include: S + "goal-map.js" },
      { id: "experts", include: S + "experts.js" },
      { id: "interviews", include: S + "interviews.js" },
      { id: "target", include: S + "hmw-target.js" },
      { id: "day2", include: S + "day2-open.js" },
      { id: "sketch", include: S + "day2-a.js" },
      { id: "decide", include: S + "day2-b.js" },
      { id: "day3", include: S + "day3.js" },
      { id: "day4", include: S + "day4.js" }
    ]
  };
})();
