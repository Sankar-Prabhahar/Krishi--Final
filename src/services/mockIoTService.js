/**
 * Mock IoT Service for Disease Detection
 * Simulates camera/sensor data for crop disease detection
 */

// Disease database with treatment information
const DISEASE_DATABASE = {
  early_blight: {
    name: "Early Blight",
    scientificName: "Alternaria solani",
    affectedCrops: ["Tomato", "Potato", "Pepper"],
    symptoms: "Dark brown spots with concentric rings on lower leaves",
    severity: "Medium",
    spreadRisk: "High",
    treatments: {
      organic: [
        {
          name: "Neem Oil Spray",
          dosage: "5ml/L water",
          frequency: "Every 7 days",
        },
        {
          name: "Baking Soda Solution",
          dosage: "1 tbsp/L water",
          frequency: "Every 5 days",
        },
      ],
      chemical: [
        {
          name: "Mancozeb 75% WP",
          dosage: "2.5g/L water",
          frequency: "Every 10-14 days",
        },
        {
          name: "Chlorothalonil",
          dosage: "2g/L water",
          frequency: "Every 7-10 days",
        },
      ],
      costEstimate: { organic: 150, chemical: 350 },
    },
    preventionTips: [
      "Remove infected leaves immediately",
      "Avoid overhead watering",
      "Maintain proper plant spacing",
      "Apply mulch to prevent soil splash",
    ],
  },
  late_blight: {
    name: "Late Blight",
    scientificName: "Phytophthora infestans",
    affectedCrops: ["Tomato", "Potato"],
    symptoms: "Water-soaked lesions, white mold on underside of leaves",
    severity: "High",
    spreadRisk: "Very High",
    treatments: {
      organic: [
        {
          name: "Copper Fungicide",
          dosage: "3g/L water",
          frequency: "Every 5-7 days",
        },
        { name: "Bordeaux Mixture", dosage: "1%", frequency: "Every 7 days" },
      ],
      chemical: [
        {
          name: "Metalaxyl + Mancozeb",
          dosage: "2.5g/L water",
          frequency: "Every 7 days",
        },
        {
          name: "Cymoxanil + Mancozeb",
          dosage: "3g/L water",
          frequency: "Every 7 days",
        },
      ],
      costEstimate: { organic: 200, chemical: 500 },
    },
    preventionTips: [
      "Use certified disease-free seeds",
      "Destroy crop residues after harvest",
      "Avoid planting near previous infected fields",
      "Monitor weather - spreads rapidly in humid conditions",
    ],
  },
  powdery_mildew: {
    name: "Powdery Mildew",
    scientificName: "Erysiphe cichoracearum",
    affectedCrops: ["Tomato", "Cucumber", "Squash", "Okra"],
    symptoms: "White powdery coating on leaves and stems",
    severity: "Low",
    spreadRisk: "Medium",
    treatments: {
      organic: [
        {
          name: "Milk Spray",
          dosage: "40% milk solution",
          frequency: "Every 3-4 days",
        },
        {
          name: "Potassium Bicarbonate",
          dosage: "3g/L water",
          frequency: "Every 7 days",
        },
      ],
      chemical: [
        {
          name: "Sulphur 80% WP",
          dosage: "2g/L water",
          frequency: "Every 10-14 days",
        },
        {
          name: "Hexaconazole",
          dosage: "1ml/L water",
          frequency: "Every 15 days",
        },
      ],
      costEstimate: { organic: 100, chemical: 250 },
    },
    preventionTips: [
      "Ensure good air circulation",
      "Avoid excessive nitrogen fertilization",
      "Water at soil level, not on leaves",
      "Remove infected plant parts",
    ],
  },
  bacterial_wilt: {
    name: "Bacterial Wilt",
    scientificName: "Ralstonia solanacearum",
    affectedCrops: ["Tomato", "Potato", "Brinjal", "Pepper"],
    symptoms: "Sudden wilting of plants, brown vascular tissue",
    severity: "High",
    spreadRisk: "High",
    treatments: {
      organic: [
        {
          name: "Bio-fumigation",
          dosage: "Incorporate mustard crop residue",
          frequency: "Before planting",
        },
        {
          name: "Trichoderma",
          dosage: "5g/L water",
          frequency: "Soil drench every 15 days",
        },
      ],
      chemical: [
        {
          name: "Copper Hydroxide",
          dosage: "2g/L water",
          frequency: "Soil drench weekly",
        },
        {
          name: "Streptocycline",
          dosage: "0.5g/L water",
          frequency: "Every 7-10 days",
        },
      ],
      costEstimate: { organic: 180, chemical: 400 },
    },
    preventionTips: [
      "Use resistant varieties",
      "Practice crop rotation (3-4 years)",
      "Avoid waterlogging",
      "Remove and destroy infected plants",
    ],
  },
  healthy: {
    name: "Healthy Plant",
    scientificName: "N/A",
    symptoms: "No disease symptoms detected",
    severity: "None",
    spreadRisk: "None",
    treatments: null,
    preventionTips: [
      "Continue regular monitoring",
      "Maintain proper nutrition",
      "Follow integrated pest management",
      "Keep farm clean and weed-free",
    ],
  },
};

// Simulated scan history
let scanHistory = [];

/**
 * Simulate IoT camera scan
 * Returns detected disease with confidence score
 */
export const simulateCameraScan = () => {
  // Randomly select a disease (weighted towards healthy)
  const diseases = [
    "healthy",
    "healthy",
    "healthy",
    "early_blight",
    "late_blight",
    "powdery_mildew",
    "bacterial_wilt",
  ];
  const detectedKey = diseases[Math.floor(Math.random() * diseases.length)];
  const disease = DISEASE_DATABASE[detectedKey];

  // Generate confidence score (higher for healthy)
  const confidence =
    detectedKey === "healthy"
      ? 85 + Math.random() * 15
      : 70 + Math.random() * 25;

  // Create scan result
  const scanResult = {
    id: Date.now(),
    timestamp: new Date(),
    diseaseKey: detectedKey,
    disease: disease,
    confidence: Math.round(confidence),
    affectedArea:
      detectedKey === "healthy" ? 0 : Math.round(5 + Math.random() * 30),
    sensorData: {
      leafHealthIndex: Math.round(
        detectedKey === "healthy"
          ? 85 + Math.random() * 15
          : 40 + Math.random() * 40
      ),
      chlorophyllLevel: Math.round(
        detectedKey === "healthy"
          ? 80 + Math.random() * 20
          : 30 + Math.random() * 50
      ),
      moistureLevel: Math.round(40 + Math.random() * 40),
      temperature: Math.round(25 + Math.random() * 10),
    },
  };

  // Add to history
  scanHistory.unshift(scanResult);
  if (scanHistory.length > 10) scanHistory.pop();

  return scanResult;
};

/**
 * Get disease information by key
 */
export const getDiseaseInfo = (diseaseKey) => {
  return DISEASE_DATABASE[diseaseKey] || null;
};

/**
 * Get scan history
 */
export const getScanHistory = () => {
  return [...scanHistory];
};

/**
 * Calculate treatment cost for farm area
 */
export const calculateTreatmentCost = (
  diseaseKey,
  farmAreaHectares,
  treatmentType = "organic"
) => {
  const disease = DISEASE_DATABASE[diseaseKey];
  if (!disease || !disease.treatments) return 0;

  const baseCost = disease.treatments.costEstimate[treatmentType] || 0;
  return Math.round(baseCost * farmAreaHectares * 2.5); // Cost per application
};

/**
 * Get all diseases for reference
 */
export const getAllDiseases = () => {
  return Object.entries(DISEASE_DATABASE)
    .filter(([key]) => key !== "healthy")
    .map(([key, value]) => ({
      key,
      ...value,
    }));
};

/**
 * Simulate auto-scan (runs every few seconds for demo)
 */
export const startAutoScan = (callback, intervalMs = 30000) => {
  // Initial scan
  const initialResult = simulateCameraScan();
  callback(initialResult);

  // Periodic scans
  const intervalId = setInterval(() => {
    const result = simulateCameraScan();
    callback(result);
  }, intervalMs);

  return () => clearInterval(intervalId);
};

export default {
  simulateCameraScan,
  getDiseaseInfo,
  getScanHistory,
  calculateTreatmentCost,
  getAllDiseases,
  startAutoScan,
};
