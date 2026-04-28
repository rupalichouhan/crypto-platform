package com.zosh.service;

import com.zosh.model.PaymentDetails;
import com.zosh.model.User;

public interface PaymentDetailsService {

    PaymentDetails addPaymentDetails(
        String accountNumber,
        String accountHolderName,
        String ifsc,
        String bankName,
        User user
    );

    PaymentDetails getPaymentDetailsByUser(User user);
}