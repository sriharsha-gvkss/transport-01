package com.taxi.booking.controller;

import com.taxi.booking.model.Booking;
import com.taxi.booking.service.BookingService;
import com.taxi.booking.service.DriverNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    
    private static final Logger log = LoggerFactory.getLogger(BookingController.class);
    
    private final BookingService bookingService;
    
    @Autowired
    private ApplicationContext applicationContext;
    
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "booking-service",
            "timestamp", System.currentTimeMillis()
        ));
    }
    
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        log.info("Received booking request: {}", booking);
        Booking createdBooking = bookingService.createBooking(booking);
        return ResponseEntity.ok(createdBooking);
    }
    
    @PostMapping("/with-notification")
    public ResponseEntity<Booking> createBookingWithNotification(@RequestBody Map<String, Object> request) {
        try {
            log.info("Received booking request with notification: {}", request);
            
            Booking booking = new Booking();
            booking.setRiderId((String) request.get("riderId"));
            booking.setPickupLocation((String) request.get("pickupLocation"));
            booking.setDestination((String) request.get("destinationLocation"));
            
            // Handle numeric values properly (they might come as Integer or Double from JSON)
            Double distance = null;
            Double duration = null;
            Double price = null;
            
            Object distanceObj = request.get("distance");
            Object durationObj = request.get("duration");
            Object priceObj = request.get("price");
            
            if (distanceObj instanceof Number) {
                distance = ((Number) distanceObj).doubleValue();
            } else if (distanceObj instanceof String) {
                distance = Double.parseDouble((String) distanceObj);
            }
            
            if (durationObj instanceof Number) {
                duration = ((Number) durationObj).doubleValue();
            } else if (durationObj instanceof String) {
                duration = Double.parseDouble((String) durationObj);
            }
            
            if (priceObj instanceof Number) {
                price = ((Number) priceObj).doubleValue();
            } else if (priceObj instanceof String) {
                price = Double.parseDouble((String) priceObj);
            }
            
            String driverId = (String) request.get("driverId");
            
            log.info("Parsed booking data - distance: {}, duration: {}, price: {}, driverId: {}", 
                    distance, duration, price, driverId);
            
            Booking createdBooking;
            if (driverId != null && !driverId.isEmpty()) {
                // If specific driver is provided, use direct notification
                createdBooking = bookingService.createBookingWithNotification(
                    booking, distance, duration, price, driverId);
            } else {
                // If no specific driver, use auto-matching with GeoMatchingService
                createdBooking = bookingService.createBookingWithAutoMatching(
                    booking, distance, duration, price);
            }
            
            return ResponseEntity.ok(createdBooking);
            
        } catch (Exception e) {
            log.error("Error creating booking with notification", e);
            return ResponseEntity.status(500).build();
        }
    }
    
    @PostMapping("/auto-match")
    public ResponseEntity<Booking> createBookingWithAutoMatching(@RequestBody Map<String, Object> request) {
        try {
            log.info("Received booking request with auto-matching: {}", request);
            
            Booking booking = new Booking();
            booking.setRiderId((String) request.get("riderId"));
            booking.setPickupLocation((String) request.get("pickupLocation"));
            booking.setDestination((String) request.get("destinationLocation"));
            
            // Handle numeric values properly (they might come as Integer or Double from JSON)
            Double distance = null;
            Double duration = null;
            Double price = null;
            
            Object distanceObj = request.get("distance");
            Object durationObj = request.get("duration");
            Object priceObj = request.get("price");
            
            if (distanceObj instanceof Number) {
                distance = ((Number) distanceObj).doubleValue();
            } else if (distanceObj instanceof String) {
                distance = Double.parseDouble((String) distanceObj);
            }
            
            if (durationObj instanceof Number) {
                duration = ((Number) durationObj).doubleValue();
            } else if (durationObj instanceof String) {
                duration = Double.parseDouble((String) durationObj);
            }
            
            if (priceObj instanceof Number) {
                price = ((Number) priceObj).doubleValue();
            } else if (priceObj instanceof String) {
                price = Double.parseDouble((String) priceObj);
            }
            
            Booking createdBooking = bookingService.createBookingWithAutoMatching(
                booking, distance, duration, price);
            
            return ResponseEntity.ok(createdBooking);
            
        } catch (Exception e) {
            log.error("Error creating booking with auto-matching", e);
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
    
    @GetMapping("/connected-drivers")
    public ResponseEntity<List<String>> getConnectedDrivers() {
        try {
            var driverNotificationService = applicationContext.getBean(DriverNotificationService.class);
            List<String> connectedDrivers = driverNotificationService.getAvailableDrivers();
            return ResponseEntity.ok(connectedDrivers);
        } catch (Exception e) {
            log.error("Error getting connected drivers", e);
            return ResponseEntity.ok(List.of());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/rider/{riderId}")
    public ResponseEntity<List<Booking>> getBookingsByRiderId(@PathVariable String riderId) {
        return ResponseEntity.ok(bookingService.getBookingsByRiderId(riderId));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        Booking updatedBooking = bookingService.updateBookingStatus(id, status);
        if (updatedBooking != null) {
            return ResponseEntity.ok(updatedBooking);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/assign-driver")
    public ResponseEntity<Booking> assignDriver(@PathVariable Long id, @RequestParam String driverId) {
        Booking updatedBooking = bookingService.assignDriver(id, driverId);
        if (updatedBooking != null) {
            return ResponseEntity.ok(updatedBooking);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{id}/driver-response")
    public ResponseEntity<Booking> driverResponse(
            @PathVariable Long id,
            @RequestBody Map<String, String> response) {
        
        String action = response.get("action"); // "accept" or "decline"
        String driverId = response.get("driverId");
        
        return bookingService.getBookingById(id)
                .map(booking -> {
                    if ("accept".equalsIgnoreCase(action)) {
                        booking.setDriverAssignmentStatus("ACCEPTED");
                        booking.setStatus("IN_PROGRESS");
                        log.info("Driver {} accepted booking {}", driverId, id);
                    } else if ("decline".equalsIgnoreCase(action)) {
                        booking.setDriverAssignmentStatus("DECLINED");
                        booking.setStatus("REQUESTED"); // Reset to find another driver
                        booking.setDriverId(null); // Remove driver assignment
                        log.info("Driver {} declined booking {}", driverId, id);
                    }
                    
                    Booking updatedBooking = bookingService.updateBooking(booking);
                    return ResponseEntity.ok(updatedBooking);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Booking>> getDriverBookings(@PathVariable String driverId) {
        List<Booking> bookings = bookingService.getBookingsByDriverId(driverId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Booking>> getAvailableBookings() {
        try {
            // Get bookings that are in REQUESTED status (waiting for driver)
            List<Booking> availableBookings = bookingService.getBookingsByStatus("REQUESTED");
            return ResponseEntity.ok(availableBookings);
        } catch (Exception e) {
            log.error("Error getting available bookings", e);
            return ResponseEntity.ok(List.of());
        }
    }
} 