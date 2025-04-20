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
}

export interface ProductRecommendation {
  name: string;
  type: string;
  description: string;
  usage: string;
  purchaseLink?: string;
  price?: string;
}

export interface Prescription {
  medication: string;
  dosage: string;
  duration: string;
  precautions: string[];
  alternatives?: string[];
  recommendedProducts: ProductRecommendation[];
}

export type Step = 'capture' | 'processing' | 'result' | 'prescription';

export interface AppState {
  currentStep: Step;
  image: string | null;
  result: DetectionResult | null;
  prescription: Prescription | null;
  error: string | null;
  isLoading: boolean;
  setStep: (step: Step) => void;
  setImage: (image: string | null) => void;
  setResult: (result: DetectionResult | null) => void;
  setPrescription: (prescription: Prescription | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}