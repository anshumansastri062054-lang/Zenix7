// Location data for the prototype
// This can later be replaced with real API data (e.g., from OpenStreetMap/Overpass API)

export const states = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const districtsByState = {
  "Odisha": ["Sambalpur", "Cuttack", "Bhubaneswar", "Rourkela", "Puri", "Balasore"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Kolhapur"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida", "Prayagraj"],
  "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Nainital"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur"],
  "Telangana": ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad"]
};

export const locationCoordinates = {
  "Sambalpur": { lat: 21.4669, lng: 83.9812 },
  "Cuttack": { lat: 20.4625, lng: 85.8830 },
  "Bhubaneswar": { lat: 20.2961, lng: 85.8245 },
  "Rourkela": { lat: 22.2604, lng: 84.8536 },
  "Puri": { lat: 19.8135, lng: 85.8312 },
  "Balasore": { lat: 21.4949, lng: 86.9340 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Nagpur": { lat: 21.1458, lng: 79.0882 },
  "Nashik": { lat: 19.9975, lng: 73.7898 },
  "Bengaluru": { lat: 12.9716, lng: 77.5946 },
  "Mysuru": { lat: 12.2958, lng: 76.6394 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Coimbatore": { lat: 11.0168, lng: 76.9558 },
  "Lucknow": { lat: 26.8467, lng: 80.9462 },
  "Kanpur": { lat: 26.4499, lng: 80.3319 },
  "New Delhi": { lat: 28.6139, lng: 77.2090 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Surat": { lat: 21.1702, lng: 72.8311 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Patna": { lat: 25.6093, lng: 85.1376 },
  "Bhopal": { lat: 23.2599, lng: 77.4126 },
  "Kochi": { lat: 9.9312, lng: 76.2673 },
  "Ludhiana": { lat: 30.9010, lng: 75.8573 },
  "Guwahati": { lat: 26.1445, lng: 91.7362 },
  "Ranchi": { lat: 23.3441, lng: 85.3096 },
  "Raipur": { lat: 21.2514, lng: 81.6296 },
  "Dehradun": { lat: 30.3165, lng: 78.0322 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
  "Default": { lat: 21.4669, lng: 83.9812 } // Sambalpur default
};

export function getCoordinates(city, district) {
  if (city && locationCoordinates[city]) return locationCoordinates[city];
  if (district && locationCoordinates[district]) return locationCoordinates[district];
  return locationCoordinates["Default"];
}
