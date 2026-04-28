
package com.zosh.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class Homecontroller {
@GetMapping
public String home(){
    return "Welcome to the trading plateform";
}
@GetMapping("/api")
public String secure(){
    return "Welcome to the trading plateform secure";
}
}
