const { shuffleArray, alphabet } = require('./utils');

// Simple HTML entity decoder
function decodeHTMLEntities(text) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&hellip;': '...',
    '&mdash;': '—',
    '&ndash;': '–',
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&cent;': '¢',
    '&sect;': '§',
    '&deg;': '°',
    '&plusmn;': '±',
    '&times;': '×',
    '&divide;': '÷',
    '&frac12;': '½',
    '&frac14;': '¼',
    '&frac34;': '¾',
    '&sup1;': '¹',
    '&sup2;': '²',
    '&sup3;': '³',
    '&micro;': 'µ',
    '&para;': '¶',
    '&middot;': '·',
    '&bull;': '•',
    '&ndash;': '–',
    '&mdash;': '—',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&sbquo;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&bdquo;': '"',
    '&dagger;': '†',
    '&Dagger;': '‡',
    '&permil;': '‰',
    '&lsaquo;': '‹',
    '&rsaquo;': '›',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&cent;': '¢',
    '&curren;': '¤',
    '&fnof;': 'ƒ',
    '&Alpha;': 'Α',
    '&Beta;': 'Β',
    '&Gamma;': 'Γ',
    '&Delta;': 'Δ',
    '&Epsilon;': 'Ε',
    '&Zeta;': 'Ζ',
    '&Eta;': 'Η',
    '&Theta;': 'Θ',
    '&Iota;': 'Ι',
    '&Kappa;': 'Κ',
    '&Lambda;': 'Λ',
    '&Mu;': 'Μ',
    '&Nu;': 'Ν',
    '&Xi;': 'Ξ',
    '&Omicron;': 'Ο',
    '&Pi;': 'Π',
    '&Rho;': 'Ρ',
    '&Sigma;': 'Σ',
    '&Tau;': 'Τ',
    '&Upsilon;': 'Υ',
    '&Phi;': 'Φ',
    '&Chi;': 'Χ',
    '&Psi;': 'Ψ',
    '&Omega;': 'Ω',
    '&alpha;': 'α',
    '&beta;': 'β',
    '&gamma;': 'γ',
    '&delta;': 'δ',
    '&epsilon;': 'ε',
    '&zeta;': 'ζ',
    '&eta;': 'η',
    '&theta;': 'θ',
    '&iota;': 'ι',
    '&kappa;': 'κ',
    '&lambda;': 'λ',
    '&mu;': 'μ',
    '&nu;': 'ν',
    '&xi;': 'ξ',
    '&omicron;': 'ο',
    '&pi;': 'π',
    '&rho;': 'ρ',
    '&sigmaf;': 'ς',
    '&sigma;': 'σ',
    '&tau;': 'τ',
    '&upsilon;': 'υ',
    '&phi;': 'φ',
    '&chi;': 'χ',
    '&psi;': 'ψ',
    '&omega;': 'ω',
    '&thetasym;': 'ϑ',
    '&upsih;': 'ϒ',
    '&piv;': 'ϖ',
    '&ensp;': ' ',
    '&emsp;': ' ',
    '&thinsp;': ' ',
    '&zwnj;': '‌',
    '&zwj;': '‍',
    '&lrm;': '‎',
    '&rlm;': '‏',
    '&ndash;': '–',
    '&mdash;': '—',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&sbquo;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&bdquo;': '"',
    '&dagger;': '†',
    '&Dagger;': '‡',
    '&bull;': '•',
    '&hellip;': '…',
    '&permil;': '‰',
    '&prime;': '′',
    '&Prime;': '″',
    '&lsaquo;': '‹',
    '&rsaquo;': '›',
    '&oline;': '‾',
    '&frasl;': '⁄',
    '&euro;': '€',
    '&image;': 'ℑ',
    '&weierp;': '℘',
    '&real;': 'ℜ',
    '&trade;': '™',
    '&alefsym;': 'ℵ',
    '&larr;': '←',
    '&uarr;': '↑',
    '&rarr;': '→',
    '&darr;': '↓',
    '&harr;': '↔',
    '&crarr;': '↵',
    '&lArr;': '⇐',
    '&uArr;': '⇑',
    '&rArr;': '⇒',
    '&dArr;': '⇓',
    '&hArr;': '⇔',
    '&forall;': '∀',
    '&part;': '∂',
    '&exist;': '∃',
    '&empty;': '∅',
    '&nabla;': '∇',
    '&isin;': '∈',
    '&notin;': '∉',
    '&ni;': '∋',
    '&prod;': '∏',
    '&sum;': '∑',
    '&minus;': '−',
    '&lowast;': '∗',
    '&radic;': '√',
    '&prop;': '∝',
    '&infin;': '∞',
    '&ang;': '∠',
    '&and;': '∧',
    '&or;': '∨',
    '&cap;': '∩',
    '&cup;': '∪',
    '&int;': '∫',
    '&there4;': '∴',
    '&sim;': '∼',
    '&cong;': '≅',
    '&asymp;': '≈',
    '&ne;': '≠',
    '&equiv;': '≡',
    '&le;': '≤',
    '&ge;': '≥',
    '&sub;': '⊂',
    '&sup;': '⊃',
    '&nsub;': '⊄',
    '&sube;': '⊆',
    '&supe;': '⊇',
    '&oplus;': '⊕',
    '&otimes;': '⊗',
    '&perp;': '⊥',
    '&sdot;': '⋅',
    '&lceil;': '⌈',
    '&rceil;': '⌉',
    '&lfloor;': '⌊',
    '&rfloor;': '⌋',
    '&lang;': '〈',
    '&rang;': '〉',
    '&loz;': '◊',
    '&spades;': '♠',
    '&clubs;': '♣',
    '&hearts;': '♥',
    '&diams;': '♦'
  };

  return text.replace(/&[^;]+;/g, entity => entities[entity] || entity);
}

const positiveFeedback = [
  "Excellent!",
  "Great job!",
  "Well done!",
  "Perfect!",
  "Amazing!",
  "Brilliant!",
  "Fantastic!",
  "Outstanding!",
  "Superb!",
  "Terrific!"
];

class Trivia {
  static name = 'Trivia';

  constructor(gameId) {
    this.state = 'play';
    this.gameId = gameId;
    this.quizStarted = false;
    this.currentQuestionIndex = 0;
    this.questions = null;
    this.numOfCorrectAnswers = 0;
  }

  async init() {
    const response = await fetch('https://opentdb.com/api.php?amount=5');
    const data = await response.json();
    this.questions = data.results;

    for (let i = 0; i < this.questions.length; i++) {
      this.questions[i].shuffled_answers = this.getShuffledAnswers(i);
      this.questions[i].question = decodeHTMLEntities(this.questions[i].question);
      this.questions[i].correct_answer = decodeHTMLEntities(this.questions[i].correct_answer);
      this.questions[i].incorrect_answers = this.questions[i].incorrect_answers.map(answer => 
        decodeHTMLEntities(answer)
      );
    }
    console.log(data.results);
  }

  get welcomeMessage() {
    const message =
      'How much do you know about anything, really❓\n' +
      "Let's find out in this 5 questions Trivia.\n" +
      'Type "Go" when you are ready to get started. 🔥';

    return message;
  }

  askNextQuestion() {
    const { question, shuffled_answers } = this.questions[
      this.currentQuestionIndex
    ];
    let message = question;

    for (let i = 0; i < alphabet.length; i++) {
      const letter = alphabet[i].toUpperCase();
      const possibleAnswer = shuffled_answers[i];

      if (!possibleAnswer) break;
      message += `\n*${letter}* ${possibleAnswer}`;
    }

    this.currentQuestionIndex++;
    return message;
  }

  getShuffledAnswers(questionIndex) {
    const question = this.questions[questionIndex];
    const answers = [...question.incorrect_answers, question.correct_answer];

    return shuffleArray(answers);
  }

  isAnswerCorrect(code) {
    const { questions, currentQuestionIndex } = this;
    const question = questions[currentQuestionIndex - 1];
    const answerIndex = alphabet.indexOf(code.toLowerCase());

    return question.correct_answer === question.shuffled_answers[answerIndex];
  }

  generateQuizReport() {
    const { numOfCorrectAnswers } = this;
    const ratio = `${numOfCorrectAnswers}/5`;

    if (numOfCorrectAnswers < 2) return `☹️ ${ratio} Better luck next time.`;
    else if (numOfCorrectAnswers < 4) return `😐 ${ratio} Could be better.`;
    else {
      const randomFeedback = positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)];
      return `😀 ${ratio} ${randomFeedback}`;
    }
  }

  handleUserResponse(answer) {
    const messages = [];

    if (!this.quizStarted) {
      this.quizStarted = answer.toLowerCase() === 'go';

      if (!this.quizStarted) return 'We can "Go" whenever you are ready 😉';
      return this.askNextQuestion();
    }

    const isValidAnswer = alphabet.indexOf(answer.toLowerCase()) !== -1;
    if (!isValidAnswer) return '🙃 Invalid answer';

    if (this.isAnswerCorrect(answer)) {
      this.numOfCorrectAnswers++;
      messages.push('✔️');
    } else {
      messages.push('❌');
    }

    if (this.currentQuestionIndex > 4) {
      this.state = 'gameover';
      messages.push(this.generateQuizReport());
    } else {
      messages.push(this.askNextQuestion());
    }

    return messages;
  }
}

module.exports = Trivia;
