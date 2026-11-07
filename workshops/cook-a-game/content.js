// Workshop content: script blocks (B), slide texts (SL), twists (TW), teams (TEAMS), and the small data tables.
// Edit this file to change what the facilitator app says. The engine is in app.js.

// m = minutes in the 180 plan, m90 = minutes in the 90 plan (0 = left out), off = off by default
const B = [
 { id:"before", title:"Before the students arrive", outside:true, m:20, m90:20,
   do:["Tables for the teams, plus one open table for the deal. Piles of prepared cards face down; keep the twist cards with you.","Sticky notes in three colours, supplies for every team (see the supplies list below), the rules cards without the twist box. Keep the version with the twist box hidden until the twist.","Laptop and projector with this page open on Slides. The game you will take apart in the mini-lecture on the table."],
   mats:"The supplies list at the bottom of the Script plan view." },
 { id:"warm", title:"Warm-up: a simple card game they know", m:10, m90:0, off:true,
   say:["“Let's play one quick round before we start. Any game you all know.”"],
   do:["Play with one table in front of the room, others watch.","Ask afterwards: what was the goal, what did you do again and again?"],
   tips:["Skip it if the room is slow to start. The mini-lecture covers the same ground."] },
 { id:"welcome", title:"Welcome and how we work", m:4, m90:3,
   say:["“Today you design a small tabletop game from ingredients, play it, and improve it. At the end every team has a game a stranger can play.”"],
   es:"“Hoy van a diseñar un juego de mesa pequeño a partir de ingredientes, jugarlo y mejorarlo.”",
   do:["Say the language rule once: everything they write today is in English, so that you can read it.","One minute about yourself, then three rules of the room: make something playable; ideas are cheap, so try them; watching a player beats explaining to them."],
   tips:["Names come later. Teams mix by the team game."] },
 { id:"lecture", title:"Mini-lecture: what is a game", m:8, m90:5,
   say:["“What is a game, for you? Turn to your neighbour and agree on one word. 30 seconds.” Then ask three pairs.","“Now let's take a real game apart into its ingredients.”"],
   do:["2 minutes: pairs agree on one word for what a game is (no shouting out). Take three pairs and write their words on the board.","1 minute: set the scene on the Codenames slide, so everyone knows the game.","4 minutes: reverse-engineer it together into setting, thing, audience, mechanic, goal and limit. Click each box to reveal after the students guess. Replace the game if you bring another.","1 minute: the five parts every game has, and which of them are today's ingredients."],
   tips:["Codenames is Czech (Vlaada Chvátil) and has a picture version that needs no shared language."],
   open:"To do: get a physical copy of Codenames (Pictures) to bring, or pick a game you can get in Guadalajara. It is in the to-do list." },
 { id:"notes", title:"Write the pantry notes", m:8, m90:0,
   say:["“Three notes each. One idea per note, one word to one line, in English, so that I can read them.”"],
   es:"“Tres notas cada uno. Una idea por nota, de una palabra a una línea, en inglés, para que yo pueda leerlas.”",
   do:["Hand out three sticky notes per student, one colour per category.","Setting: a place or situation. Thing: a character or object that must be in the game. Audience: who plays and where. Give two examples of each.","Four minutes of silent writing. Collect into three piles and shuffle."],
   tips:["Keep it kind and playable. Reject anything that is only a joke at someone's expense.","Language rule: everything the students write is in English, so that you can read it. Say it again at the idea card, the rules card and the back of the rules card."] },
 { id:"deal", title:"Teams, deal and choose", m:10, m90:5,
   say:["“Each team draws two notes from each student pile and keeps one. The ones you do not keep go in the middle.”"],
   es:"“Cada equipo saca dos notas de cada montón y se queda con una. Las que no se queden se ponen en el centro.”",
   do:["Make the teams with the team slips on the first slide. Set the number of students and the team size there, and it works out how many picture slips of each fruit or vegetable to hand out (team-slips.pdf). Late arrivals: press + and hand out one more slip.","Each team: 2 notes per student pile, keep 1; the others go to the discard pile on the middle table (the twist T15 needs it).","Then 1 mechanic, 1 goal, 1 limit. One swap of the mechanic is allowed. Teams write the card codes on their idea card.","Read out loud any clash marked with the small ≠ on the cards."],
   mats:"In the 90 min plan use printed ingredients only: one setting, one mechanic, one goal." },
 { id:"sentence", title:"One-sentence game idea", m:10, m90:5,
   say:["“In this game, [who plays] [do something] to [reach the goal] in [setting] with [thing].”"],
   do:["Hand out the idea card (idea-card.pdf, 10 per page). Teams fill it in and say it to you in under 10 seconds.","If a team is stuck, start from the mechanic card."],
   mats:"idea-card.pdf" },
 { id:"build", title:"Build the paper prototype", m:40, m90:25,
   say:["“A stranger must be able to play after reading your rules card, and your rules must fit on it. It is A6.”","At the halfway point: “Play it once with your own team now.”"],
   do:["Walk round at the times shown by the clock. Ask: who is playing, what do they do, how does it end?","Time calls: 15 minutes left, 5 minutes left."],
   tips:["Ask questions, do not solve their problems."],
   mats:"Per team: about 40 index cards, pens and 4 markers, 20 tokens, scissors, tape, 10 sheets of A4. Full list in the supplies list below.",
   cues:[{at:10,t:"Walk round: who is playing, what do they do, how does it end?"},{at:20,t:"Say: play it once with your own team now."},{at:30,t:"Check in again. Rules card in 10 minutes."},{left:15,t:"15 minutes left."},{left:5,t:"5 minutes left."}] },
 { id:"rules", title:"Rules card checkpoint", m:5, m90:3,
   say:["“Write the rules on this A6 card. If it does not fit, the game is too complicated.”","“The size is the limit, and it is the same for every team.”"],
   do:["Hand out the rules card without the twist box.","Show the filled-in example for 30 seconds.","Teams fill in name, players, time, ingredient codes, goal, setup, how to play and the end."],
   tips:["The size of the card is the limit for the rules and it applies to every team. It is not an ingredient card. After the twist the final card is bigger (A5), because it holds the final version of all the rules."],
   mats:"rules-card.pdf, rules-card-example.pdf" },
 { id:"break", title:"Short break", m:10, m90:0,
   do:["Ask the hosts whether the schedule has a break. If it does, put it here, before the twist."] },
 { id:"twist", title:"Deal the twists", m:5, m90:2,
   say:["“Your game has to change. You cannot ignore the card.”"],
   es:"“Su juego tiene que cambiar. No pueden ignorar la carta.”",
   do:["Open Notes and tools on your own screen (not the projector) and use the twist dealer, or pick the cards by hand. Teams read the card silently.","For T12 to T16 use the student piles: a new audience, a second setting or thing, a note from the discard pile, a swap of audiences.","Hand out the final rules card (A5, with the twist box). Teams copy their rules onto it, with the changes, and write the twist code on it.","Check the ≠ notes against the limit and the ingredients."],
   mats:"rules-card-with-twist.pdf" },
 { id:"adapt", title:"Adapt to the twist", m:30, m90:15,
   do:["Teams change the game and fill in the “After the twist” box.","The rules still have to fit on the card. At 25 minutes: prototypes ready to be played.","A team that finishes early explains its game to another team in 30 seconds."],
   cues:[{at:10,t:"Say: the rules still have to fit on the card."},{at:25,t:"Say: prototypes ready to be played in 5 minutes."}] },
 { id:"play1", title:"Silent playtest, round 1", m:18, m90:15,
   say:["“Designers, you stay silent. Do not help. Watch, and write down what confuses people.”"],
   es:"“Diseñadores, en silencio. No ayuden. Observen y anoten lo que confunde.”",
   do:["Run the rotation on the slide. Every team splits in half: one half stays with the game as silent hosts, the other half visits another game. All games are tested at the same time.","Visitors read the rules card for a minute, then play.","Hosts note on the rules card where players hesitated."],
   tips:["If a game needs more players (check its rules card), the hosts may also play for that round, still silent about the design."] },
 { id:"play2", title:"Silent playtest, round 2", m:17, m90:0, opt:5,
   tips:["Optional. If the clock shows more than 5 minutes behind the plan, skip this round: the page offers a Skip button."],
   do:["Swap roles: the hosts become visitors and the visitors host. The slide shows the new tables.","Stranger test: tick the box on the rules card if a stranger played correctly without help."] },
 { id:"fix", title:"Fix the game: I like, I wish, what if", m:5, m90:5,
   do:["Based on what the hosts saw during the playtests, each team writes three changes on the back of the rules card: one thing they like, one they wish, one what if.","Tick the stranger-test box on the rules card if it applies."] },
 { id:"pitch", title:"One-minute pitches", m:7, m90:5, off:true,
   say:["“Name, one sentence, what changed after the twist, what you learned.”"],
   do:["One minute per team, a short changeover. Photograph each prototype and its rules card.","Use the pick-a-team tool and the clock reset for each team."] },
 { id:"wrap", title:"Reflection and wrap-up", m:5, m90:2,
   say:["“What did watching other people play your game teach you?”"],
   do:["Take three answers from the room. Thank the students and the hosts.","Collect the rules cards and ask teams to keep their games."] }
];

// Slides. Each block gives one or more slides. Fields: h headline, es Spanish line, lines [[en, es?]], chips, sentence, w = widget name.
const SL = {
 warm: [{ h:"Warm-up", es:"Calentamiento", lines:[["One quick round of a game you all know","Una ronda rápida de un juego que todos conocen"]] }],
 welcome: [
  { t:false, nokick:true, presenter:true, h:"Cook a game", es:"Cocina un juego", lines:[["Design, play and improve a small tabletop game made from ingredients","Diseña, juega y mejora un juego de mesa pequeño hecho con ingredientes"]] },
  { t:false, h:"Three rules", es:"Tres reglas", lines:[["Make something playable","Hagan algo jugable"],["Ideas are cheap, try them","Las ideas son baratas, pruébenlas"],["Watching a player beats explaining to them","Ver jugar vale más que explicar"]] }],
 lecture: [
  { key:"lecture:0", t:false, h:"What is a game, for you?", es:"¿Qué es un juego para ustedes?", lines:[["Turn to your neighbour. Agree on one word that says what a game is. 30 seconds.","Voltéense con su vecino. Pónganse de acuerdo en una palabra que diga qué es un juego. 30 segundos."],["Then three pairs tell us their word","Luego tres parejas nos dicen su palabra"]] },
  { key:"lecture:scene", t:false, h:"Codenames", es:"Un juego checo", w:"codegrid", lines:[["Two teams. Each has a spymaster who knows which words are theirs.","Dos equipos. Cada uno tiene un jefe de espías que sabe qué palabras son suyas."],["The spymaster gives a one-word clue and a number. The team guesses.","El jefe de espías da una pista de una palabra y un número. El equipo adivina."]] },
  { key:"lecture:1", t:false, h:"Take a real game apart", w:"reverse", lines:[] },
  { key:"lecture:2", t:false, h:"Five parts of every game", es:"Cinco partes de todo juego", w:"five", lines:[] }],
 notes: [{ h:"Write three notes", es:"Escriban tres notas", w:"notes", lang:true, lines:[["One idea per note, in English so that I can read it. Use the yellow, green and pink notes.","Una idea por nota, en inglés para que yo pueda leerla. Usen las notas amarilla, verde y rosa."]] }],
 deal: [
  { h:"Make the teams", w:"teams", lines:[] },
  { h:"Draw your ingredients", es:"Saquen sus ingredientes", lines:[["From each student pile take 2 notes and keep 1. The others go in the middle.","De cada montón tomen 2 notas y se quedan con 1. Las otras van al centro."],["Take 1 mechanic, 1 goal and 1 limit. You may swap the mechanic once.","Tomen 1 mecánica, 1 meta y 1 límite. Pueden cambiar la mecánica una vez."],["Write the card codes on your idea card","Anoten los códigos en su carta de idea"]], chips:[["● M mechanic","var(--c-mech)"],["★ G goal","var(--c-goal)"],["■ L limit","var(--c-limit)"]] }],
 sentence: [{ lang:true, h:"One sentence", es:"Una frase", sentence:true, lines:[["Say it in 10 seconds. Write it on your idea card.","Díganla en 10 segundos. Escríbanla en su carta de idea."]] }],
 build: [{ h:"Build a paper prototype", es:"Construyan un prototipo de papel", chips:["Index cards","Pens","Markers","Tokens","Scissors","Tape","Paper"], lines:[["A stranger must be able to play from your rules card, and your rules must fit on it (A6)","Un desconocido debe poder jugar con su carta de reglas, y sus reglas deben caber en ella (A6)"],["Play it once with your own team","Jueguen una vez con su propio equipo"]] }],
 rules: [{ lang:true, h:"The rules card", es:"La carta de reglas", lines:[["A6 card. Every team has the same size.","Carta A6. Todos los equipos tienen el mismo tamaño."],["If the rules do not fit, simplify the game","Si las reglas no caben, simplifiquen el juego"],["Name · players · time · ingredient codes · goal · setup · how to play · end","Nombre · jugadores · tiempo · códigos · objetivo · preparación · cómo se juega · final"]] }],
 break: [{ h:"Break", es:"Descanso", w:"break", lines:[] }],
 twist: [{ lang:true, h:"Twist time", es:"Hora del giro", lines:[["Your game has to change","Su juego tiene que cambiar"],["Read your card silently. Do not show it.","Lean su carta en silencio. No la muestren."],["Take the bigger A5 rules card. It is the final version of all your rules.","Tomen la carta de reglas A5, más grande. Es la versión final de todas sus reglas."],["Write the twist code on it","Anoten en ella el código del giro"]] }],
 adapt: [{ h:"Adapt your game", es:"Adapten su juego", lines:[["Change the game to fit the twist","Cambien el juego para que encaje con el giro"],["Fill in “After the twist”","Llenen “Después del giro”"],["The rules still fit on the card","Las reglas siguen cabiendo en la carta"]] }],
 play1: [{ h:"Silent playtest, round 1", es:"Prueba en silencio, ronda 1", w:"rot1", lines:[["Hosts: stay silent, do not help, note where players hesitate","Anfitriones: en silencio, sin ayudar, anoten dónde dudan"],["Visitors: read the card, then play","Visitantes: lean la carta y jueguen"]] }],
 play2: [{ h:"Silent playtest, round 2", es:"Prueba en silencio, ronda 2", w:"rot2", lines:[["Swap roles. Same rule: hosts stay silent.","Cambien de papel. Misma regla: los anfitriones en silencio."]] }],
 fix: [{ lang:true, h:"I like · I wish · What if", es:"Me gusta · Desearía · Y si", chips:["I like","I wish","What if"], lines:[["Use what you saw while others played your game","Usen lo que vieron mientras otros jugaban su juego"],["Write them on the back of the rules card","Escríbanlas en el reverso de la carta de reglas"]] }],
 pitch: [{ h:"One minute each", es:"Un minuto cada equipo", lines:[["Name of the game","Nombre del juego"],["Your one sentence","Su frase"],["What changed after the twist","Qué cambió después del giro"],["What you learned","Qué aprendieron"]] }],
 wrap: [
  { key:"wrap:0", t:false, h:"What did watching others play your game teach you?", es:"¿Qué les enseñó ver a otros jugar su juego?", lines:[] },
  { key:"wrap:thanks", t:false, h:"Thank you", es:"Gracias", lines:[] }]
};
const TW = [
 ["T1","Add a hidden role","Añade un rol oculto"],["T2","Add a second way to win","Añade una segunda forma de ganar"],
 ["T3","Make it work for a 10-year-old","Hazlo jugable para un niño de 10 años"],["T4","Swap your Thing with another team's","Cambia tu objeto por el de otro equipo"],
 ["T5","Nobody wins any more","Ya nadie gana"],["T6","Add a coin flip or a draw that changes one result","Añade una moneda o un sorteo que cambie un resultado"],
 ["T7","Take the setting of another team","Toma el escenario de otro equipo"],["T8","Make the game last half as long","Haz que el juego dure la mitad"],
 ["T9","Reward a surprise","Premia una sorpresa"],["T10","Add a secret signal teammates can use","Añade una señal secreta entre compañeros"],
 ["T11","Make it playable without sharing a language","Haz que se pueda jugar sin hablar el mismo idioma"],["T12","Draw a new Audience from the pile","Saca un nuevo público del montón"],
 ["T13","Add a second Setting from the pile","Añade un segundo escenario del montón"],["T14","Add a second Thing from the pile","Añade un segundo objeto del montón"],
 ["T15","Rescue a discarded note","Rescata una nota descartada"],["T16","Trade Audiences with another team","Cambia tu público con otro equipo"]
];
const TEAMS = [["🌶️","Chili","Chile"],["🥑","Avocado","Aguacate"],["🌽","Corn","Maíz"],["🍅","Tomato","Tomate"],["🥭","Mango","Mango"],["🍍","Pineapple","Piña"],["🍌","Banana","Plátano"],["🥕","Carrot","Zanahoria"]];
function tn(i) { return i < TEAMS.length ? TEAMS[i][0] + " " + TEAMS[i][1] : "Team " + (i + 1); }
function tnb(i) { return i < TEAMS.length ? TEAMS[i][0] + " " + TEAMS[i][1] + " / " + TEAMS[i][2] : "Team " + (i + 1); }
const REV = [["Setting","Rival spy agencies","--c-setting"],["Thing","25 word or picture cards in a 5 × 5 grid","--c-thing"],["Audience","4 to 8 players, a group of friends","--c-audience"],["Mechanic","Clue giving and guessing, hidden roles","--c-mech"],["Goal","Find all your team's agents first","--c-goal"],["Limit","One-word clue; the spymaster stays silent","--c-limit"]];
const FIVE = [["Player","Who plays?","Audience","--c-audience"],["Goal","How do you win?","Goal card","--c-goal"],["Rules","What limits the play?","Limit card","--c-limit"],["Core loop","What do players do again and again?","Mechanic card","--c-mech"],["Feedback","How does the game answer a move?","You design it","--stage-fg"]];
const CGW = ["BANK","MOON","BAT","TABLE","SPY","DOG","RING","BRIDGE","CAKE","PIANO","LION","KEY","SNOW","TRAIN","FIRE","NOTE","WAVE","CROWN","PEN","CLOUD","GLASS","ARROW","PLANE","BREAD","STAR"];
