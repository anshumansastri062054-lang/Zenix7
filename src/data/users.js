// Mock user data for the prototype

export const demoUser = {
  id: "demo-user-001",
  name: "Rahul Sharma",
  email: "rahul@example.com",
  phone: "+91 98765 43210",
  avatar: null,
  createdAt: new Date().toISOString(),
  isDemo: true
};

export const defaultProfile = {
  age: 24,
  education: "Graduate",
  skills: ["cooking", "management"],
  experience: "beginner",
  investment: 500000,
  maxBudget: 700000,
  loanRequired: 200000,
  existingEMI: 0,
  riskPreference: "Medium",
  state: "Odisha",
  district: "Sambalpur",
  city: "Sambalpur",
  pinCode: "768001",
  preferredSectors: ["Food", "Retail"],
  businessFormat: "Home-based"
};

export const educationOptions = [
  "High School",
  "Higher Secondary",
  "Diploma",
  "Graduate",
  "Post Graduate",
  "Professional Degree",
  "Other"
];

export const experienceOptions = [
  { value: "beginner", label: "Beginner (No experience)" },
  { value: "some", label: "Some experience (1-2 years)" },
  { value: "intermediate", label: "Intermediate (3-5 years)" },
  { value: "experienced", label: "Experienced (5+ years)" }
];

export const riskOptions = [
  { value: "Low", label: "Low Risk", description: "Prefer safe, stable businesses" },
  { value: "Medium", label: "Medium Risk", description: "Balanced risk-reward" },
  { value: "High", label: "High Risk", description: "Willing to take calculated risks" }
];

export const sectorOptions = [
  "Food",
  "Retail",
  "Services",
  "Agriculture",
  "Manufacturing",
  "Education",
  "Repair",
  "Other"
];

export const businessFormatOptions = [
  "Home-based",
  "Shop",
  "Commercial",
  "Mobile/service based"
];
