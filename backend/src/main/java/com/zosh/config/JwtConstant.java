package com.zosh.config;

public class JwtConstant {
    /**
     * @deprecated Hardcoded secrets are insecure. Use externalized property `jwt.secret` via Spring configuration.
     */
    @Deprecated
    public static final String SECRET_KEY = "ghdyrdbkjbkihihhhbvhrbirhsuihbbfvsrughuvbrsuhfvnhguvuhanhfvjbgbgvfvevfbjdbvdkjfbkjd";
    public static final String JWT_HEADER = "Authorization";
}
