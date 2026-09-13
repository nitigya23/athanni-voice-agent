# Maruti Bazzar - 120 Cars Inventory Knowledge Base
## For Vapi Voice Agent & Dealership Operations

---

### How to Add this to your Vapi Voice Agent:
1. Open [dashboard.vapi.ai/assistants](https://dashboard.vapi.ai/assistants) and click your assistant (`4979a054-806c-45d1-bf84-e83f8a58d61e`).
2. In the **Model / System Prompt** or **Files / Knowledge Base** tab, copy and paste this inventory guide.
3. When customers ask:
   * *"Do you have Swift ZXi+ in stock?"*
   * *"What is the price of Brezza CNG?"*
   * *"Is Grand Vitara Hybrid available for test drive?"*
   * *"What is the mileage of Fronx turbo?"*
   The assistant will immediately check this live inventory, confirm availability, provide manufacturing dates and specs, and offer to book a test drive!

---

## 1. Quick Model Availability & Price Matrix

| Model | Variants in Stock | Fuel Options | ARAI Mileage | Ex-Showroom Price Range | Manufacturing Years |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Swift** | LXi, VXi, ZXi, ZXi+ | Petrol, CNG | 22.38 - 30.90 km/l | ₹6.49 L - ₹8.95 L | 2021, 2022, 2023, 2024 |
| **Baleno** | Sigma, Delta, Zeta, Alpha | Petrol, CNG | 22.35 - 30.61 km/l | ₹6.66 L - ₹9.88 L | 2021, 2022, 2023, 2024 |
| **Brezza** | LXi, VXi, ZXi, ZXi+ | Petrol, CNG | 17.38 - 25.51 km/l | ₹8.34 L - ₹14.14 L | 2022, 2023, 2024 |
| **Grand Vitara** | Sigma, Delta, Zeta, Alpha, Strong Hybrid | Smart Hybrid, Strong Hybrid, CNG | 21.11 - 27.97 km/l | ₹10.80 L - ₹19.95 L | 2022, 2023, 2024 |
| **Fronx** | Sigma, Delta, Delta+, Zeta Turbo, Alpha Turbo | Petrol, CNG, BoosterJet Turbo | 20.01 - 28.51 km/l | ₹7.51 L - ₹13.04 L | 2023, 2024 |
| **Dzire** | LXi, VXi, ZXi, ZXi+ | Petrol, CNG | 22.61 - 31.12 km/l | ₹6.57 L - ₹9.39 L | 2021, 2022, 2023, 2024 |
| **Ertiga** | LXi, VXi, ZXi, ZXi+, VXi CNG | Petrol, CNG | 20.51 - 26.11 km/l | ₹8.69 L - ₹13.13 L | 2021, 2022, 2023, 2024 |
| **Jimny** | Zeta AllGrip, Alpha AllGrip 4x4 | Petrol (K15B) | 16.94 km/l | ₹12.74 L - ₹14.95 L | 2023, 2024 |
| **XL6** | Zeta, Alpha, Alpha+ | Smart Hybrid, CNG | 20.97 - 26.32 km/l | ₹11.61 L - ₹14.77 L | 2022, 2023, 2024 |
| **WagonR** | LXi, VXi, ZXi, ZXi+ | Petrol, CNG | 24.35 - 34.05 km/l | ₹5.54 L - ₹7.42 L | 2021, 2022, 2023, 2024 |
| **Alto K10** | Std, LXi, VXi, VXi+ | Petrol, CNG | 24.90 - 33.85 km/l | ₹3.99 L - ₹5.96 L | 2022, 2023, 2024 |
| **Ciaz** | Sigma, Delta, Zeta, Alpha | Smart Hybrid | 20.65 km/l | ₹9.40 L - ₹12.45 L | 2021, 2022, 2023, 2024 |

---

## 2. Voice Agent Answering Rules:

1. **Check Inventory First:**
   * When caller asks about any Maruti car, confirm: *"Haanji, Maruti Bazzar ke stock mein yeh gaadi available hai."*
   * Mention the variant, color, and ARAI mileage.
2. **Manufacturing Date & Year Details:**
   * When asked about manufacturing year, share the model year (e.g. 2023 / 2024 fresh stock with manufacturer warranty).
3. **Offer Test Drive Booking:**
   * Always ask: *"Kya aap iska test drive book karna chahenge? Hamare showroom par ya aapke ghar par slot schedule ho sakta hai."*
4. **Log the Booking:**
   * Note caller's name, preferred day/time, and preferred model.
