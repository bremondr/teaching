// The two expert interviews, as time-boxed slides.
Deck.module({ id: "interviews", title: "Expert interviews", slides: [
  DS.timer({ id: "interview1", min: 30, title: "Expert interview 1", text: "Interviewers ask. Everyone else writes HMW notes.",
    notes: DS.n("Around thirty minutes per expert.") }),
  DS.timer({ id: "interview2", min: 30, title: "Expert interview 2", text: "Same again with the next expert.",
    notes: DS.n("Around thirty minutes. If there is only one expert, skip this slide.") })
] });
