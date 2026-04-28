package com.zosh.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Roi {
    @JsonProperty("times")
    private double times;

    @JsonProperty("currency")
    private String currency;

    @JsonProperty("percentage")
    private double percentage;
}