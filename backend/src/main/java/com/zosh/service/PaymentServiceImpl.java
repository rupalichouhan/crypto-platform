package com.zosh.service;

import com.razorpay.*;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.zosh.domain.PaymentMethod;
import com.zosh.domain.PaymentOrderStatus;
import com.zosh.model.PaymentOrder;
import com.zosh.model.User;
import com.zosh.repository.PaymentOrderRepository;
import com.zosh.response.PaymentResponse;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentOrderRepository paymentOrderRepository;

    @Autowired
    private WalletService walletService;

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${razorpay.api.key}")
    private String razorpayKey;

    @Value("${razorpay.api.secret}")
    private String razorpaySecret;

    private RazorpayClient getRazorpayClient() throws RazorpayException {
        return new RazorpayClient(razorpayKey, razorpaySecret);
    }

    @Override
    public PaymentOrder createOrder(User user, Long amount, PaymentMethod method) {
        PaymentOrder order = new PaymentOrder();
        order.setUser(user);
        order.setAmount(amount);
        order.setPaymentMethod(method);
        order.setStatus(PaymentOrderStatus.PENDING);
        return paymentOrderRepository.save(order);
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        return paymentOrderRepository.findById(id)
                .orElseThrow(() -> new Exception("Payment order not found"));
    }

    @Override
    public Boolean proceedPaymentOrder(PaymentOrder order, String paymentId) throws RazorpayException {
        if (!PaymentOrderStatus.PENDING.equals(order.getStatus())) return false;

        if (PaymentMethod.RAZORPAY.equals(order.getPaymentMethod())) {
            RazorpayClient client = getRazorpayClient();
            Payment payment = client.payments.fetch(paymentId);
            String status = payment.get("status");

            if ("captured".equals(status)) {
                order.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(order);
                return true;
            } else {
                order.setStatus(PaymentOrderStatus.FAILED);
                paymentOrderRepository.save(order);
                return false;
            }
        }

        // Default to success for other methods (e.g., Stripe)
        order.setStatus(PaymentOrderStatus.SUCCESS);
        paymentOrderRepository.save(order);
        return true;
    }

    @Override
    public Boolean verifyRazorpayPayment(Long paymentOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            PaymentOrder order = getPaymentOrderById(paymentOrderId);
            if (order == null || !PaymentOrderStatus.PENDING.equals(order.getStatus())) {
                return false;
            }

            boolean isValid = false;

            if (razorpaySecret != null && !razorpaySecret.isBlank() && !razorpaySecret.startsWith("mock_")) {
                try {
                    String payload = paymentOrderId + "|" + razorpayPaymentId;
                    SecretKeySpec signingKey = new SecretKeySpec(razorpaySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
                    Mac mac = Mac.getInstance("HmacSHA256");
                    mac.init(signingKey);
                    byte[] rawHmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
                    StringBuilder hex = new StringBuilder();
                    for (byte b : rawHmac) {
                        hex.append(String.format("%02x", b));
                    }
                    isValid = hex.toString().equalsIgnoreCase(razorpaySignature);
                } catch (Exception ex) {
                    isValid = false;
                }
            } else {
                // In local simulated demo mode, accept verification if paymentId is provided
                isValid = (razorpayPaymentId != null && !razorpayPaymentId.isBlank());
            }

            if (isValid) {
                order.setStatus(PaymentOrderStatus.SUCCESS);
                paymentOrderRepository.save(order);
                walletService.addBalance(walletService.getUserWallet(order.getUser()), order.getAmount());
                return true;
            } else {
                order.setStatus(PaymentOrderStatus.FAILED);
                paymentOrderRepository.save(order);
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public PaymentResponse createRazorpayPaymentLink(User user, Long amount) {
        try {
            RazorpayClient client = getRazorpayClient();

            JSONObject request = new JSONObject();
            request.put("amount", amount * 100); // INR in paisa
            request.put("currency", "INR");
            request.put("reminder_enable", true);
            request.put("callback_url", "http://localhost:5173/wallet");
            request.put("callback_method", "get");

            JSONObject customer = new JSONObject();
            customer.put("name", user.getFullname());
            customer.put("email", user.getEmail());
            request.put("customer", customer);

            JSONObject notify = new JSONObject();
            notify.put("email", true);
            request.put("notify", notify);

            PaymentLink link = client.paymentLink.create(request);

            PaymentResponse response = new PaymentResponse();
            response.setPayment_url(link.get("short_url"));
            return response;

        } catch (RazorpayException e) {
            System.out.println("Razorpay failure: " + e.getMessage());
            throw new RuntimeException("Razorpay payment link creation failed");
        }
    }

    @Override
    public PaymentResponse createStripePaymentLink(User user, Long amount, Long orderId) {
        try {
            Stripe.apiKey = stripeSecretKey;

            SessionCreateParams params = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:5173/wallet?order_id=" + orderId)
                    .setCancelUrl("http://localhost:5173/payment/cancel")
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("usd")
                                                    .setUnitAmount(amount * 180) // Conversion logic for USD
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Top up wallet")
                                                                    .build())
                                                    .build())
                                    .build())
                    .build();

            Session session = Session.create(params);
            PaymentResponse response = new PaymentResponse();
            response.setPayment_url(session.getUrl());
            return response;

        } catch (Exception e) {
            System.out.println("Stripe failure: " + e.getMessage());
            throw new RuntimeException("Stripe payment link creation failed");
        }
    }
}