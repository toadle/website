type NowLikeEntry = {
  id: string;
  data: {
    date: Date;
  };
};

export const sortNowEntries = <T extends NowLikeEntry>(entries: T[]): T[] => {
  return [...entries].sort((a, b) => {
    const dateDelta = b.data.date.valueOf() - a.data.date.valueOf();

    if (dateDelta !== 0) {
      return dateDelta;
    }

    return a.id.localeCompare(b.id);
  });
};
