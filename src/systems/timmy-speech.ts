export type TimmyQuotePool =
  | 'general'
  | 'miefHigh'
  | 'miefCritical'
  | 'plants'
  | 'cardboard'
  | 'choking'
  | 'steak';

export type TimmyQuote = {
  id: string;
  text: string;
  weight: number;
};

export type TimmySpeechContext = {
  miefHigh: boolean;
  miefCritical: boolean;
  plantsOverturned: boolean;
  cardboardChaos: boolean;
  isChoking: boolean;
  preferLevel3MiefQuotes: boolean;
  steakEating: boolean;
};

export const TIMMY_QUOTE_POOLS: Record<TimmyQuotePool, TimmyQuote[]> = {
  general: [
    { id: 'gen-kevin-kunst', text: 'Kevin macht wieder Kunst.', weight: 8 },
    { id: 'gen-da-liegt-was', text: 'Emi, da liegt was.', weight: 8 },
    { id: 'gen-streng', text: 'Riecht ein bisschen streng hier.', weight: 7 },
    { id: 'gen-sitze', text: 'Ich würde helfen, aber ich sitze gerade.', weight: 9 },
    { id: 'gen-von-allein', text: 'Meinst du, das geht von allein weg?', weight: 8 },
    { id: 'gen-nicht-kevin', text: 'Kevin war das bestimmt nicht.', weight: 8 },
    { id: 'gen-pflanze', text: 'Die Pflanze lag vorher schon so.', weight: 6 },
    { id: 'gen-kurz', text: 'Emi, nur ganz kurz.', weight: 7 },
    { id: 'gen-hund-plant', text: 'Ich glaube, der Hund plant was.', weight: 7 },
    { id: 'gen-erde', text: 'Ist das Erde oder was anderes?', weight: 6 },
    { id: 'gen-wischen', text: 'Kannst du einmal wischen?', weight: 7 },
    { id: 'gen-karton', text: 'Der Karton hat angefangen.', weight: 6 },
    { id: 'gen-beobachte', text: 'Ich beobachte die Lage.', weight: 8 },
    { id: 'gen-kreativ', text: 'Kevin wirkt heute sehr kreativ.', weight: 7 },
    { id: 'gen-phase', text: 'Das ist bestimmt nur eine Phase.', weight: 7 },
    { id: 'gen-heute', text: 'Muss das heute noch weg?', weight: 7 },
    { id: 'gen-zieht', text: 'Hier zieht es.', weight: 5 },
    { id: 'gen-emii', text: 'Emi? Emii??', weight: 8 },
    { id: 'gen-hektisch', text: 'Nicht hektisch werden.', weight: 8 },
    { id: 'gen-beschaeftigung', text: 'Der Hund braucht Beschäftigung.', weight: 7 },
    { id: 'gen-nehmen', text: 'Ich würde ihn ja nehmen, aber …', weight: 7 },
    { id: 'gen-groesser', text: 'Das Wohnzimmer war mal größer.', weight: 5 },
    { id: 'gen-nichts-gesehen', text: 'Ich hab nichts gesehen.', weight: 8 },
    { id: 'gen-fenster', text: 'Vielleicht einfach Fenster auf?', weight: 6 },
    { id: 'gen-unguenstig', text: 'Das ist jetzt ungünstig.', weight: 7 },
    { id: 'gen-anrufen', text: 'Wir sollten jemanden anrufen.', weight: 5 },
    { id: 'gen-app', text: 'Gibt es dafür eine App?', weight: 1 },
    { id: 'gen-stellung', text: 'Ich halte hier die Stellung.', weight: 9 },
    { id: 'gen-unschuldig', text: 'Kevin guckt so unschuldig.', weight: 8 },
    { id: 'gen-nochmal', text: 'Ich glaube, er muss nochmal.', weight: 7 },
    { id: 'gen-beutel', text: 'Hast du den großen Beutel genommen?', weight: 6 },
    { id: 'gen-nicht-anfassen', text: 'Ich würde jetzt nichts anfassen.', weight: 8 },
    { id: 'gen-draußen', text: 'Der Geruch kommt von draußen.', weight: 1 },
    { id: 'gen-sofa', text: 'Das Sofa ist noch sauber.', weight: 7 },
  ],
  miefHigh: [
    { id: 'mief-gruen', text: 'Warum wird die Luft grün?', weight: 10 },
    { id: 'mief-geraeusche', text: 'Ich sehe Geräusche.', weight: 10 },
    { id: 'mief-schwindel', text: 'Mir wird etwas schwindelig.', weight: 9 },
    { id: 'mief-emi', text: 'Emi …', weight: 9 },
    { id: 'mief-schummrig', text: 'Mir wird ein bisschen schummrig.', weight: 4 },
    { id: 'mief-durchsichtig', text: 'Emi, ich glaube, ich werde durchsichtig.', weight: 5 },
    { id: 'mief-sauerstoff', text: 'Ist Sauerstoff heute ausverkauft?', weight: 6 },
    { id: 'mief-farben', text: 'Ich rieche Farben.', weight: 9 },
    { id: 'mief-ansage', text: 'Das ist keine Luft mehr, das ist eine Ansage.', weight: 8 },
    { id: 'mief-katze', text: 'Selbst die Katze würde das nicht riechen.', weight: 7 },
    { id: 'mief-fenster', text: 'Das Fenster hilft nicht mehr.', weight: 6 },
  ],
  miefCritical: [
    { id: 'crit-wand', text: 'Die Wand schmeckt nach Kartoffel.', weight: 8 },
    { id: 'crit-historisch', text: 'Historisch mief.', weight: 9 },
    { id: 'crit-wissenschaft', text: 'Das ist jetzt Wissenschaft.', weight: 7 },
    { id: 'crit-timmy', text: 'Timmy übrigens auch.', weight: 6 },
    { id: 'crit-notfall', text: 'Ist das schon Notfall-Mief?', weight: 8 },
    { id: 'crit-atemlos', text: 'Atemlos durch Mief.', weight: 7 },
  ],
  plants: [
    { id: 'plant-monstera', text: 'Die Monstera hat aufgegeben.', weight: 8 },
    { id: 'plant-schwierig', text: 'Die Pflanze war eh schwierig.', weight: 8 },
    { id: 'plant-drehen', text: 'Kann man die einfach drehen?', weight: 7 },
  ],
  cardboard: [
    { id: 'box-explodiert', text: 'Das Paket ist explodiert.', weight: 8 },
    { id: 'box-auspacken', text: 'Kevin wollte nur beim Auspacken helfen.', weight: 8 },
    { id: 'box-wichtig', text: 'War da noch was Wichtiges drin?', weight: 7 },
  ],
  choking: [
    { id: 'choke-hmpf', text: 'Hmpf!', weight: 10 },
    { id: 'choke-steak', text: 'Das Steak gewinnt gerade.', weight: 10 },
    { id: 'choke-hilfe', text: 'Jetzt wäre Hilfe tatsächlich sinnvoll.', weight: 9 },
    { id: 'choke-hals', text: 'Falscher Hals. Definitiv falscher Hals.', weight: 8 },
    { id: 'choke-medium', text: 'Das war zu medium. Viel zu medium.', weight: 8 },
    { id: 'choke-emi', text: 'Emi! … *klopf klopf*', weight: 9 },
    { id: 'choke-bissen', text: 'Nur ein Bissen! … großer Bissen!', weight: 7 },
  ],
  steak: [
    { id: 'steak-medium', text: 'Medium rare. Wie ich.', weight: 9 },
    { id: 'steak-leben', text: 'Das ist keine Mahlzeit, das ist eine Lebensentscheidung.', weight: 8 },
    { id: 'steak-kevin', text: 'Kevin guckt neidisch. Kevin kriegt nix.', weight: 9 },
    { id: 'steak-kau', text: 'Ich kau erstmal, dann helf ich.', weight: 10 },
    { id: 'steak-mathematik', text: 'Steak > Pflanzen. Mathematisch bewiesen.', weight: 8 },
    { id: 'steak-noch', text: 'Noch ein Bissen. … okay, noch einer.', weight: 9 },
    { id: 'steak-therapie', text: 'Das hier ist meine Therapie.', weight: 7 },
    { id: 'steak-kauen', text: 'Wichtig ist: langsam kauen. … theoretisch.', weight: 8 },
    { id: 'steak-romantik', text: 'Kannst du das Licht dimmen? Romantisch essen.', weight: 6 },
    { id: 'steak-grillen', text: 'Grillen wir morgen? Ich meine: gleich noch.', weight: 8 },
    { id: 'steak-prioritaet', text: 'Erst Steak, dann Chaos.', weight: 9 },
    { id: 'steak-saft', text: 'Saftig. Sehr saftig. Vielleicht zu saftig.', weight: 7 },
    { id: 'steak-wieder', text: 'Nach dem Notfall schmeckt es noch besser.', weight: 6 },
  ],
};

export function selectTimmyQuotePool(context: TimmySpeechContext): TimmyQuotePool {
  if (context.isChoking) {
    return 'choking';
  }

  if (context.plantsOverturned && Math.random() < 0.45) {
    return 'plants';
  }

  if (context.cardboardChaos && Math.random() < 0.55) {
    return 'cardboard';
  }

  if (context.steakEating) {
    return 'steak';
  }

  if (
    !context.preferLevel3MiefQuotes &&
    !context.miefHigh &&
    !context.miefCritical &&
    Math.random() < 0.78
  ) {
    return 'general';
  }

  if (context.miefCritical && Math.random() < 0.55) {
    return 'miefCritical';
  }

  if (context.miefHigh && context.preferLevel3MiefQuotes && Math.random() < 0.5) {
    return 'miefHigh';
  }

  if (context.miefCritical && Math.random() < 0.68) {
    return 'miefCritical';
  }

  if (context.miefHigh && Math.random() < 0.6) {
    return 'miefHigh';
  }

  return 'general';
}

export function pickTimmyQuote(
  pool: TimmyQuotePool,
  excludeQuoteId?: string,
): TimmyQuote {
  const candidates = excludeQuoteId
    ? TIMMY_QUOTE_POOLS[pool].filter((quote) => quote.id !== excludeQuoteId)
    : TIMMY_QUOTE_POOLS[pool];

  const quotes = candidates.length > 0 ? candidates : TIMMY_QUOTE_POOLS[pool];
  const totalWeight = quotes.reduce((sum, quote) => sum + quote.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const quote of quotes) {
    roll -= quote.weight;
    if (roll <= 0) {
      return quote;
    }
  }

  return quotes[quotes.length - 1];
}

export function pickTimmySpeechLine(
  context: TimmySpeechContext,
  excludeQuoteId?: string,
): TimmyQuote {
  const pool = selectTimmyQuotePool(context);
  return pickTimmyQuote(pool, excludeQuoteId);
}

export function randomBubbleDurationMs(): number {
  return 2600 + Math.floor(Math.random() * 1201);
}
