package com.zosh.service;

import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public Wallet getUserWallet(User user) {
        Wallet wallet = walletRepository.findByUserId(user.getId());

        if (wallet == null) {
            wallet = new Wallet();
            wallet.setUser(user);
            wallet.setBalance(BigDecimal.ZERO); // Ensure balance is initialized
            wallet = walletRepository.save(wallet);
        }

        return wallet;
    }

    @Override
    public Wallet addBalance(Wallet wallet, Long amount) {
        BigDecimal balance = wallet.getBalance() != null ? wallet.getBalance() : BigDecimal.ZERO;
        BigDecimal newBalance = balance.add(BigDecimal.valueOf(amount));
        wallet.setBalance(newBalance);
        return walletRepository.save(wallet);
    }

    @Override
    public Wallet findWalletById(Long id) throws Exception {
        return walletRepository.findById(id)
                .orElseThrow(() -> new Exception("Wallet not found"));
    }

    @Override
    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws Exception {
        Wallet senderWallet = getUserWallet(sender);

        BigDecimal transferAmount = BigDecimal.valueOf(amount);
        if (senderWallet.getBalance().compareTo(transferAmount) < 0) {
            throw new Exception("Insufficient balance...");
        }

        senderWallet.setBalance(senderWallet.getBalance().subtract(transferAmount));
        walletRepository.save(senderWallet);

        receiverWallet.setBalance(receiverWallet.getBalance().add(transferAmount));
        walletRepository.save(receiverWallet);

        return senderWallet;
    }

    @Override
    public Wallet payOrderPayment(Order order, User user) throws Exception {
        Wallet wallet = getUserWallet(user);
        BigDecimal orderPrice = order.getPrice();
        BigDecimal currentBalance = wallet.getBalance();

        if (order.getOrderType().equals(OrderType.BUY)) {
            if (currentBalance.compareTo(orderPrice) < 0) {
                throw new Exception("Insufficient funds for this transaction");
            }
            wallet.setBalance(currentBalance.subtract(orderPrice));
        } else {
            wallet.setBalance(currentBalance.add(orderPrice));
        }

        return walletRepository.save(wallet);
    }
}