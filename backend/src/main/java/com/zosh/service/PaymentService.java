package com.zosh.service;

import com.zosh.model.User;
import com.razorpay.RazorpayException;
import com.zosh.domain.PaymentMethod;
import com.zosh.model.PaymentOrder;
import com.zosh.response.PaymentResponse;

public interface PaymentService {

    PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws RazorpayException;

    PaymentResponse createRazorpayPaymentLink(User user, Long amount);

    PaymentResponse createStripePaymentLink(User user, Long amount, Long orderId);

    Boolean verifyRazorpayPayment(Long paymentOrderId, String razorpayPaymentId, String razorpaySignature);
}