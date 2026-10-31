package com.zosh.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class PaymentResponse {
    private String payment_url;
    
}