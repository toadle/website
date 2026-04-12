const monthNames = {
  de: [
    "Jan",
    "Feb",
    "Maerz",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
} as const;

export const formatNowLabel = (date: Date, locale: "de" | "en"): string => {
  const day = date.getUTCDate();
  const month = monthNames[locale][date.getUTCMonth()];
  const year = date.getUTCFullYear();

  if (locale === "de") {
    return `${day}. ${month} ${year}`;
  }

  return `${month} ${day}, ${year}`;
};
