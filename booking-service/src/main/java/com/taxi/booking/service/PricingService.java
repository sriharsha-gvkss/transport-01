package com.taxi.booking.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;

@Service
public class PricingService {
    
    // Pricing per km for different vehicle types (Rapido-style pricing)
    private static final Map<String, Double> PRICING_PER_KM = new HashMap<>();
    
    static {
        PRICING_PER_KM.put("BIKE", 7.0); // ₹7/km for bike taxi
        PRICING_PER_KM.put("SCOOTER", 8.0); // ₹8/km for scooter
        PRICING_PER_KM.put("MOTORCYCLE", 9.0); // ₹9/km for motorcycle
        PRICING_PER_KM.put("ELECTRIC_BIKE", 6.0); // ₹6/km for electric bike
        PRICING_PER_KM.put("ELECTRIC_SCOOTER", 7.0); // ₹7/km for electric scooter
        PRICING_PER_KM.put("AUTO", 11.0); // ₹11/km for auto
        PRICING_PER_KM.put("CAR", 18.0); // ₹18/km for car (average of mini to SUV)
    }
    
    // Base fare for different vehicle types
    private static final Map<String, Double> BASE_FARE = new HashMap<>();
    
    static {
        BASE_FARE.put("BIKE", 20.0); // ₹20 base fare for bike
        BASE_FARE.put("SCOOTER", 25.0); // ₹25 base fare for scooter
        BASE_FARE.put("MOTORCYCLE", 30.0); // ₹30 base fare for motorcycle
        BASE_FARE.put("ELECTRIC_BIKE", 15.0); // ₹15 base fare for electric bike
        BASE_FARE.put("ELECTRIC_SCOOTER", 18.0); // ₹18 base fare for electric scooter
        BASE_FARE.put("AUTO", 30.0); // ₹30 base fare for auto
        BASE_FARE.put("CAR", 50.0); // ₹50 base fare for car
    }
    
    /**
     * Calculate the total price for a ride based on distance and vehicle type
     * @param distance Distance in kilometers
     * @param vehicleType Type of vehicle (BIKE, AUTO, CAR)
     * @return Total price in rupees
     */
    public double calculatePrice(double distance, String vehicleType) {
        if (distance <= 0 || vehicleType == null) {
            return 0.0;
        }
        
        Double pricePerKm = PRICING_PER_KM.get(vehicleType.toUpperCase());
        Double baseFare = BASE_FARE.get(vehicleType.toUpperCase());
        
        if (pricePerKm == null || baseFare == null) {
            return 0.0;
        }
        
        // Calculate: Base fare + (Distance × Price per km)
        double totalPrice = baseFare + (distance * pricePerKm);
        
        // Round to 2 decimal places
        return Math.round(totalPrice * 100.0) / 100.0;
    }
    
    /**
     * Get pricing information for all vehicle types
     * @return Map with vehicle types and their pricing details
     */
    public Map<String, Object> getPricingInfo() {
        Map<String, Object> pricingInfo = new HashMap<>();
        
        for (String vehicleType : PRICING_PER_KM.keySet()) {
            Map<String, Object> vehicleInfo = new HashMap<>();
            vehicleInfo.put("pricePerKm", PRICING_PER_KM.get(vehicleType));
            vehicleInfo.put("baseFare", BASE_FARE.get(vehicleType));
            vehicleInfo.put("description", getVehicleDescription(vehicleType));
            pricingInfo.put(vehicleType, vehicleInfo);
        }
        
        return pricingInfo;
    }
    
    private String getVehicleDescription(String vehicleType) {
        switch (vehicleType.toUpperCase()) {
            case "BIKE":
                return "Bike Taxi - Fast and economical";
            case "SCOOTER":
                return "Scooter - Comfortable and stylish";
            case "MOTORCYCLE":
                return "Motorcycle - Powerful and fast";
            case "ELECTRIC_BIKE":
                return "Electric Bike - Eco-friendly and quiet";
            case "ELECTRIC_SCOOTER":
                return "Electric Scooter - Green and efficient";
            case "AUTO":
                return "Auto Rickshaw - Comfortable and affordable";
            case "CAR":
                return "Car - Premium ride experience";
            default:
                return "Unknown vehicle type";
        }
    }
} 