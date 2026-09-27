// Government schemes data for the prototype
// Sample data - verify from official sources before applying

export const schemes = [
  {
    id: 1,
    name: "PMEGP",
    fullName: "Prime Minister's Employment Generation Programme",
    status: "Active",
    match: "High",
    eligibility: "Individuals above 18 years, no income limit for setting up new units",
    loanSupport: "Up to ₹50 lakh for manufacturing, ₹20 lakh for service sector",
    category: ["Manufacturing", "Service", "Retail"],
    agency: "Ministry of Micro, Small & Medium Enterprises (MSME)",
    source: "Official MSME Portal",
    verifiedDate: "2026-01-15",
    description: "A credit-linked subsidy scheme for setting up new micro-enterprises in rural and urban areas. The scheme aims to generate employment opportunities through self-employment ventures.",
    benefits: [
      "Credit linked subsidy of 15-35% of project cost",
      "No collateral required for loans up to ₹10 lakh",
      "Support for raw material procurement",
      "Marketing assistance provided"
    ],
    applicationProcess: "Apply through the PMEGP online portal or District Industries Centre (DIC)",
    documentsRequired: ["Aadhaar Card", "PAN Card", "Project Report", "Caste Certificate (if applicable)", "Address Proof"]
  },
  {
    id: 2,
    name: "MUDRA",
    fullName: "Micro Units Development & Refinance Agency",
    status: "Active",
    match: "High",
    eligibility: "Non-corporate, non-farm small/micro enterprises",
    loanSupport: "Up to ₹10 lakh (Shisho, Kishore, Tarun categories)",
    category: ["Retail", "Food", "Services", "Manufacturing"],
    agency: "MUDRA Ltd / Banks & MFIs",
    source: "Official MUDRA Portal",
    verifiedDate: "2026-01-10",
    description: "Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises. Classified into Shisho (up to ₹50,000), Kishore (₹50,001 to ₹5 lakh), and Tarun (₹5,00,001 to ₹10 lakh).",
    benefits: [
      "Collateral-free loans",
      "Low interest rates",
      "No processing fee for Shisho loans",
      "Flexible repayment options"
    ],
    applicationProcess: "Approach any bank, NBFC or MFI or apply through Udyam Registration portal",
    documentsRequired: ["Aadhaar Card", "PAN Card", "Business Proof", "Address Proof", "Photograph"]
  },
  {
    id: 3,
    name: "State MSME Scheme - Odisha",
    fullName: "Odisha MSME Development Policy",
    status: "Active",
    match: "Medium",
    eligibility: "MSME units registered in Odisha",
    loanSupport: "Varies based on project",
    category: ["Manufacturing", "Service", "Retail", "Food"],
    agency: "Dept. of MSME, Government of Odisha",
    source: "Odisha Govt. Portal",
    verifiedDate: "2025-12-20",
    description: "State-level scheme providing various incentives including capital investment subsidy, interest subsidy, and reimbursement of certification fees for MSME units in Odisha.",
    benefits: [
      "Capital investment subsidy up to 35%",
      "Interest subsidy on term loans",
      "Reimbursement of quality certification fees",
      "Power tariff subsidy for certain categories"
    ],
    applicationProcess: "Apply through District Industries Centre (DIC) or online portal",
    documentsRequired: ["Udyam Registration", "Project Report", "Land/Lease Documents", "Caste Certificate (if applicable)"]
  },
  {
    id: 4,
    name: "Startup India Seed Fund",
    fullName: "Startup India Seed Fund Scheme (SISFS)",
    status: "Active",
    match: "Medium",
    eligibility: "DPIIT recognized startups",
    loanSupport: "Up to ₹20 lakh for validation, up to ₹50 lakh for scale-up",
    category: ["Technology", "Service", "Manufacturing"],
    agency: "Department for Promotion of Industry and Internal Trade (DPIIT)",
    source: "Startup India Portal",
    verifiedDate: "2026-01-05",
    description: "Provides financial assistance for proof of concept, prototype development, product trials, market entry, and commercialization. Startups must be recognized by DPIIT.",
    benefits: [
      "Grant up to ₹20 lakh for proof of concept",
      "Investment up to ₹50 lakh for commercialization",
      "Support through incubators",
      "Mentorship and networking opportunities"
    ],
    applicationProcess: "Apply through recognized incubators listed on Startup India portal",
    documentsRequired: ["DPIIT Recognition Certificate", "Business Plan", "Incubator Recommendation", "PAN Card", "Aadhaar Card"]
  },
  {
    id: 5,
    name: "Stand-Up India",
    fullName: "Stand-Up India Scheme",
    status: "Active",
    match: "Low",
    eligibility: "SC/ST or women entrepreneurs above 18 years",
    loanSupport: "₹10 lakh to ₹1 crore",
    category: ["Manufacturing", "Service", "Trading"],
    agency: "Scheduled Commercial Banks",
    source: "Stand-Up India Portal",
    verifiedDate: "2026-01-08",
    description: "Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST or woman borrower per bank branch for setting up a greenfield enterprise in manufacturing, services, or trading sector.",
    benefits: [
      "Composite loan including term loan and working capital",
      "No collateral security required",
      "Support for training and skill development",
      "Handholding support available"
    ],
    applicationProcess: "Approach any scheduled commercial bank or apply through Stand-Up India portal",
    documentsRequired: ["Caste Certificate (SC/ST)", "Aadhaar Card", "PAN Card", "Project Report", "Proof of Business Address"]
  },
  {
    id: 6,
    name: "PM SVANidhi",
    fullName: "PM Street Vendor's AtmaNirbhar Nidhi",
    status: "Active",
    match: "Medium",
    eligibility: "Street vendors in urban areas",
    loanSupport: "Up to ₹50,000 (working capital loan)",
    category: ["Food", "Retail", "Services"],
    agency: "Ministry of Housing and Urban Affairs",
    source: "PM SVANidhi Portal",
    verifiedDate: "2026-01-12",
    description: "Provides affordable working capital loan to street vendors to resume their livelihoods impacted by COVID-19. Vendors can avail loan up to ₹50,000 with monthly cashback incentive for digital repayments.",
    benefits: [
      "Working capital loan up to ₹50,000",
      "7% per annum interest subsidy on timely repayment",
      "Cashback up to ₹100/month for digital transactions",
      "Higher loan limit on timely repayment"
    ],
    applicationProcess: "Apply through Common Service Centres (CSCs) or directly on the portal",
    documentsRequired: ["Vendor Certificate/ID", "Aadhaar Card", "Bank Account Details", "Photograph"]
  }
];

export const schemeDisclaimer = "Scheme information in this prototype is sample data. Verify current status and eligibility using the official government source before applying.";
