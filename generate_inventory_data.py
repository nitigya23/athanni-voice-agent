import json
import random

models_specs = [
    {
        "model": "Swift",
        "variants": ["LXi", "VXi", "ZXi", "ZXi+"],
        "fuels": ["Petrol", "CNG"],
        "transmissions": ["5-Speed Manual", "5-Speed AGS"],
        "mileages": {"Petrol": "22.38 km/l", "CNG": "30.90 km/kg"},
        "colors": ["Pearl Arctic White", "Magma Grey", "Luster Blue", "Splendid Silver", "Sizzling Red"],
        "base_price": 6.49,
    },
    {
        "model": "Baleno",
        "variants": ["Sigma", "Delta", "Zeta", "Alpha"],
        "fuels": ["Petrol", "CNG"],
        "transmissions": ["5-Speed Manual", "5-Speed AGS"],
        "mileages": {"Petrol": "22.35 km/l", "CNG": "30.61 km/kg"},
        "colors": ["Nexa Blue", "Pearl Arctic White", "Grandeur Grey", "Opulent Red", "Luxe Beige"],
        "base_price": 6.66,
    },
    {
        "model": "Brezza",
        "variants": ["LXi", "VXi", "ZXi", "ZXi+"],
        "fuels": ["Petrol", "CNG"],
        "transmissions": ["5-Speed Manual", "6-Speed Automatic"],
        "mileages": {"Petrol": "17.38 km/l", "CNG": "25.51 km/kg"},
        "colors": ["Sizzling Red", "Brave Khaki", "Pearl Arctic White", "Magma Grey", "Splendid Silver"],
        "base_price": 8.34,
    },
    {
        "model": "Grand Vitara",
        "variants": ["Sigma", "Delta", "Zeta", "Alpha", "Alpha+ Strong Hybrid"],
        "fuels": ["Smart Hybrid", "Strong Hybrid", "CNG"],
        "transmissions": ["5-Speed Manual", "6-Speed Automatic", "e-CVT"],
        "mileages": {"Smart Hybrid": "21.11 km/l", "Strong Hybrid": "27.97 km/l", "CNG": "26.60 km/kg"},
        "colors": ["Nexa Blue", "Grandeur Grey", "Opulent Red", "Chestnut Brown", "Arctic White"],
        "base_price": 10.80,
    },
    {
        "model": "Fronx",
        "variants": ["Sigma", "Delta", "Delta+", "Zeta Turbo", "Alpha Turbo"],
        "fuels": ["Petrol", "CNG", "Turbo Petrol"],
        "transmissions": ["5-Speed Manual", "6-Speed Automatic", "5-Speed AGS"],
        "mileages": {"Petrol": "21.79 km/l", "CNG": "28.51 km/kg", "Turbo Petrol": "20.01 km/l"},
        "colors": ["Lucent Orange", "Nexa Blue", "Grandeur Grey", "Arctic White", "Earthen Brown"],
        "base_price": 7.51,
    },
    {
        "model": "Dzire",
        "variants": ["LXi", "VXi", "ZXi", "ZXi+"],
        "fuels": ["Petrol", "CNG"],
        "transmissions": ["5-Speed Manual", "5-Speed AGS"],
        "mileages": {"Petrol": "22.61 km/l", "CNG": "31.12 km/kg"},
        "colors": ["Oxford Blue", "Sherwood Brown", "Magma Grey", "Arctic White", "Phoenix Red"],
        "base_price": 6.57,
    },
    {
        "model": "Ertiga",
        "variants": ["LXi", "VXi", "ZXi", "ZXi+"],
        "fuels": ["Petrol", "CNG"],
        "transmissions": ["5-Speed Manual", "6-Speed Automatic"],
        "mileages": {"Petrol": "20.51 km/l", "CNG": "26.11 km/kg"},
        "colors": ["Auburn Red", "Magma Grey", "Pearl Arctic White", "Splendid Silver", "Dignity Brown"],
        "base_price": 8.69,
    },
    {
        "model": "Jimny",
        "variants": ["Zeta AllGrip", "Alpha AllGrip"],
        "fuels": ["Petrol"],
        "transmissions": ["5-Speed Manual", "4-Speed Automatic"],
        "mileages": {"Petrol": "16.94 km/l"},
        "colors": ["Kinetic Yellow", "Bluish Black", "Sizzling Red", "Granite Grey", "Pearl Arctic White"],
        "base_price": 12.74,
    },
    {
        "model": "XL6",
        "variants": ["Zeta", "Alpha", "Alpha+"],
        "fuels": ["Smart Hybrid", "CNG"],
        "transmissions": ["5-Speed Manual", "6-Speed Automatic"],
        "mileages": {"Smart Hybrid": "20.97 km/l", "CNG": "26.32 km/kg"},
        "colors": ["Nexa Blue", "Brave Khaki", "Opulent Red", "Grandeur Grey", "Arctic White"],
        "base_price": 11.61,
    },
    {
        "model": "WagonR",
        "variants": ["LXi", "VXi", "ZXi", "ZXi+"],
        "fuels": ["Petrol", "CNG"],
        "transmissions": ["5-Speed Manual", "5-Speed AGS"],
        "mileages": {"Petrol": "24.35 km/l", "CNG": "34.05 km/kg"},
        "colors": ["Silky Silver", "Magma Grey", "Solid White", "Poolside Blue", "Gallant Red"],
        "base_price": 5.54,
    },
    {
        "model": "Alto K10",
        "variants": ["Std", "LXi", "VXi", "VXi+"],
        "fuels": ["Petrol", "CNG"],
        "transmissions": ["5-Speed Manual", "5-Speed AGS"],
        "mileages": {"Petrol": "24.90 km/l", "CNG": "33.85 km/kg"},
        "colors": ["Metallic Sizzling Red", "Metallic Silky Silver", "Solid White", "Metallic Granite Grey"],
        "base_price": 3.99,
    },
    {
        "model": "Ciaz",
        "variants": ["Sigma", "Delta", "Zeta", "Alpha"],
        "fuels": ["Smart Hybrid"],
        "transmissions": ["5-Speed Manual", "4-Speed Automatic"],
        "mileages": {"Smart Hybrid": "20.65 km/l"},
        "colors": ["Nexa Blue", "Pearl Sangria Red", "Magma Grey", "Pearl Snow White", "Dignity Brown"],
        "base_price": 9.40,
    }
]

customer_names = [
    "Rahul Sharma", "Pooja Verma", "Vikram Malhotra", "Ananya Iyer", "Amit Patel",
    "Sneha Reddy", "Rajesh Gupta", "Deepak Nair", "Kavita Rao", "Manish Joshi",
    "Sanjay Singhania", "Neha Kapoor", "Rohit Deshmukh", "Sunita Agarwal", "Karan Mehra",
    "Alok Tiwari", "Priyanka Sen", "Ramesh Yadav", "Meera Pillai", "Arjun Bhatia"
]

slots = [
    "14 Sep, 10:30 AM", "14 Sep, 02:00 PM", "15 Sep, 11:00 AM", "15 Sep, 04:30 PM",
    "16 Sep, 10:00 AM", "16 Sep, 03:00 PM", "17 Sep, 11:30 AM", "17 Sep, 05:00 PM"
]

random.seed(42)

cars = []
car_count = 120

for i in range(1, car_count + 1):
    spec = random.choice(models_specs)
    model = spec["model"]
    variant = random.choice(spec["variants"])
    fuel = random.choice(spec["fuels"])
    trans = random.choice(spec["transmissions"])
    mileage = spec["mileages"].get(fuel, list(spec["mileages"].values())[0])
    color = random.choice(spec["colors"])

    # Manufacturing Date between Jan 2021 and Aug 2024
    year = random.choice([2021, 2022, 2023, 2024])
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    mfg_date = f"{year}-{month:02d}-{day:02d}"

    # Price with variant multiplier
    variant_idx = spec["variants"].index(variant)
    fuel_extra = 0.95 if fuel == "CNG" else (1.8 if "Strong" in fuel else 0)
    price = round(spec["base_price"] + (variant_idx * 0.75) + fuel_extra + random.uniform(-0.15, 0.25), 2)

    # Test Drive Booked status (approx 35% booked)
    is_booked = (i % 3 == 0) or (i % 7 == 0)
    
    if is_booked:
        test_drive_status = "Yes"
        test_drive_slot = random.choice(slots)
        cust_name = random.choice(customer_names)
        cust_phone = f"+91 98{random.randint(10000000, 99999999)}"
        call_id = f"CALL-2026-09-{random.randint(100, 999)}"
        customer_call = {
            "hasBooking": True,
            "customerName": cust_name,
            "customerPhone": cust_phone,
            "callId": call_id,
            "bookingSlot": test_drive_slot,
            "callRecorded": True,
            "notes": f"Interested in {model} {variant} ({color}). Requested home delivery test drive."
        }
        stock_status = random.choice(["Booked for Drive", "In Stock (Demo Ready)", "Allocated"])
    else:
        test_drive_status = "No"
        test_drive_slot = "Available"
        customer_call = {
            "hasBooking": False,
            "customerName": "None",
            "customerPhone": "N/A",
            "callId": "None",
            "bookingSlot": "Available for Booking",
            "callRecorded": False,
            "notes": "No test drive currently scheduled for this unit."
        }
        stock_status = random.choice(["In Stock", "In Stock", "3 Units Left", "Ready for Delivery", "Display Unit"])

    cars.append({
        "id": f"MB-{i:03d}",
        "model": model,
        "variant": variant,
        "mfgDate": mfg_date,
        "mfgYear": year,
        "fuelType": fuel,
        "transmission": trans,
        "mileage": mileage,
        "color": color,
        "priceLakhs": price,
        "stockStatus": stock_status,
        "testDriveBooked": test_drive_status,
        "testDriveSlot": test_drive_slot,
        "customerCall": customer_call
    })

# Write to src/data/carsInventory.js
js_content = f"""// Complete 120-car Inventory Database for Maruti Bazaar
// Auto-referenced by Voice Agent and Admin Dashboard

export const CARS_INVENTORY = {json.dumps(cars, indent=2)};

export const INVENTORY_STATS = {{
  totalCars: {len(cars)},
  testDrivesBooked: {sum(1 for c in cars if c['testDriveBooked'] == 'Yes')},
  availableUnits: {sum(1 for c in cars if c['testDriveBooked'] == 'No')},
  modelsCount: {len(models_specs)}
}};

export function queryInventory({{ model, fuelType, maxBudget, transmission }}) {{
  return CARS_INVENTORY.filter((car) => {{
    if (model && !car.model.toLowerCase().includes(model.toLowerCase())) return false;
    if (fuelType && car.fuelType.toLowerCase() !== fuelType.toLowerCase()) return false;
    if (maxBudget && car.priceLakhs > parseFloat(maxBudget)) return false;
    if (transmission && !car.transmission.toLowerCase().includes(transmission.toLowerCase())) return false;
    return true;
  }});
}}
"""

with open("src/data/carsInventory.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Generated {len(cars)} cars in src/data/carsInventory.js successfully!")
