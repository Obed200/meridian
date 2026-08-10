export type Locale = "rw" | "en";
export type DbLocale = "RW" | "EN";

export const DEFAULT_LOCALE: Locale = "rw";
export const LOCALES: Locale[] = ["rw", "en"];

export function toDbLocale(locale: Locale): DbLocale {
  return locale === "rw" ? "RW" : "EN";
}

export function fromDbLocale(dbLocale: DbLocale): Locale {
  return dbLocale === "RW" ? "rw" : "en";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "rw" ? "en" : "rw";
}

export function localeHome(locale: Locale): string {
  return locale === "rw" ? "/" : "/en";
}

export function localeCategoryHref(locale: Locale, categorySlug: string): string {
  return locale === "rw" ? `/${categorySlug}` : `/en/${categorySlug}`;
}

export function localeArticleHref(locale: Locale, categorySlug: string, postSlug: string): string {
  return locale === "rw" ? `/${categorySlug}/${postSlug}` : `/en/${categorySlug}/${postSlug}`;
}

type Dictionary = {
  staffLogin: string;
  switchLanguage: string;
  advertisement: string;
  moreIn: (category: string) => string;
  moreInHeading: (category: string) => string;
  byAuthor: (name: string) => string;
  noStories: string;
  frontPage: string;
  footerTagline: string;
  allRightsReserved: string;
  notFoundTitle: string;
  notFoundBody: string;
  backToFrontPage: string;
  dateLocale: string;
};

export const dictionaries: Record<Locale, Dictionary> = {
  rw: {
    staffLogin: "Kwinjira kw'abakozi",
    switchLanguage: "English",
    advertisement: "Kwamamaza",
    moreIn: (category) => `Ibindi muri ${category} →`,
    moreInHeading: (category) => `Ibindi muri ${category}`,
    byAuthor: (name) => `Yanditswe na ${name}`,
    noStories: "Nta nkuru zaratangazwa muri iki gice.",
    frontPage: "Ahabanza",
    footerTagline:
      "Amakuru y'ukuri, atangwa mu buryo bwumvikana. Dutanga amakuru agezweho ku byerekeye igihugu cyacu, ubukungu, n'imiryango dutuyemo.",
    allRightsReserved: "Uburenganzira bwose burarindwa.",
    notFoundTitle: "Ntibyabonetse",
    notFoundBody: "Ntitwabashije kubona iyo nkuru.",
    backToFrontPage: "Subira ahabanza",
    dateLocale: "rw",
  },
  en: {
    staffLogin: "Staff login",
    switchLanguage: "Kinyarwanda",
    advertisement: "Advertisement",
    moreIn: (category) => `More in ${category} →`,
    moreInHeading: (category) => `More in ${category}`,
    byAuthor: (name) => `By ${name}`,
    noStories: "No stories published in this section yet.",
    frontPage: "Home",
    footerTagline:
      "Independent journalism, clearly told. Reporting on the stories that shape our world, our economy, and our communities.",
    allRightsReserved: "All rights reserved.",
    notFoundTitle: "404",
    notFoundBody: "We couldn't find that story.",
    backToFrontPage: "Back to the front page",
    dateLocale: "en",
  },
};
