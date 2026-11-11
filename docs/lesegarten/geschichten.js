const newReadingStories = [
  {
    t: 'Ein Bad für die Amsel',
    c: 'animals',
    s: '{N} sitzt auf einer Bank im Schulhof. Neben der Bank steht eine flache Schale mit Wasser. Eine Amsel hüpft an den Rand. Sie taucht den Kopf ins Wasser und flattert mit den Flügeln. Kleine Tropfen fliegen durch die Luft. {N} bleibt ganz still sitzen.',
    x: 'Nach dem Bad fliegt die Amsel auf einen Ast. Dort schüttelt sie sich. Als die Pause vorbei ist, erzählt {N} der Klasse von dem Vogel.',
    q: [
      ['Wo sitzt {N}?', ['Auf einer Bank', 'Auf einer Schaukel', 'Auf einer Mauer'], 0],
      ['Was ist in der Schale?', ['Sand', 'Wasser', 'Futter'], 1],
      ['Richtig oder falsch? Die Amsel taucht den Kopf ins Wasser.', ['Richtig', 'Falsch'], 0],
      ['Warum bleibt {N} wohl still sitzen?', null, 'Damit die Amsel sich nicht erschreckt und in Ruhe baden kann.'],
      ['Was geschieht zuerst?', ['Tropfen fliegen durch die Luft.', 'Die Amsel hüpft an den Rand.', 'Die Amsel flattert mit den Flügeln.'], 1],
      ['Welche Körperteile der Amsel kommen im Text vor?', null, 'Kopf und Flügel.']
    ],
    alt: 'Eine Amsel badet in einer Schale im Schulhof.',
    extra: {
      words: ['AMSEL', 'SCHALE'], clues: ['Welcher Vogel badet?', 'Worin ist das Wasser?'],
      gap: 'Die Amsel flattert mit den _____.', bank: 'Flügeln · Ohren · Füßen', answer: 'Flügeln',
      seq: ['Die Amsel flattert mit den Flügeln.', '{N} sitzt auf der Bank.', 'Die Amsel hüpft an den Rand.'], order: '3 – 1 – 2',
      seen: ['Vogel', 'Schale', 'Schlitten'], correct: 'Vogel und Schale',
      title: 'Ein Vogel im Schulhof', proof: '{N} macht beim Zuschauen keinen Lärm.', quote: '{N} bleibt ganz still sitzen.'
    }
  },
  {
    t: 'Spuren im Schnee',
    c: 'animals',
    s: 'In der Nacht hat es geschneit. {N} geht mit Emil zum Gartenzaun. Im frischen Schnee sind kleine Spuren. Sie führen bis zu einer Hecke. Die beiden Kinder bleiben stehen und schauen genau hin. Plötzlich bewegt sich etwas unter den Zweigen. Ein Hase springt über die Wiese.',
    x: 'Bald ist der Hase nicht mehr zu sehen. Emil entdeckt noch eine Reihe Spuren. Die Kinder schauen sie vom Weg aus an und gehen dann nach Hause.',
    q: [
      ['Mit wem geht {N} zum Gartenzaun?', ['Mit Emil', 'Mit Mia', 'Mit Oma'], 0],
      ['Wohin führen die Spuren?', ['Bis zum Teich', 'Bis zur Hecke', 'Bis zur Bank'], 1],
      ['Richtig oder falsch? Die Kinder sehen einen Fuchs.', ['Richtig', 'Falsch'], 1],
      ['Warum bleiben die Kinder wohl stehen?', null, 'Sie möchten genau hinschauen und sehen, was sich bei der Hecke bewegt.'],
      ['Was geschieht zuerst?', ['Ein Hase springt über die Wiese.', 'Etwas bewegt sich unter den Zweigen.', 'Die Kinder sehen Spuren im Schnee.'], 2],
      ['Wo bewegt sich etwas?', null, 'Unter den Zweigen.']
    ],
    alt: 'Zwei Kinder betrachten Spuren im Schnee bei einer Hecke.',
    extra: {
      words: ['HASE', 'SCHNEE'], clues: ['Welches Tier springt über die Wiese?', 'Worin sind die Spuren?'],
      gap: 'Die Spuren führen bis zu einer _____.', bank: 'Hecke · Tür · Bank', answer: 'Hecke',
      seq: ['Ein Hase springt über die Wiese.', 'Die Kinder sehen Spuren.', 'Unter den Zweigen bewegt sich etwas.'], order: '3 – 1 – 2',
      seen: ['Schnee', 'Kinder', 'Sonnenschirm'], correct: 'Schnee und Kinder',
      title: 'Wer war hier unterwegs?', proof: 'Die Kinder laufen nicht sofort zur Hecke.', quote: 'Die beiden Kinder bleiben stehen und schauen genau hin.'
    }
  },
  {
    t: 'Die Bücherkiste',
    c: 'school',
    s: 'Nach der Pause liegen viele Bücher auf dem Tisch. {N} und Mira wollen sie in eine Holzkiste räumen. Die großen Bücher legen sie nach unten. Die kleinen Bücher kommen darauf. Ein Buch passt nicht hinein. Mira dreht es ein wenig. Jetzt passt es. Gemeinsam tragen sie die Kiste in die Leseecke.',
    x: 'Dort sucht sich {N} ein Buch über Hunde aus. Mira nimmt ein Buch mit bunten Bildern. Beide setzen sich auf ein Kissen und lesen ein paar Seiten.',
    q: [
      ['Wer hilft {N} beim Einräumen?', ['Emil', 'Mira', 'Oma'], 1],
      ['Welche Bücher legen die Kinder nach unten?', ['Die kleinen', 'Die neuen', 'Die großen'], 2],
      ['Richtig oder falsch? Mira dreht ein Buch.', ['Richtig', 'Falsch'], 0],
      ['Warum drehen die Kinder das Buch?', null, 'Es passt zuerst nicht in die Kiste. Nach dem Drehen passt es hinein.'],
      ['Was passiert zuletzt?', ['Die Kinder tragen die Kiste in die Leseecke.', 'Sie legen die großen Bücher nach unten.', 'Mira dreht ein Buch.'], 0],
      ['Woraus ist die Kiste?', null, 'Aus Holz.']
    ],
    alt: 'Zwei Kinder räumen Bücher in eine Holzkiste.',
    extra: {
      words: ['BUCH', 'HOLZ'], clues: ['Was dreht Mira ein wenig?', 'Woraus ist die Kiste?'],
      gap: 'Die _____ Bücher legen sie nach unten.', bank: 'großen · kleinen · nassen', answer: 'großen',
      seq: ['Mira dreht ein Buch.', 'Die Kinder tragen die Kiste in die Leseecke.', 'Die Kinder legen die großen Bücher nach unten.'], order: '2 – 3 – 1',
      seen: ['Bücher', 'Kiste', 'Schaukel'], correct: 'Bücher und Kiste',
      title: 'Ordnung in der Leseecke', proof: 'Am Ende helfen beide beim Tragen.', quote: 'Gemeinsam tragen sie die Kiste in die Leseecke.'
    }
  },
  {
    t: 'Ein Platz am Basteltisch',
    c: 'school',
    s: 'Heute bastelt die Klasse bunte Fensterbilder. Am Basteltisch sitzen {N} und Leo. Da kommt Sara mit einer Schere in der Hand. Sie findet keinen Platz. {N} rückt zur Seite. Leo schiebt die Papierstücke zusammen. Nun kann Sara sich dazusetzen. Sie schneiden Sterne aus und legen sie nebeneinander.',
    x: 'Sara hat noch eine Idee. Aus den kleinen Papierresten schneidet sie Monde. Am Ende hängen die Sterne und Monde gemeinsam am Fenster der Klasse.',
    q: [
      ['Was bastelt die Klasse?', ['Fensterbilder', 'Papierboote', 'Masken'], 0],
      ['Was hat Sara in der Hand?', ['Einen Pinsel', 'Eine Schere', 'Ein Lineal'], 1],
      ['Richtig oder falsch? Leo schiebt die Papierstücke zusammen.', ['Richtig', 'Falsch'], 0],
      ['Wie helfen die Kinder Sara?', null, '{N} rückt zur Seite und Leo schiebt das Papier zusammen. So entsteht ein Platz.'],
      ['Was geschieht zuerst?', ['Sara setzt sich dazu.', '{N} rückt zur Seite.', 'Sara kommt mit einer Schere.'], 2],
      ['Welche Form schneiden die Kinder aus?', null, 'Sterne.']
    ],
    alt: 'Kinder machen am Basteltisch Platz für Sara.',
    extra: {
      words: ['SCHERE', 'STERNE'], clues: ['Was hat Sara in der Hand?', 'Was schneiden die Kinder aus?'],
      gap: 'Leo schiebt die _____ zusammen.', bank: 'Papierstücke · Bücher · Stühle', answer: 'Papierstücke',
      seq: ['Sara setzt sich dazu.', 'Sara findet keinen Platz.', 'Die Kinder schneiden Sterne aus.'], order: '2 – 1 – 3',
      seen: ['Kinder', 'Papier', 'Fahrrad'], correct: 'Kinder und Papier',
      title: 'Zusammen basteln', proof: '{N} macht am Tisch Platz.', quote: '{N} rückt zur Seite.'
    }
  },
  {
    t: 'Das Paket vor der Tür',
    c: 'everyday',
    s: 'Vor der Wohnungstür steht ein kleines Paket. {N} möchte wissen, für wen es ist. Mama liest den Namen auf dem Paket. Es gehört Frau Kern von nebenan. Gemeinsam bringen sie es zu ihrer Tür. {N} läutet an. Frau Kern öffnet und freut sich. Sie hat schon auf das Paket gewartet.',
    x: 'Frau Kern erzählt, dass Blumensamen in dem Paket sind. Im Frühling will sie die Samen in einen Topf stecken. {N} darf ihr dabei helfen.',
    q: [
      ['Was steht vor der Wohnungstür?', ['Ein Korb', 'Ein Paket', 'Ein Topf'], 1],
      ['Für wen ist das Paket?', ['Für Mama', 'Für Frau Kern', 'Für {N}'], 1],
      ['Richtig oder falsch? Mama liest den Namen auf dem Paket.', ['Richtig', 'Falsch'], 0],
      ['Warum bringen sie das Paket zur Nachbarin?', null, 'Auf dem Paket steht der Name von Frau Kern. Es gehört ihr.'],
      ['Was passiert zuerst?', ['Frau Kern öffnet die Tür.', '{N} läutet an.', 'Mama liest den Namen.'], 2],
      ['Warum freut sich Frau Kern?', null, 'Sie hat auf das Paket gewartet und bekommt es jetzt.']
    ],
    alt: 'Ein Kind und ein Erwachsener bringen der Nachbarin ein Paket.',
    extra: {
      words: ['PAKET', 'KERN'], clues: ['Was steht vor der Wohnungstür?', 'Wie heißt die Nachbarin mit Nachnamen?'],
      gap: 'Mama liest den _____ auf dem Paket.', bank: 'Namen · Preis · Brief', answer: 'Namen',
      seq: ['Frau Kern öffnet die Tür.', 'Mama liest den Namen.', '{N} läutet an.'], order: '3 – 1 – 2',
      seen: ['Paket', 'Tür', 'Schaukel'], correct: 'Paket und Tür',
      title: 'Eine Lieferung für die Nachbarin', proof: 'Frau Kern freut sich, als sie die Tür öffnet.', quote: 'Frau Kern öffnet und freut sich.'
    }
  },
  {
    t: 'Der Drachen am Zaun',
    c: 'everyday',
    s: '{N} lässt mit Papa einen roten Drachen steigen. Auf der Wiese weht ein kräftiger Wind. Der Drachen tanzt hoch in der Luft. Dann zieht der Wind ihn zum Zaun. Die Schnur bleibt an einer Latte hängen. Papa löst sie vorsichtig. Jetzt gehen die beiden weiter in die Mitte der Wiese.',
    x: 'Dort ist mehr Platz. {N} läuft ein Stück und lässt die Schnur langsam länger werden. Der Drachen steigt wieder hoch. Papa winkt von unten.',
    q: [
      ['Welche Farbe hat der Drachen?', ['Blau', 'Gelb', 'Rot'], 2],
      ['Wo bleibt die Schnur hängen?', ['An einer Latte am Zaun', 'An einem Ast', 'An einer Bank'], 0],
      ['Richtig oder falsch? Papa löst die Schnur.', ['Richtig', 'Falsch'], 0],
      ['Warum gehen sie wohl in die Mitte der Wiese?', null, 'Dort ist der Zaun weiter weg. Der Drachen kann mit mehr Platz steigen.'],
      ['Was geschieht zuerst?', ['Papa löst die Schnur.', 'Der Drachen tanzt in der Luft.', 'Die Schnur bleibt am Zaun hängen.'], 1],
      ['Mit wem lässt {N} den Drachen steigen?', null, 'Mit Papa.']
    ],
    alt: 'Ein roter Drachen hängt an einem Holzzaun bei einer Wiese.',
    extra: {
      words: ['DRACHEN', 'ZAUN'], clues: ['Was lassen die beiden steigen?', 'Wo bleibt die Schnur hängen?'],
      gap: 'Auf der Wiese weht ein kräftiger _____.', bank: 'Wind · Regen · Nebel', answer: 'Wind',
      seq: ['Papa löst die Schnur.', 'Der Drachen tanzt in der Luft.', 'Die Schnur bleibt hängen.'], order: '3 – 1 – 2',
      seen: ['Drachen', 'Zaun', 'Zug'], correct: 'Drachen und Zaun',
      title: 'Viel Wind auf der Wiese', proof: 'Papa zieht nicht ruckartig an der Schnur.', quote: 'Papa löst sie vorsichtig.'
    }
  }
];
