export interface SkinCondition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  commonAreas: string[];
}

export interface DetectionResult {
  disease: string;
  confidence: number;
  description: string;
  additionalConditions?: Array<{
    name: string;
    confidence: number;
    description: string;
  }>;
}

export interface Product {
  name: string;
  type: string;
  description: string;
  usage: string;
  purchaseLink: string;
  price: string;
  brand: string;
  keyIngredients: string[];
  suitableFor: string[];
  rating: number;
  reviews: number;
  size: string;
  countryOfOrigin: string;
  alternativeProducts?: Product[];
}

export interface Prescription {
  medication: string;
  dosage: string;
  duration: string;
  precautions: string[];
  alternatives: string[];
  recommendedProducts: Product[];
  otcProducts: Product[];
  naturalRemedies: Product[];
  preventiveCareProducts: Product[];
}