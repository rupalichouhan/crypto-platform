package com.zosh.service;

import com.zosh.domain.VerificationType;
import com.zosh.model.User;
import com.zosh.model.VerificationCode;

public interface VerificationCodeService {

    VerificationCode sendVerificationCode(User user , VerificationType verificationType);
    VerificationCode getVerificationCodeById(Long id) throws Exception;   
    VerificationCode getVerificationCodeByUserId(Long userId); 
    void deleteVerificationCodeById(VerificationCode verificationCode);

}
