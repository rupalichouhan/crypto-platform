package com.zosh.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zosh.domain.OrderType;
import com.zosh.model.Order;
import com.zosh.model.User;
import com.zosh.model.Wallet;
import com.zosh.repository.WalletRepository;

@Service
public class WalletServiceImpl implements WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Override
    @Transactional
    public Wallet getUserWallet(User user) {
        Wallet wallet = walletRepository.findByUserId(user.getId());

        if (wallet == null) {
            wallet = new Wallet();
            wallet.setUser(user);
            wallet.setBalance(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_EVEN));
            wallet = walletRepository.save(wallet);
        } else if (wallet.getBalance() == null) {
            wallet.setBalance(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_EVEN));
            wallet = walletRepository.save(wallet);
        }

        return wallet;
    }

    @Override
    @Transactional
    public Wallet addBalance(Wallet wallet, Long amount) {
        BigDecimal balance = wallet.getBalance() != null
                ? wallet.getBalance().setScale(2, RoundingMode.HALF_EVEN)
                : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal toAdd = BigDecimal.valueOf(amount != null ? amount : 0L).setScale(2, RoundingMode.HALF_EVEN);
        wallet.setBalance(balance.add(toAdd).setScale(2, RoundingMode.HALF_EVEN));
        return walletRepository.save(wallet);
    }

    @Override
    public Wallet findWalletById(Long id) throws Exception {
        return walletRepository.findById(id)
                .orElseThrow(() -> new Exception("Wallet not found"));
    }

    @Override
    @Transactional
    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws Exception {
        Wallet senderWallet = walletRepository.findByUserIdWithLock(sender.getId());
        if (senderWallet == null) {
            senderWallet = getUserWallet(sender);
        }

        BigDecimal transferAmount = BigDecimal.valueOf(amount != null ? amount : 0L).setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal senderBalance = (senderWallet.getBalance() != null
                ? senderWallet.getBalance()
                : BigDecimal.ZERO).setScale(2, RoundingMode.HALF_EVEN);

        if (senderBalance.compareTo(transferAmount) < 0) {
            throw new Exception("Insufficient balance for transfer");
        }

        senderWallet.setBalance(senderBalance.subtract(transferAmount).setScale(2, RoundingMode.HALF_EVEN));
        walletRepository.save(senderWallet);

        BigDecimal receiverBalance = (receiverWallet.getBalance() != null
                ? receiverWallet.getBalance()
                : BigDecimal.ZERO).setScale(2, RoundingMode.HALF_EVEN);
        receiverWallet.setBalance(receiverBalance.add(transferAmount).setScale(2, RoundingMode.HALF_EVEN));
        walletRepository.save(receiverWallet);

        return senderWallet;
    }

    @Override
    @Transactional
    public Wallet payOrderPayment(Order order, User user) throws Exception {
        Wallet wallet = walletRepository.findByUserIdWithLock(user.getId());
        if (wallet == null) {
            wallet = getUserWallet(user);
        }

        BigDecimal orderPrice = (order.getPrice() != null
                ? order.getPrice()
                : BigDecimal.ZERO).setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal currentBalance = (wallet.getBalance() != null
                ? wallet.getBalance()
                : BigDecimal.ZERO).setScale(2, RoundingMode.HALF_EVEN);

        // 0.1% platform trading fee
        BigDecimal platformFee = orderPrice.multiply(BigDecimal.valueOf(0.001)).setScale(2, RoundingMode.HALF_EVEN);

        if (order.getOrderType().equals(OrderType.BUY)) {
            BigDecimal totalRequired = orderPrice.add(platformFee).setScale(2, RoundingMode.HALF_EVEN);
            if (currentBalance.compareTo(totalRequired) < 0) {
                throw new Exception("Insufficient funds for this transaction (including 0.1% platform fee)");
            }
            wallet.setBalance(currentBalance.subtract(totalRequired).setScale(2, RoundingMode.HALF_EVEN));
        } else {
            BigDecimal netProceeds = orderPrice.subtract(platformFee).setScale(2, RoundingMode.HALF_EVEN);
            wallet.setBalance(currentBalance.add(netProceeds).setScale(2, RoundingMode.HALF_EVEN));
        }

        return walletRepository.save(wallet);
    }
}
