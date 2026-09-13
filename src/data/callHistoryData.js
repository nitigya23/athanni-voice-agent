// Call History & Recordings Database for Maruti Bazaar Admin Portal

export const INITIAL_CALL_HISTORY = [
  {
    callId: "CALL-2026-09-101",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98112 34567",
    timestamp: "12 Sep 2026, 04:15 PM",
    duration: "2m 45s",
    durationSeconds: 165,
    carRequested: "Grand Vitara Alpha+ Hybrid (Nexa Blue)",
    carId: "MB-004",
    testDriveBooked: "Yes",
    bookingSlot: "14 Sep 2026, 11:00 AM",
    recordingUrl: "https://actions.google.com/sounds/v1/ambiences/office_murmur.ogg",
    summary: "Customer inquired about Grand Vitara Strong Hybrid. Checked inventory and confirmed unit MB-004 available in Nexa Blue. Customer booked weekend test drive at their residence.",
    sentiment: "High Purchase Intent",
    transcript: [
      { role: "assistant", text: "Namaste! MARUTI BAZZAR mein aapka swagat hai, main Riya bol rahi hoon. BATAIYE MAI APKI Kaise madad kar sakti hoon?" },
      { role: "user", text: "Haan ji, mujhe Grand Vitara Strong Hybrid variant ke baare mein poochna tha, kya aapke paas stock mein hai?" },
      { role: "assistant", text: "Ji bilkul! Hamare inventory mein Grand Vitara Alpha Plus Strong Hybrid Nexa Blue color mein ready stock available hai, ARAI certified mileage lagbhag 28 km per litre hai." },
      { role: "user", text: "Acha bahut badhiya! Kya main iska test drive book kar sakta hoon?" },
      { role: "assistant", text: "Zaroor sir! Kya main aapka test drive Saturday, 14 September subah 11 baje schedule kar doon?" },
      { role: "user", text: "Haan, 11 baje theek rahega. Rahul Sharma mera naam hai." },
      { role: "assistant", text: "Dhanyawad Rahul ji! Grand Vitara Alpha Plus ka test drive 14 September subah 11:00 AM ke liye confirm kar diya gaya hai. Hamare representative aapse sampark karenge." }
    ]
  },
  {
    callId: "CALL-2026-09-102",
    customerName: "Pooja Verma",
    customerPhone: "+91 98765 43210",
    timestamp: "12 Sep 2026, 02:30 PM",
    duration: "1m 52s",
    durationSeconds: 112,
    carRequested: "Swift ZXi+ Petrol (Sizzling Red)",
    carId: "MB-001",
    testDriveBooked: "Yes",
    bookingSlot: "15 Sep 2026, 03:30 PM",
    recordingUrl: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg",
    summary: "Customer requested pricing and availability for Swift ZXi+ in red. Confirmed MB-001 in stock at ₹8.25 L. Booked test drive slot for Sunday afternoon.",
    sentiment: "Positive / Qualified",
    transcript: [
      { role: "assistant", text: "Namaste! MARUTI BAZZAR mein aapka swagat hai, main Riya bol rahi hoon. BATAIYE MAI APKI Kaise madad kar sakti hoon?" },
      { role: "user", text: "Hi, mujhe nayi Swift ZXi Plus red color mein chahiye, delivery time kya hoga?" },
      { role: "assistant", text: "Namaste ma'am! Maruti Swift ZXi Plus Sizzling Red color hamare dealership stock mein available hai, within 3 days delivery mil sakti hai." },
      { role: "user", text: "Great, kya test drive arrange ho sakti hai kal ya parson?" },
      { role: "assistant", text: "Ji ma'am, Sunday 15 September dopahar 3:30 PM ka slot available hai. Kya main confirm kar doon?" },
      { role: "user", text: "Yes please, book kar dijiye." },
      { role: "assistant", text: "Aapka test drive slot 15 September 3:30 PM ke liye book ho chuka hai. Maruti Bazzar call karne ke liye dhanyawad!" }
    ]
  },
  {
    callId: "CALL-2026-09-103",
    customerName: "Vikram Malhotra",
    customerPhone: "+91 98221 87654",
    timestamp: "12 Sep 2026, 01:10 PM",
    duration: "1m 15s",
    durationSeconds: 75,
    carRequested: "Brezza ZXi CNG",
    carId: "MB-012",
    testDriveBooked: "No",
    bookingSlot: "N/A - General Price Inquiry",
    recordingUrl: "https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg",
    summary: "Customer checked on-road price and waiting period for Brezza CNG. Provided quote. Customer will call back after discussing with family. No test drive scheduled.",
    sentiment: "Information Gathering",
    transcript: [
      { role: "assistant", text: "Namaste! MARUTI BAZZAR mein aapka swagat hai, main Riya bol rahi hoon. BATAIYE MAI APKI Kaise madad kar sakti hoon?" },
      { role: "user", text: "Brezza CNG ka on road price kitna padega aur discount kya chal raha hai?" },
      { role: "assistant", text: "Sir, Brezza ZXi CNG ka ex-showroom price ₹12.10 Lakh hai, aur on-road insurance aur RTO ke saath lagbhag ₹13.85 Lakh aayega. Current festive offer mein ₹25,000 exchange bonus bhi shamil hai." },
      { role: "user", text: "Theek hai, main family se discuss karke batata hoon." },
      { role: "assistant", text: "Ji bilkul sir. Jab bhi aap ready hon, Maruti Bazzar aapse judne ke liye hamesha tayyar hai. Shubh din!" }
    ]
  },
  {
    callId: "CALL-2026-09-104",
    customerName: "Sneha Reddy",
    customerPhone: "+91 97001 23456",
    timestamp: "11 Sep 2026, 05:40 PM",
    duration: "3m 05s",
    durationSeconds: 185,
    carRequested: "Fronx 1.0 Turbo Alpha (Arctic White)",
    carId: "MB-022",
    testDriveBooked: "Yes",
    bookingSlot: "16 Sep 2026, 10:30 AM",
    recordingUrl: "https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg",
    summary: "Inquired about Fronx BoosterJet Turbo acceleration and safety features. Confirmed 6 airbags and 360 camera. Booked showroom test drive.",
    sentiment: "High Purchase Intent",
    transcript: [
      { role: "assistant", text: "Namaste! MARUTI BAZZAR mein aapka swagat hai, main Riya bol rahi hoon. BATAIYE MAI APKI Kaise madad kar sakti hoon?" },
      { role: "user", text: "Hello Riya, Fronx turbo engine ka performance kaisa hai aur test drive available hai kya?" },
      { role: "assistant", text: "Namaste Sneha ji! Fronx 1.0 Boosterjet Turbo 100 horsepower generate karta hai paddle shifters ke saath. Hamare showroom par Alpha Turbo test drive vehicle ready hai." },
      { role: "user", text: "Great, Tuesday subah 10:30 ka slot book kar do." },
      { role: "assistant", text: "16 September subah 10:30 baje aapka test drive schedule ho chuka hai. Maruti Bazzar mein aapka swagat hai!" }
    ]
  },
  {
    callId: "CALL-2026-09-105",
    customerName: "Amit Patel",
    customerPhone: "+91 99099 11223",
    timestamp: "11 Sep 2026, 11:20 AM",
    duration: "1m 30s",
    durationSeconds: 90,
    carRequested: "Ertiga VXi CNG (Magma Grey)",
    carId: "MB-018",
    testDriveBooked: "No",
    bookingSlot: "N/A - Waiting Period Inquiry",
    recordingUrl: "https://actions.google.com/sounds/v1/ambiences/office_murmur.ogg",
    summary: "Customer asked if Ertiga CNG is ready in stock. Informed that current delivery timeline is 2 to 3 weeks. Customer did not book test drive yet.",
    sentiment: "Neutral",
    transcript: [
      { role: "assistant", text: "Namaste! MARUTI BAZZAR mein aapka swagat hai, main Riya bol rahi hoon. BATAIYE MAI APKI Kaise madad kar sakti hoon?" },
      { role: "user", text: "Ertiga CNG lene ka plan hai, kya immediate delivery mil sakti hai?" },
      { role: "assistant", text: "Sir, Ertiga VXi CNG par lagbhag 2 se 3 hafte ka transit period hai. Hum aapka priority allotment book kar sakte hain." },
      { role: "user", text: "Mujhe urgently chahiye thi, main thoda soch kar batata hoon." },
      { role: "assistant", text: "Samajh sakti hoon sir. Jaise hi stock update hoga hum aapko inform karenge. Dhanyawad!" }
    ]
  },
  {
    callId: "CALL-2026-09-106",
    customerName: "Karan Mehra",
    customerPhone: "+91 98450 99887",
    timestamp: "10 Sep 2026, 06:15 PM",
    duration: "2m 10s",
    durationSeconds: 130,
    carRequested: "Jimny Alpha AllGrip (Kinetic Yellow)",
    carId: "MB-035",
    testDriveBooked: "Yes",
    bookingSlot: "17 Sep 2026, 04:00 PM",
    recordingUrl: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg",
    summary: "Customer interested in Jimny 4x4 offroad test drive. Confirmed kinetic yellow Alpha model is available. Scheduled offroad track session.",
    sentiment: "Enthusiastic Buyer",
    transcript: [
      { role: "assistant", text: "Namaste! MARUTI BAZZAR mein aapka swagat hai, main Riya bol rahi hoon. BATAIYE MAI APKI Kaise madad kar sakti hoon?" },
      { role: "user", text: "Kya Jimny ka AllGrip 4x4 test drive mil sakta hai offroad track par?" },
      { role: "assistant", text: "Ji bilkul sir! Hamare special test track par Jimny Alpha AllGrip ready hai. Kinetic Yellow dual tone color mein vehicle available hai." },
      { role: "user", text: "Awesome! Thursday shaam 4 baje ka schedule kar dijiye." },
      { role: "assistant", text: "Thursday 17 September 4:00 PM ke liye aapka Jimny 4x4 test drive confirm hai. Dhanyawad Karan ji!" }
    ]
  }
];
