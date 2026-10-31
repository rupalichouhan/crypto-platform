package com.zosh.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zosh.domain.OrderStatus;
import com.zosh.domain.OrderType;
import com.zosh.model.Asset;
import com.zosh.model.Coin;
import com.zosh.model.Order;
import com.zosh.model.OrderItem;
import com.zosh.model.User;
import com.zosh.repository.OrderItemRepository;
import com.zosh.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private AssetService assetService;

    @Autowired
    private WalletService walletService;

    @Override
    public Order createOrder(User user, OrderItem orderItem, OrderType orderType) {
        double price = orderItem.getCoin().getCurrentPrice() * orderItem.getQuantity();

        Order order = new Order();
        order.setUser(user);
        order.setOrderItem(orderItem);
        order.setOrderType(orderType);
        order.setPrice(BigDecimal.valueOf(price));
        order.setTimestamp(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(Long orderId) throws Exception {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new Exception("Order not found"));
    }

    @Override
    public List<Order> getAllOrdersOfUser(Long userId, OrderType orderType, String assetSymbol) {
        return orderRepository.findByUserId(userId);
    }

    private OrderItem createOrderItem(Coin coin, double quantity, double buyPrice, double sellPrice) {
        OrderItem orderItem = new OrderItem();
        orderItem.setCoin(coin);
        orderItem.setQuantity(quantity);
        orderItem.setBuyPrice(buyPrice);
        orderItem.setSellPrice(sellPrice);
        return orderItemRepository.save(orderItem);
    }

    @Transactional
    public Order buyAsset(Coin coin, double quantity, User user) throws Exception {
        if (quantity <= 0) {
            throw new Exception("Quantity should be > 0");
        }

        double buyPrice = coin.getCurrentPrice();
        OrderItem orderItem = createOrderItem(coin, quantity, buyPrice, 0);
        Order order = createOrder(user, orderItem, OrderType.BUY);
        orderItem.setOrder(order);

        walletService.payOrderPayment(order, user);
        order.setStatus(OrderStatus.CONFIRMED);
        Order savedOrder = orderRepository.save(order);

        Asset asset = assetService.findAssetByUserIdAndCoinId(user.getId(), coin.getId());
        BigDecimal qtyDecimal = BigDecimal.valueOf(quantity).setScale(8, RoundingMode.HALF_EVEN);
        BigDecimal priceDecimal = BigDecimal.valueOf(buyPrice).setScale(2, RoundingMode.HALF_EVEN);

        if (asset == null) {
            assetService.createAsset(user, coin, qtyDecimal, priceDecimal);
        } else {
            assetService.updateAsset(asset.getId(), qtyDecimal, priceDecimal, true);
        }

        return savedOrder;
    }

    @Transactional
    public Order sellAsset(Coin coin, double quantity, User user) throws Exception {
        if (quantity <= 0) {
            throw new Exception("Quantity should be > 0");
        }

        Asset assetToSell = assetService.findAssetByUserIdAndCoinId(user.getId(), coin.getId());

        if (assetToSell == null) {
            throw new Exception("Asset not found");
        }

        BigDecimal qtyToSell = BigDecimal.valueOf(quantity).setScale(8, RoundingMode.HALF_EVEN);
        BigDecimal currentQty = assetToSell.getQuantity() != null ? assetToSell.getQuantity() : BigDecimal.ZERO;

        if (currentQty.compareTo(qtyToSell) < 0) {
            throw new Exception("Insufficient quantity to sell");
        }

        double sellPrice = coin.getCurrentPrice();
        double buyPrice = assetToSell.getBuyPrice() != null ? assetToSell.getBuyPrice().doubleValue() : 0.0;

        OrderItem orderItem = createOrderItem(coin, quantity, buyPrice, sellPrice);
        Order order = createOrder(user, orderItem, OrderType.SELL);
        orderItem.setOrder(order);

        walletService.payOrderPayment(order, user);
        order.setStatus(OrderStatus.CONFIRMED);
        Order savedOrder = orderRepository.save(order);

        BigDecimal priceDecimal = BigDecimal.valueOf(sellPrice).setScale(2, RoundingMode.HALF_EVEN);
        Asset updatedAsset = assetService.updateAsset(assetToSell.getId(), qtyToSell, priceDecimal, false);

        BigDecimal remainingValue = updatedAsset.getQuantity().multiply(priceDecimal);
        if (remainingValue.compareTo(BigDecimal.ONE) <= 0 || updatedAsset.getQuantity().compareTo(BigDecimal.valueOf(0.00000001)) <= 0) {
            assetService.deleteAsset(updatedAsset.getId());
        }

        return savedOrder;
    }

    @Override
    @Transactional
    public Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception {
        if (orderType == OrderType.BUY) {
            return buyAsset(coin, quantity, user);
        } else if (orderType == OrderType.SELL) {
            return sellAsset(coin, quantity, user);
        } else {
            throw new Exception("Invalid order type");
        }
    }
}