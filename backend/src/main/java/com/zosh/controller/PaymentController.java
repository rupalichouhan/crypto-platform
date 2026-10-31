package com.zosh.controller;

import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.zosh.domain.PaymentMethod;
import com.zosh.model.PaymentOrder;
import com.zosh.model.User;
import com.zosh.request.PaymentVerificationRequest;
import com.zosh.response.ApiResponse;
import com.zosh.response.PaymentResponse;
import com.zosh.service.PaymentService;
import com.zosh.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PaymentController {

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/payment/{paymentMethod}/amount/{amount}")
    public ResponseEntity<PaymentResponse> paymentHandler(
            @PathVariable PaymentMethod paymentMethod,
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt
    ) throws Exception, RazorpayException, StripeException {

        User user = userService.findUserProfileByJwt(jwt);
        PaymentOrder order = paymentService.createOrder(user, amount, paymentMethod);
        PaymentResponse paymentResponse;

        if (paymentMethod.equals(PaymentMethod.RAZORPAY)) {
            paymentResponse = paymentService.createRazorpayPaymentLink(user, amount);
        } else {
            paymentResponse = paymentService.createStripePaymentLink(user, amount, order.getId());
        }

        return new ResponseEntity<>(paymentResponse, HttpStatus.CREATED);
    }

    @PostMapping("/payment/razorpay/verify")
    public ResponseEntity<ApiResponse> verifyRazorpayPayment(
            @RequestBody PaymentVerificationRequest req,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Boolean verified = paymentService.verifyRazorpayPayment(
                req.getPaymentOrderId(),
                req.getRazorpayPaymentId(),
                req.getRazorpaySignature()
        );

        ApiResponse response = new ApiResponse();
        if (verified) {
            response.setMessage("Payment verified successfully and wallet credited.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.setMessage("Payment verification failed.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}