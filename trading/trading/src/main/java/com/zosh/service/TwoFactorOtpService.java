package com.zosh.service;


import com.zosh.model.User;
import com.zosh.model.TwoFactorOTP;

public interface TwoFactorOtpService { 

TwoFactorOTP createTwoFactorOtp (User user, String otp, String jwt);



TwoFactorOTP findByUser (Long userId); 

TwoFactorOTP findById(String id); 

boolean verifyTwoFactor0tp (TwoFactorOTP twoFactorOtp, String otp);


void deleteTwoFactor0tp (TwoFactorOTP twoFactor0tp);
}
