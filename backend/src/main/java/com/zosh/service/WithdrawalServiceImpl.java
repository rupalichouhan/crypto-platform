package com.zosh.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zosh.domain.WithdrawalStatus;
import com.zosh.model.User;
import com.zosh.model.Withdrawal;
import com.zosh.repository.WithdrawalRepository;

@Service
public class WithdrawalServiceImpl implements WithdrawalService {

    @Autowired
    private WithdrawalRepository withdrawalRepository;

    @Override
    public Withdrawal requestWithdrawal(Long amount, User user) {
        Withdrawal withdrawal = new Withdrawal();
        withdrawal.setAmount(amount);
        withdrawal.setUser(user);
        withdrawal.setStatus(WithdrawalStatus.PENDING);
        return withdrawalRepository.save(withdrawal);
    }

    @Override
    public Withdrawal processWithdrawal(Long withdrawalId, boolean accept) {
        Optional<Withdrawal> withdrawal = withdrawalRepository.findById(withdrawalId);

        if (withdrawal.isEmpty()) {
            throw new RuntimeException("Withdrawal not found");
        }

        Withdrawal withdrawalToProcess = withdrawal.get();
        withdrawalToProcess.setDate(LocalDateTime.now());

        if (accept) {
            withdrawalToProcess.setStatus(WithdrawalStatus.SUCCESS);
        } else {
            withdrawalToProcess.setStatus(WithdrawalStatus.PENDING);
        }

        return withdrawalRepository.save(withdrawalToProcess);
    }

    @Override
    public List<Withdrawal> getUserWithdrawalHistory(User user) {
        return withdrawalRepository.findByUserId(user.getId());
    }

    @Override
    public List<Withdrawal> getAllWithdrawalRequests() {
        return withdrawalRepository.findAll();
    }
}