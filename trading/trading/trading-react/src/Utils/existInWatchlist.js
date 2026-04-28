// src/Util/existInWatchlist.js

export const existInWatchlist = (items = [], coin) => {
  if (!coin || !coin.id) return false;

  return items.some((item) => item.id === coin.id);
};
