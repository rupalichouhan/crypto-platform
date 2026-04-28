package com.zosh.service;

import com.zosh.model.Withdrawal;
import com.zosh.model.User;

import java.util.List;

public interface WithdrawalService {

    Withdrawal requestWithdrawal(Long amount, User user);

    Withdrawal processWithdrawal(Long withdrawalId, boolean accept);

    List<Withdrawal> getUserWithdrawalHistory(User user);

    List<Withdrawal> getAllWithdrawalRequests();
}