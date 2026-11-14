const LeseStationen = (() => {
  const story = newReadingStories.find(item => item.t === 'Spuren im Schnee').s.replaceAll('{N}', 'Mia');
  const cards = ['zur Hecke', 'Die Spuren', 'führen', 'im Schnee'];
  const title = 'Spuren im Schnee';
  const stories = {
    detective: {
      title: 'Lesedetektive',
      materials: 'Lesetext auf dieser Karte und Bleistift',
      draw(p) {
        p.text(40, 211, title, 17, true);
        p.para(40, 248, story, 515, 15, false, 1.5);
        p.para(40, 452, '1. Wohin führen die Spuren? Antworte in einem Satz.', 515, 14, true);
        p.line(40, 509, 555, 509);
        p.line(40, 549, 555, 549);
        p.para(40, 617, '2. Unterstreiche im Text den Satz, der deine Antwort belegt.', 515, 14, true);
      },
      answer: 'Die Spuren führen bis zu einer Hecke. Beleg: „Sie führen bis zu einer Hecke.“'
    },
    sentence: {
      title: 'Satzwerkstatt',
      materials: 'Wortkarten auf dieser Seite, Schere und Bleistift',
      draw(p) {
        p.para(40, 205, 'Im Schnee entdecken Mia und Emil Spuren. Baue mit den vier Wortkarten einen Satz darüber.', 515, 14);
        cards.forEach((word, i) => {
          const x = 40 + i * 129;
          p.rect(x, 257, 120, 58, '#f3f7ed', '#8ea584', 4);
          p.text(x + 60, 291, word, 13, true, '#203d36', 'middle');
        });
        p.para(40, 377, '1. Schneide die Karten aus oder schreibe sie auf Zettel. Beginne mit „Die Spuren“. Schreib den Satz mit einem Punkt auf.', 515, 14, true);
        p.line(40, 469, 555, 469);
        p.para(40, 531, '2. Stelle die Karten um. Beginne mit „Im Schnee“. Schreibe den Satz mit Großbuchstaben am Anfang und einem Punkt am Ende.', 515, 14, true);
        p.line(40, 634, 555, 634);
        p.para(40, 704, '3. Lest euch beide Sätze vor. Wo steht jeweils das Wort „führen“?', 515, 13);
      },
      answer: 'Die Spuren im Schnee führen zur Hecke. Im Schnee führen die Spuren zur Hecke. „Führen“ steht an zweiter Stelle nach der ersten Wortgruppe, auch wenn diese aus mehreren Wörtern besteht.'
    },
    writing: {
      title: 'Schreibstation',
      materials: 'Bleistift und Platz für zwei bis drei Sätze',
      draw(p) {
        p.para(40, 207, 'Mia und Emil haben kleine Spuren im Schnee gesehen. Bei der Hecke ist ein Hase über die Wiese gesprungen.', 515, 14);
        p.para(40, 296, 'Was entdecken die beiden am nächsten Morgen? Schreibe die Geschichte in zwei bis drei Sätzen weiter.', 515, 15, true);
        p.rect(40, 367, 515, 112, '#f3f7ed', '#8ea584', 6);
        p.text(56, 392, 'Diese Satzanfänge können dir helfen:', 13, true);
        p.text(56, 424, 'Am nächsten Morgen …', 14);
        p.text(56, 453, 'Neben der Hecke …  ·  Plötzlich …', 14);
        for (let i = 0; i < 4; i++) p.line(40, 544 + i * 45, 555, 544 + i * 45);
        p.para(40, 753, 'Lies noch einmal. Beginnt jeder Satz groß und hat er ein Satzzeichen?', 515, 12);
      },
      answer: 'Beispiel: Am nächsten Morgen gehen Mia und Emil wieder zur Hecke. Neben der Hecke entdecken sie eine neue Spur. Plötzlich hüpft der Hase auf den Weg. Andere passende Fortsetzungen sind möglich.'
    }
  };
  return {title, stations: stories};
})();
