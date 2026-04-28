package com.zosh.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zosh.model.TwoFactorOTP;
import com.zosh.model.User;
import com.zosh.repository.TwoFactorOtpRepository;

@Service
public class TwoFactorOtpServiceImpl implements TwoFactorOtpService {
    @Autowired
    private TwoFactorOtpRepository twoFactorOtpRepository;
    @Override
    public TwoFactorOTP createTwoFactorOtp(User user, String otp, String jwt) {
UUID uuid = UUID.randomUUID();

String id=uuid.toString();

TwoFactorOTP twoFactor0TP=new TwoFactorOTP();

twoFactor0TP.setOtp(otp);

twoFactor0TP.setJwt(jwt);

twoFactor0TP.setId(id);

twoFactor0TP.setUser(user);
return twoFactorOtpRepository.save(twoFactor0TP);

}

    @Override
    public TwoFactorOTP findByUser(Long userId) {
        return twoFactorOtpRepository.findByUserId(userId);
    }

    @Override
    public TwoFactorOTP findById(String id) {
        Optional<TwoFactorOTP> opt = twoFactorOtpRepository.findById(id);
    return opt.orElse(null);
    }

    @Override
    public boolean verifyTwoFactor0tp(TwoFactorOTP twoFactorOtp, String otp) {
        return twoFactorOtp.getOtp().equals(otp);
    }

    @Override
    public void deleteTwoFactor0tp(TwoFactorOTP twoFactor0tp) {
        twoFactorOtpRepository.delete(twoFactor0tp);
    }

}
