package com.taxi.booking;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/simple")
@CrossOrigin(origins = "*")
public class SimpleTestController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello from SimpleTestController!";
    }
} 