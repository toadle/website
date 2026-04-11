import productishCover from "../../assets/legacy/productish.jpg";
import type { WorkEntry } from "./types";

export const publicationEntries: WorkEntry[] = [
  {
    id: "linux-magazin-07-2024",
    title: {
      de: "Linux-Magazin",
      en: "Linux Magazine",
    },
    summary: {
      de: "Titelstory",
      en: "Cover story",
    },
    subtitle: {
      de: "Die ersten Schritte mit Git und einer Code-Hosting-Plattform",
      en: "First steps with Git and a code hosting platform",
    },
    description: {
      de: "Fuer die Ausgabe 07/2024 habe ich die Titelstory geschrieben und einen praxisnahen Einstieg in Git und Code-Hosting-Plattformen gegeben.",
      en: "For issue 07/2024, I wrote the cover story and provided a practical introduction to Git and code hosting platforms.",
    },
    url: "https://www.linux-magazin.de/ausgaben/2024/07/git-einfuehrung/",
    linkText: "Linux-Magazin",
    year: 2024,
    image: {
      src: "../../images/legacy/publications/linux-magazin-2024-07.jpg",
      alt: {
        de: "Heftcover Linux-Magazin Ausgabe 07/2024",
        en: "Cover of Linux Magazine issue 07/2024",
      },
    },
  },
  {
    id: "programmierbar-cto-special-18",
    title: {
      de: "programmier.bar",
      en: "programmier.bar",
    },
    summary: {
      de: "Podcastfolge",
      en: "Podcast episode",
    },
    subtitle: {
      de: "CTO-SPECIAL #18",
      en: "CTO-SPECIAL #18",
    },
    description: {
      de: "In dieser Folge sprach ich noch als CTO von Chefkoch ueber meinen Lebenslauf und warum bei mir das Pendel immer zwischen Hands-on-Development und Management wechselt.",
      en: "In this episode I talked, still as CTO of Chefkoch, about my CV and why I regularly switch between hands-on development and management.",
    },
    url: "https://www.programmier.bar/podcast/cto-special-18-tim-adler-von-chefkoch",
    linkText: "programmier.bar",
    year: 2022,
    image: {
      src: "../../images/legacy/publications/programmierbar-cto-special-18.jpg",
      alt: {
        de: "Artwork der programmier.bar Folge CTO-SPECIAL #18",
        en: "Artwork of programmier.bar CTO-SPECIAL #18",
      },
    },
  },
  {
    id: "git-kurz-gut-2nd-edition",
    title: {
      de: "Git - kurz & gut",
      en: "Git - kurz & gut",
    },
    summary: {
      de: "Kapitelbeitrag",
      en: "Chapter contribution",
    },
    subtitle: {
      de: "Kapitelbeitrag: Git-Onlinedienste im Unternehmen",
      en: "Chapter contribution: Git online services in companies",
    },
    description: {
      de: "In der zweiten Auflage habe ich den Teil \"Git-Onlinedienste im Unternehmen\" geschrieben.",
      en: "For the second edition, I wrote the section \"Git online services in companies\".",
    },
    url: "https://www.oreilly.com/library/view/git-kurz/9781098141141/",
    linkText: "O'Reilly",
    year: 2022,
    image: {
      src: "../../images/legacy/publications/git-kurz-gut-2-auflage-oreilly.jpg",
      alt: {
        de: "Cover von Git - kurz & gut (2. Auflage)",
        en: "Cover of Git - kurz & gut (2nd edition)",
      },
    },
  },
  {
    id: "digitales-produktmanagement",
    title: {
      de: "Digitales Produktmanagement",
      en: "Digital Product Management",
    },
    summary: {
      de: "Buchbeitrag",
      en: "Book chapter",
    },
    subtitle: {
      de: "Methoden - Instrumente - Praxisbeispiele",
      en: "Methods - Tools - Practical Examples",
    },
    description: {
      de: "In diesem deutschen Buch ueber digitales Produktmanagement habe ich ein Kapitel darueber geschrieben, wie Produkte effizient erstellt und geliefert werden koennen.",
      en: "In this German book on digital product management, I contributed a chapter on efficiently building and delivering products.",
    },
    url: "https://www.springer.com/de/book/9783658306281#aboutAuthors",
    linkText: "Springer",
    year: 2020,
    image: {
      src: "../../images/legacy/publications/digitales-produktmanagement.jpg",
      alt: {
        de: "Cover von Digitales Produktmanagement",
        en: "Cover of Digitales Produktmanagement",
      },
    },
  },
  {
    id: "productish-podcast",
    title: {
      de: "Productish Podcast",
      en: "Productish Podcast",
    },
    summary: {
      de: "Produktpodcast",
      en: "Product podcast",
    },
    subtitle: {
      de: "Ein Podcast ueber Konflikte und Herausforderungen im digitalen Produktmanagement",
      en: "A podcast on conflicts and challenges in digital product management",
    },
    description: {
      de: "Zusammen mit meinem Kollegen und Freund Tim Herbig moderierte ich ueber etwa 15 Folgen einen Podcast, in dem wir wiederkehrende Probleme und Konflikte im digitalen Produktmanagement diskutierten.",
      en: "Together with my colleague and friend Tim Herbig, I co-hosted around 15 episodes discussing recurring product management problems and conflicts.",
    },
    year: 2019,
    image: {
      src: productishCover.src,
      width: productishCover.width,
      height: productishCover.height,
      alt: {
        de: "Coverbild des Productish Podcasts",
        en: "Cover image of the Productish podcast",
      },
    },
  },
];