package com.zosh.request;

import com.zosh.domain.VerificationType;

import lombok.Data;

@Data
public class ForgetPasswordTokenRequest {
    private String sendTo ;
    private VerificationType verificationType;
}
