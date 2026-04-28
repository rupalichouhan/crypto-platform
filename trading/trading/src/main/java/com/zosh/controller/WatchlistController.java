package com.zosh.controller;

import com.zosh.model.Coin;
import com.zosh.model.User;
import com.zosh.model.Watchlist;
import com.zosh.service.CoinService;
import com.zosh.service.UserService;
import com.zosh.service.WatchlistService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @Autowired
    private UserService userService;

    @Autowired
    private CoinService coinService;

   @GetMapping("/user")
public ResponseEntity<?> getUserWatchlist(@RequestHeader("Authorization") String jwt) {
    try {
        User user = userService.findUserProfileByJwt(jwt);
        Watchlist watchlist;
        try {
            watchlist = watchlistService.findUserWatchlist(user.getId());
        } catch (Exception e) {
            // Watchlist not found, so create a new one
            watchlist = watchlistService.createWatchlist(user);
        }

        return ResponseEntity.ok(watchlist);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Something went wrong: " + e.getMessage());
    }
}

    @GetMapping("/{watchlistId}")
    public ResponseEntity<Watchlist> getWatchlistById(
            @PathVariable Long watchlistId) throws Exception {

        Watchlist watchlist = watchlistService.findById(watchlistId);
        return ResponseEntity.ok(watchlist);
    }

    @PatchMapping("/add/coin/{coinId}")
    public ResponseEntity<Coin> addItemToWatchlist(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String coinId) throws Exception {
                if (coinId == null) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
}

        User user = userService.findUserProfileByJwt(jwt);
        Coin coin = coinService.findById(coinId);
        Coin addedCoin = watchlistService.addItemToWatchlist(coin, user);
        return ResponseEntity.ok(addedCoin);
    }
}