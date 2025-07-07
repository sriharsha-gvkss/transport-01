package com.taxi.booking.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello from TestController!";
    }
} 