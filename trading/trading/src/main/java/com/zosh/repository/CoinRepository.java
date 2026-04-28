package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zosh.model.Coin;

@Repository
public interface CoinRepository extends JpaRepository<Coin, String> {
    // You can define custom query methods here, if needed
}