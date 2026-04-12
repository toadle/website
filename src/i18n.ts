export type Locale = "de" | "en";

type NavItem = {
  key: "home" | "about" | "services" | "projects" | "now" | "blog";
  label: string;
  url: string;
};

type LocaleStrings = {
  siteTitle: string;
  siteDescription: string;
  sectionLabels: {
    about: string;
    services: string;
    work: string;
    openSource: string;
    publications: string;
    projects: string;
    capabilities: string;
  };
  nav: NavItem[];
  home: {
    kicker: string;
    headline: string;
    intro: string;
    roles: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    cards: {
      title: string;
      body: string;
      link: string;
      href: string;
    }[];
    blogTitle: string;
    blogLink: string;
  };
  about: {
    title: string;
    lead: string;
    lead2: string;
    skillsTitle: string;
    skills: string[];
    approachTitle: string;
    approachBody: string;
    highlightsTitle: string;
    highlights: string[];
  };
  work: {
    title: string;
    lead: string;
    body1: string;
    body2: string;
    sections: { title: string; body: string }[];
    cta: string;
    ctaLink: string;
  };
  now: {
    title: string;
    lead: string;
    microblogTitle: string;
    updatesTitle: string;
    updates: string[];
  };
  blog: {
    title: string;
    lead: string;
    articleNav: {
      prev: string;
      next: string;
      readIn: string;
    };
  };
};

export const i18n: Record<Locale, LocaleStrings> = {
  de: {
    siteTitle: "Tim Adler",
    siteDescription:
      "Ich helfe Teams schnell großartige Technik zu bauen, die funktioniert und echten Wert schafft.",
    sectionLabels: {
      about: "Über mich",
      services: "Leistungen",
      work: "Arbeit",
      openSource: "Open Source",
      publications: "Veröffentlichungen",
      projects: "Projekte",
      capabilities: "Das kann ich",
    },
    nav: [
      { key: "home", label: "Home", url: "/" },
      { key: "services", label: "Leistungen", url: "/leistungen" },
      { key: "projects", label: "Projekte", url: "/projekte" },
      { key: "now", label: "Now", url: "/now" },
      { key: "blog", label: "Blog", url: "/blog" },
      { key: "about", label: "Über", url: "/about" },
    ],
    home: {
      kicker: "Willkommen.",
      headline: "Ich bin Tim Adler.",
      intro:
        "Ich spreche verständlich über Technik und helfe Teams schnell großartige Systeme zu bauen, die funktionieren und echten Wert schaffen.",
      roles: [
        "Gelernter Programmierer.",
        "Erfahrener Projekt-Flüsterer.",
        "Als Freelancer buchbar.",
      ],
      ctaPrimary: "Mehr über mich",
      ctaSecondary: "Leistungen ansehen",
      cards: [
        {
          title: "Was ich mache",
          body:
            "Ich baue digitale Produkte von der Idee bis zum Launch, strukturiere Teams und reduziere Komplexität.",
          link: "Mehr zu meinen Leistungen",
          href: "/leistungen",
        },
        {
          title: "Jetzt",
          body:
            "Im Now-Bereich sammle ich kurze Updates, Microblog-Notizen und was mich gerade beschäftigt.",
          link: "Zum Now-Bereich",
          href: "/now",
        },
        {
          title: "Über mich",
          body:
            "Ich denke gern in Systemen, mag klare Sprache und bringe Technik, Produkt und Menschen zusammen.",
          link: "Zur About-Seite",
          href: "/about",
        },
      ],
      blogTitle: "Aus dem Blog",
      blogLink: "Alle Beiträge",
    },
    about: {
      title: "Über mich",
      lead:
        "Ich bin Tim Adler. Seit über 15 Jahren arbeite ich als Designer, Entwickler und Technik-Manager. Ich entwickle digitale Produkte, mache komplexe Technik verständlich und helfe Teams, ihre Projekte wieder in den Griff zu bekommen.",
      lead2:
        "Ich packe gern selbst mit an: vom Programmieren bis zum täglichen Status-Meeting. Meine Rolle ist oft die Übersetzung zwischen Geschäftsanforderungen und technischen Rahmenbedingungen. Kollegen bescheinigen mir offene, direkte Kommunikation, ein Händchen für Organisation und den Blick fürs Wesentliche.",
      skillsTitle: "Das kann ich",
      skills: [
        "Web- und App-Entwicklung mit Fokus auf langlebige Systeme.",
        "Produktstrategie, Priorisierung und klare Roadmaps.",
        "Teams durch Struktur, Workshops und Coaching stabilisieren.",
        "Prozesse verschlanken, damit wieder Zeit fürs Bauen bleibt.",
      ],
      approachTitle: "Wie ich arbeite",
      approachBody:
        "Ich mag klare Sprache, kurze Feedback-Schleifen und Ergebnisse, die messbar sind. Technik soll Freude machen und zuverlässig sein. Deshalb suche ich pragmatische Lösungen, die heute funktionieren und morgen noch halten.",
      highlightsTitle: "Meine Highlights",
      highlights: [
        "Mitgründer und Product Lead bei einem B2B-Startup.",
        "Mehrere Jahre Erfahrung als Tech Lead in Agenturen.",
        "Open-Source-Beiträge und Konferenz-Talks zu moderner Webentwicklung.",
        "Freelancer für Teams, die Tempo und Fokus brauchen.",
      ],
    },
    work: {
      title: "Arbeit",
      lead:
        "Ich baue digitale Produkte, die klar, stabil und schnell sind. Am liebsten dort, wo Technik echten Nutzen bringt: im Alltag, im Unternehmen und in Teams, die mehr erreichen wollen.",
      body1:
        "Effizient großartige, digitale Produkte entwickeln. Das ist nicht einfach. Alles scheint möglich, was für viele zum Fluch wird. Ohne Priorisierung verzetteln wir uns. Anforderungen verändern sich, bevor sie überhaupt fertig beschrieben sind.",
      body2:
        "Genau hier unterstütze ich: beim Strukturieren, Fokussieren und Umsetzen. Ich helfe dabei, Produktideen schnell in belastbare Lösungen zu übersetzen.",
      sections: [
        {
          title: "Publikationen & Projekte",
          body:
            "Ich veröffentliche Konzepte, Tools und Essays rund um Produktentwicklung, Softwarequalität und Teamarbeit. Meine Projekte reichen von internen Plattformen bis zu öffentlichen Werkzeugen.",
        },
        {
          title: "Open Source & Community",
          body:
            "Open Source ist mein Zuhause. Ich teile gerne Lösungen, die andere weiterbringen, und lerne durch Austausch. Wenn etwas gut funktioniert, schreibe ich darüber oder stelle es öffentlich bereit.",
        },
        {
          title: "Startups & Teams",
          body:
            "Ich habe als Mitgründer und Product Lead in einem B2B-Startup gearbeitet, war Tech Lead in Agenturen und unterstütze Teams als Freelancer. Mein Fokus: Tempo, Fokus und Systeme, die skalieren.",
        },
      ],
      cta: "Interesse an Zusammenarbeit?",
      ctaLink: "Lass uns sprechen",
    },
    now: {
      title: "Now",
      lead:
        "Hier sammle ich kurze Updates, Microblog-Notizen und Dinge, die mich gerade beschäftigen. Stand: 3. Februar 2026.",
      microblogTitle: "Microblog",
      updatesTitle: "Updates",
      updates: [
        "Ausbau des persönlichen Blogs und der Ressourcenseite.",
        "Workshops zu Produktstrategie und Technikausrichtung in Planung.",
        "Mehr Zeit für Open-Source und Community-Arbeit reserviert.",
      ],
    },
    blog: {
      title: "Blog",
      lead: "Texte, Notizen und Erkenntnisse aus Produkt, Technik und Teamarbeit.",
      articleNav: {
        prev: "Voriger Artikel",
        next: "Nächster Artikel",
        readIn: "Diesen Artikel auf Englisch lesen",
      },
    },
  },
  en: {
    siteTitle: "Tim Adler",
    siteDescription:
      "I help teams ship great tech fast: clear systems that work and deliver real value.",
    sectionLabels: {
      about: "About",
      services: "Services",
      work: "Work",
      openSource: "Open Source",
      publications: "Publications",
      projects: "Projects",
      capabilities: "What I do",
    },
    nav: [
      { key: "home", label: "Home", url: "/" },
      { key: "services", label: "Services", url: "/services" },
      { key: "projects", label: "Projects", url: "/projects" },
      { key: "now", label: "Now", url: "/now" },
      { key: "blog", label: "Blog", url: "/blog" },
      { key: "about", label: "About", url: "/about" },
    ],
    home: {
      kicker: "Welcome.",
      headline: "I’m Tim Adler.",
      intro:
        "I translate technology into clear language and help teams build strong systems that work and create real value.",
      roles: [
        "Trained programmer.",
        "Experienced project whisperer.",
        "Available as a freelancer.",
      ],
      ctaPrimary: "More about me",
      ctaSecondary: "See services",
      cards: [
        {
          title: "What I do",
          body:
            "I build digital products from idea to launch, structure teams, and reduce complexity.",
          link: "More on my services",
          href: "/services",
        },
        {
          title: "Now",
          body:
            "Short updates, microblog notes, and what’s currently on my mind live here.",
          link: "Go to Now",
          href: "/now",
        },
        {
          title: "About me",
          body:
            "I think in systems, like clear language, and connect tech, product, and people.",
          link: "About page",
          href: "/about",
        },
      ],
      blogTitle: "From the blog",
      blogLink: "All posts",
    },
    about: {
      title: "About",
      lead:
        "I’m Tim Adler. For more than 15 years I’ve worked as a designer, developer, and tech manager. I build digital products, make complex tech understandable, and help teams get projects back on track.",
      lead2:
        "I like to work hands-on, from writing code to running daily standups. My role is often the bridge between business needs and technical realities. Colleagues value my clear communication, organization, and focus on what matters.",
      skillsTitle: "What I’m good at",
      skills: [
        "Web and app development with a focus on long-lived systems.",
        "Product strategy, prioritization, and clear roadmaps.",
        "Stabilizing teams through structure, workshops, and coaching.",
        "Streamlining processes so building can happen again.",
      ],
      approachTitle: "How I work",
      approachBody:
        "I prefer clear language, short feedback loops, and measurable results. Tech should be joyful and reliable, so I look for pragmatic solutions that work today and hold up tomorrow.",
      highlightsTitle: "Highlights",
      highlights: [
        "Co-founder and Product Lead at a B2B startup.",
        "Several years as a Tech Lead in agencies.",
        "Open-source contributions and conference talks on modern web dev.",
        "Freelancer for teams that need speed and focus.",
      ],
    },
    work: {
      title: "Work",
      lead:
        "I build digital products that are clear, stable, and fast. Best when technology creates real value for people and teams.",
      body1:
        "Shipping great digital products isn’t easy. Everything seems possible, which turns into chaos without prioritization. Requirements change before they’re even finished.",
      body2:
        "That’s where I help: structure, focus, and execution. I translate product ideas into resilient solutions quickly.",
      sections: [
        {
          title: "Publications & Projects",
          body:
            "I publish concepts, tools, and essays about product development, software quality, and teamwork. Projects range from internal platforms to public tools.",
        },
        {
          title: "Open Source & Community",
          body:
            "Open source is home. I share solutions that help others and learn by exchanging ideas. When something works well, I write about it or publish it.",
        },
        {
          title: "Startups & Teams",
          body:
            "I’ve worked as a co-founder and product lead in a B2B startup, led teams in agencies, and support teams as a freelancer. My focus: speed, clarity, and scalable systems.",
        },
      ],
      cta: "Interested in working together?",
      ctaLink: "Let’s talk",
    },
    now: {
      title: "Now",
      lead:
        "Short updates, microblog notes, and what I’m currently focused on. Updated February 3, 2026.",
      microblogTitle: "Microblog",
      updatesTitle: "Updates",
      updates: [
        "Expanding the personal blog and resource page.",
        "Workshops on product strategy and technical direction in planning.",
        "Reserving more time for open source and community work.",
      ],
    },
    blog: {
      title: "Blog",
      lead: "Notes and insights on product, technology, and team work.",
      articleNav: {
        prev: "Previous article",
        next: "Next article",
        readIn: "Read this article in German",
      },
    },
  },
};
