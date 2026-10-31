package com.zosh.request;

import lombok.Data;

@Data
public class PaymentVerificationRequest {
    private Long paymentOrderId;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
}
