package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.ForgetPasswordToken;

public interface ForgetPasswordRepository extends JpaRepository<ForgetPasswordToken,String>{
ForgetPasswordToken findByUserId(Long userId);
}
