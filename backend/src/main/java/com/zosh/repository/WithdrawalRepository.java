package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.zosh.model.Withdrawal;
import java.util.List;

public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {

    List<Withdrawal> findByUserId(Long userId);
}