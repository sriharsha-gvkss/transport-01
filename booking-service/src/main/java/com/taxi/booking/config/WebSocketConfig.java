package com.taxi.booking.config;

import com.taxi.booking.websocket.DriverLocationWebSocketHandler;
import com.taxi.booking.websocket.DriverNotificationWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    
    private final DriverLocationWebSocketHandler driverLocationWebSocketHandler;
    private final DriverNotificationWebSocketHandler driverNotificationWebSocketHandler;
    
    public WebSocketConfig(DriverLocationWebSocketHandler driverLocationWebSocketHandler,
                          DriverNotificationWebSocketHandler driverNotificationWebSocketHandler) {
        this.driverLocationWebSocketHandler = driverLocationWebSocketHandler;
        this.driverNotificationWebSocketHandler = driverNotificationWebSocketHandler;
    }
    
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(driverLocationWebSocketHandler, "/ws/driver-location")
                .setAllowedOrigins("*");
        
        registry.addHandler(driverNotificationWebSocketHandler, "/ws/driver-notifications")
                .setAllowedOrigins("*");
    }
} 