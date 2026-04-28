package com.zosh.service;

import com.zosh.model.Coin;
import com.zosh.model.Watchlist;
import com.zosh.model.User;

public interface WatchlistService {

    Watchlist findUserWatchlist(Long userId) throws Exception;

    Watchlist createWatchlist(User user);

    Watchlist findById(Long id) throws Exception;

    Coin addItemToWatchlist(Coin coin, User user);
    
}