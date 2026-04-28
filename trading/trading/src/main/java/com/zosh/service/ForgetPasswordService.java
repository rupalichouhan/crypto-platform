package com.zosh.service;

import com.zosh.domain.VerificationType;
import com.zosh.model.ForgetPasswordToken;
import com.zosh.model.User;

public interface ForgetPasswordService {
ForgetPasswordToken createToken (User user,String id, String otp, VerificationType verificationType, String sendTo);
ForgetPasswordToken findById(String id);
ForgetPasswordToken findByUser(Long userId);
void deleteToken (ForgetPasswordToken token);
}
