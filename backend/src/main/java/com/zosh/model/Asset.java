package com.zosh.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(precision = 24, scale = 8)
    private BigDecimal quantity = BigDecimal.ZERO.setScale(8, RoundingMode.HALF_EVEN);

    @Column(precision = 18, scale = 2)
    private BigDecimal buyPrice = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_EVEN);

    @ManyToOne
    private Coin coin;

    @ManyToOne
    private User user;
}
