import * as tf from '@tensorflow/tfjs';
import { SkinCondition, DetectionResult, Prescription } from '../types';

// Predefined skin conditions for the model
const skinConditions: SkinCondition[] = [
  {
    id: 'melanoma',
    name: 'Melanoma',
    description: 'A serious form of skin cancer that begins in melanocytes (pigment-producing cells).',
    symptoms: ['Asymmetrical moles', 'Border irregularity', 'Color variations', 'Diameter > 6mm', 'Evolving size/shape'],
    commonAreas: ['Back', 'Legs', 'Arms', 'Face']
  },
  {
    id: 'vitiligo',
    name: 'Vitiligo',
    description: 'An autoimmune condition causing loss of skin pigmentation in patches.',
    symptoms: ['White patches on skin', 'Premature graying', 'Loss of color inside mouth', 'Loss of color in hair'],
    commonAreas: ['Face', 'Hands', 'Arms', 'Genitals']
  },
  {
    id: 'melasma',
    name: 'Melasma',
    description: 'A condition causing brown to gray-brown patches on the face.',
    symptoms: ['Dark patches', 'Symmetrical patches', 'Increased pigmentation', 'Sun sensitivity'],
    commonAreas: ['Cheeks', 'Bridge of nose', 'Forehead', 'Upper lip']
  },
  {
    id: 'impetigo',
    name: 'Impetigo',
    description: 'A highly contagious bacterial skin infection common in children.',
    symptoms: ['Red sores', 'Honey-colored crusts', 'Itching', 'Fluid-filled blisters'],
    commonAreas: ['Face', 'Arms', 'Legs']
  },
  {
    id: 'acne_vulgaris',
    name: 'Acne Vulgaris',
    description: 'Inflammatory condition characterized by pimples, particularly on the face.',
    symptoms: ['Pimples', 'Blackheads', 'Whiteheads', 'Inflammation'],
    commonAreas: ['Face', 'Chest', 'Back']
  },
  {
    id: 'eczema',
    name: 'Eczema',
    description: 'Chronic condition causing dry, itchy, and inflamed skin.',
    symptoms: ['Itching', 'Dry skin', 'Redness', 'Inflammation'],
    commonAreas: ['Arms', 'Knees', 'Neck']
  },
  {
    id: 'rosacea',
    name: 'Rosacea',
    description: 'Chronic condition causing redness and visible blood vessels in face.',
    symptoms: ['Facial redness', 'Visible blood vessels', 'Bumps', 'Skin sensitivity'],
    commonAreas: ['Cheeks', 'Nose', 'Chin']
  },
  {
    id: 'seborrheic_dermatitis',
    name: 'Seborrheic Dermatitis',
    description: 'Condition causing scaly patches and red skin.',
    symptoms: ['Scaly patches', 'Redness', 'Itching', 'Flaking'],
    commonAreas: ['Scalp', 'Face', 'Upper body']
  },
  {
    id: 'contact_dermatitis',
    name: 'Contact Dermatitis',
    description: 'Skin inflammation caused by direct contact with an irritant or allergen.',
    symptoms: ['Redness', 'Itching', 'Burning', 'Skin rash'],
    commonAreas: ['Hands', 'Face', 'Neck']
  },
  {
    id: 'psoriasis',
    name: 'Psoriasis',
    description: 'Chronic autoimmune condition causing rapid skin cell buildup.',
    symptoms: ['Thick red patches', 'Silver scales', 'Dry skin', 'Itching'],
    commonAreas: ['Elbows', 'Knees', 'Scalp']
  },
  {
    id: 'fungal_infection',
    name: 'Fungal Infection',
    description: 'Skin infection caused by various types of fungi.',
    symptoms: ['Itching', 'Redness', 'Scaling', 'Ring-like pattern'],
    commonAreas: ['Feet', 'Groin', 'Scalp']
  },
  {
    id: 'urticaria',
    name: 'Urticaria (Hives)',
    description: 'Raised, itchy welts that appear suddenly on the skin.',
    symptoms: ['Raised welts', 'Intense itching', 'Swelling', 'Redness'],
    commonAreas: ['Any part of body']
  },
  {
    id: 'folliculitis',
    name: 'Folliculitis',
    description: 'Inflammation of hair follicles due to bacterial or fungal infection.',
    symptoms: ['Small red bumps', 'Itching', 'Tenderness', 'Pus-filled blisters'],
    commonAreas: ['Scalp', 'Beard area', 'Arms', 'Legs']
  },
  {
    id: 'hyperpigmentation',
    name: 'Hyperpigmentation',
    description: 'Darkening of areas of skin due to increased melanin production.',
    symptoms: ['Dark patches', 'Uneven skin tone', 'Sun spots', 'Age spots'],
    commonAreas: ['Face', 'Hands', 'Neck']
  }
];

// Prescription database
const prescriptionDatabase: Record<string, Prescription> = {
  melanoma: {
    medication: 'Refer to Oncologist',
    dosage: 'Professional medical evaluation required',
    duration: 'Immediate medical attention needed',
    precautions: [
      'Avoid sun exposure',
      'Use broad-spectrum sunscreen',
      'Regular skin checks',
      'Document any changes'
    ],
    alternatives: ['Surgery', 'Immunotherapy', 'Targeted therapy'],
    recommendedProducts: [
      {
        name: 'La Roche-Posay Anthelios Melt-In Sunscreen SPF 100',
        type: 'Sun Protection',
        description: 'High protection sunscreen specifically formulated for sensitive skin',
        usage: 'Apply generously 15 minutes before sun exposure, reapply every 2 hours',
        purchaseLink: 'https://www.laroche-posay.us',
        price: '$33.50'
      },
      {
        name: 'EltaMD UV Pure Broad-Spectrum SPF 47',
        type: 'Sun Protection',
        description: 'Mineral-based sunscreen suitable for sensitive skin',
        usage: 'Apply daily before sun exposure',
        purchaseLink: 'https://eltamd.com',
        price: '$27.00'
      }
    ]
  },
  vitiligo: {
    medication: 'Tacrolimus',
    dosage: '0.1% ointment',
    duration: 'Apply twice daily for 3-6 months',
    precautions: [
      'Use sun protection',
      'Monitor skin changes',
      'Avoid skin trauma',
      'Regular follow-up'
    ],
    alternatives: ['Topical corticosteroids', 'Phototherapy', 'Skin grafting'],
    recommendedProducts: [
      {
        name: 'Protopic Ointment',
        type: 'Topical Immunomodulator',
        description: 'Prescription ointment that helps repigment the skin',
        usage: 'Apply a thin layer to affected areas twice daily',
        purchaseLink: 'https://www.protopic.com',
        price: '$45.00'
      },
      {
        name: 'CeraVe Daily Moisturizing Lotion',
        type: 'Moisturizer',
        description: 'Gentle, non-irritating moisturizer with ceramides',
        usage: 'Apply to affected areas as needed',
        purchaseLink: 'https://www.cerave.com',
        price: '$15.99'
      }
    ]
  },
  melasma: {
    medication: 'Hydroquinone',
    dosage: '4% cream',
    duration: 'Apply once daily for 8-12 weeks',
    precautions: [
      'Strict sun protection',
      'Use only as directed',
      'Avoid irritants',
      'Stop if irritation occurs'
    ],
    alternatives: ['Kojic acid', 'Azelaic acid', 'Chemical peels'],
    recommendedProducts: [
      {
        name: 'SkinCeuticals Discoloration Defense',
        type: 'Skin Brightener',
        description: 'Multi-phase serum that reduces dark spots and discoloration',
        usage: 'Apply a few drops to affected areas once daily',
        purchaseLink: 'https://www.skinceuticals.com',
        price: '$98.00'
      },
      {
        name: 'Neutrogena Clear Face Sunscreen SPF 55',
        type: 'Sun Protection',
        description: 'Lightweight, oil-free sunscreen for daily use',
        usage: 'Apply liberally 15 minutes before sun exposure',
        purchaseLink: 'https://www.neutrogena.com',
        price: '$12.99'
      }
    ]
  },
  impetigo: {
    medication: 'Mupirocin',
    dosage: '2% topical ointment',
    duration: 'Apply 3 times daily for 7-10 days',
    precautions: [
      'Keep affected area clean',
      'Avoid scratching',
      'Wash hands frequently',
      'Complete full course of treatment'
    ],
    alternatives: ['Oral antibiotics', 'Antiseptic solutions'],
    recommendedProducts: [
      {
        name: 'Bactroban Ointment',
        type: 'Antibiotic Ointment',
        description: 'Prescription antibiotic ointment for treating impetigo',
        usage: 'Apply a thin layer to affected areas three times daily',
        purchaseLink: 'https://www.bactroban.com',
        price: '$30.00'
      },
      {
        name: 'Hibiclens Antiseptic Skin Cleanser',
        type: 'Antimicrobial Cleanser',
        description: 'Helps prevent spread of bacteria',
        usage: 'Use daily to clean affected areas',
        purchaseLink: 'https://www.hibiclens.com',
        price: '$12.99'
      }
    ]
  },
  acne_vulgaris: {
    medication: 'Benzoyl Peroxide',
    dosage: '2.5% topical gel',
    duration: 'Apply once daily for 8-12 weeks',
    precautions: [
      'Avoid sun exposure',
      'Use sunscreen daily',
      'Do not apply on broken skin'
    ],
    alternatives: ['Salicylic Acid', 'Adapalene'],
    recommendedProducts: [
      {
        name: 'La Roche-Posay Effaclar Duo',
        type: 'Acne Treatment',
        description: 'Dual action acne treatment with benzoyl peroxide',
        usage: 'Apply a thin layer once daily',
        purchaseLink: 'https://www.laroche-posay.us',
        price: '$29.99'
      },
      {
        name: 'CeraVe Acne Foaming Cream Cleanser',
        type: 'Facial Cleanser',
        description: 'Gentle cleanser with benzoyl peroxide',
        usage: 'Use twice daily, morning and night',
        purchaseLink: 'https://www.cerave.com',
        price: '$14.99'
      }
    ]
  },
  eczema: {
    medication: 'Hydrocortisone',
    dosage: '1% topical cream',
    duration: 'Apply twice daily for 1-2 weeks',
    precautions: [
      'Do not use on face',
      'Avoid long-term use',
      'Keep skin moisturized'
    ],
    alternatives: ['Tacrolimus', 'Moisturizing cream'],
    recommendedProducts: [
      {
        name: 'Eucerin Eczema Relief Cream',
        type: 'Moisturizing Treatment',
        description: 'Clinically proven to relieve eczema symptoms',
        usage: 'Apply to affected areas as needed',
        purchaseLink: 'https://www.eucerin.com',
        price: '$14.99'
      },
      {
        name: 'Aveeno Eczema Therapy Daily Moisturizing Cream',
        type: 'Daily Moisturizer',
        description: 'Colloidal oatmeal formula for eczema-prone skin',
        usage: 'Apply twice daily or as needed',
        purchaseLink: 'https://www.aveeno.com',
        price: '$18.99'
      }
    ]
  },
  rosacea: {
    medication: 'Metronidazole',
    dosage: '0.75% topical cream',
    duration: 'Apply twice daily for 12 weeks',
    precautions: [
      'Avoid triggers (spicy foods, alcohol)',
      'Use gentle skincare products',
      'Protect from sun'
    ],
    alternatives: ['Azelaic acid', 'Ivermectin'],
    recommendedProducts: [
      {
        name: 'Avène Antirougeurs Calm Soothing Repair Mask',
        type: 'Calming Treatment',
        description: 'Reduces redness and soothes irritated skin',
        usage: 'Apply as a mask 2-3 times per week',
        purchaseLink: 'https://www.avene.com',
        price: '$35.00'
      },
      {
        name: 'La Roche-Posay Rosaliac AR Intense',
        type: 'Anti-Redness Serum',
        description: 'Targets visible redness and helps prevent its reappearance',
        usage: 'Apply morning and evening to clean skin',
        purchaseLink: 'https://www.laroche-posay.us',
        price: '$39.99'
      }
    ]
  },
  seborrheic_dermatitis: {
    medication: 'Ketoconazole',
    dosage: '2% shampoo or cream',
    duration: 'Use twice weekly for 4 weeks',
    precautions: [
      'Keep affected area clean and dry',
      'Avoid harsh soaps',
      'Follow prescribed frequency'
    ],
    alternatives: ['Selenium sulfide', 'Zinc pyrithione'],
    recommendedProducts: [
      {
        name: 'Nizoral Anti-Dandruff Shampoo',
        type: 'Medicated Shampoo',
        description: 'Contains ketoconazole to treat scalp seborrheic dermatitis',
        usage: 'Use twice weekly, leave on scalp for 3-5 minutes',
        purchaseLink: 'https://www.nizoral.com',
        price: '$15.99'
      },
      {
        name: 'Head & Shoulders Clinical Strength Shampoo',
        type: 'Anti-Dandruff Shampoo',
        description: 'Selenium sulfide formula for severe dandruff and seborrheic dermatitis',
        usage: 'Use 2-3 times per week or as directed',
        purchaseLink: 'https://www.headandshoulders.com',
        price: '$19.99'
      }
    ]
  },
  contact_dermatitis: {
    medication: 'Triamcinolone',
    dosage: '0.1% topical cream',
    duration: 'Apply 2-3 times daily for 1-2 weeks',
    precautions: [
      'Identify and avoid triggers',
      'Keep skin clean and dry',
      'Stop use if irritation increases'
    ],
    alternatives: ['Calamine lotion', 'Cold compresses'],
    recommendedProducts: [
      {
        name: 'CeraVe Itch Relief Moisturizing Cream',
        type: 'Soothing Moisturizer',
        description: 'Provides immediate and long-lasting itch relief',
        usage: 'Apply to affected areas as needed',
        purchaseLink: 'https://www.cerave.com',
        price: '$16.99'
      },
      {
        name: 'Vanicream Moisturizing Cream',
        type: 'Gentle Moisturizer',
        description: 'Free of common chemical irritants, ideal for sensitive skin',
        usage: 'Apply liberally as often as needed',
        purchaseLink: 'https://www.vanicream.com',
        price: '$13.99'
      }
    ]
  },
  psoriasis: {
    medication: 'Calcipotriene',
    dosage: '0.005% topical cream',
    duration: 'Apply twice daily for 8 weeks',
    precautions: [
      'Avoid sudden stopping of treatment',
      'Regular sun protection',
      'Monitor skin changes'
    ],
    alternatives: ['Coal tar', 'Salicylic acid'],
    recommendedProducts: [
      {
        name: 'Dermarest Psoriasis Medicated Treatment Gel',
        type: 'Topical Treatment',
        description: 'Contains 3% salicylic acid to help remove scales',
        usage: 'Apply to affected areas 3 times daily',
        purchaseLink: 'https://www.dermarest.com',
        price: '$24.99'
      },
      {
        name: 'MG217 Psoriasis Coal Tar Ointment',
        type: 'Coal Tar Treatment',
        description: 'Helps slow skin cell growth and reduce inflammation',
        usage: 'Apply 1-4 times daily or as directed',
        purchaseLink: 'https://www.mg217.com',
        price: '$19.99'
      }
    ]
  },
  fungal_infection: {
    medication: 'Clotrimazole',
    dosage: '1% topical cream',
    duration: 'Apply twice daily for 2-4 weeks',
    precautions: [
      'Keep affected area dry',
      'Complete full course of treatment',
      'Avoid sharing personal items'
    ],
    alternatives: ['Miconazole', 'Terbinafine'],
    recommendedProducts: [
      {
        name: 'Lamisil AT Cream',
        type: 'Antifungal Treatment',
        description: 'Contains terbinafine for effective fungal treatment',
        usage: 'Apply to affected areas twice daily',
        purchaseLink: 'https://www.lamisil.com',
        price: '$17.99'
      },
      {
        name: 'Lotrimin Ultra Antifungal Cream',
        type: 'Antifungal Treatment',
        description: 'Fast-acting formula with butenafine hydrochloride',
        usage: 'Apply twice daily to affected areas',
        purchaseLink: 'https://www.lotrimin.com',
        price: '$15.99'
      }
    ]
  },
  urticaria: {
    medication: 'Cetirizine',
    dosage: '10mg oral tablet',
    duration: 'Take once daily as needed',
    precautions: [
      'Avoid known triggers',
      'Keep track of potential allergens',
      'Seek emergency care if breathing affected'
    ],
    alternatives: ['Fexofenadine', 'Loratadine'],
    recommendedProducts: [
      {
        name: 'Zyrtec 24 Hour Allergy Relief',
        type: 'Oral Antihistamine',
        description: 'Fast-acting allergy relief that lasts all day',
        usage: 'Take one tablet daily',
        purchaseLink: 'https://www.zyrtec.com',
        price: '$24.99'
      },
      {
        name: 'CeraVe Itch Relief Moisturizing Lotion',
        type: 'Soothing Lotion',
        description: 'Provides relief from hives and skin allergies',
        usage: 'Apply to affected areas as needed',
        purchaseLink: 'https://www.cerave.com',
        price: '$15.99'
      }
    ]
  },
  folliculitis: {
    medication: 'Mupirocin',
    dosage: '2% topical ointment',
    duration: 'Apply three times daily for 10 days',
    precautions: [
      'Keep area clean',
      'Avoid tight clothing',
      'Do not share personal items'
    ],
    alternatives: ['Chlorhexidine wash', 'Tea tree oil'],
    recommendedProducts: [
      {
        name: 'PanOxyl Acne Foaming Wash',
        type: 'Antimicrobial Cleanser',
        description: 'Contains 10% benzoyl peroxide to fight bacteria',
        usage: 'Use once or twice daily in shower',
        purchaseLink: 'https://www.panoxyl.com',
        price: '$11.99'
      },
      {
        name: 'The Body Shop Tea Tree Oil',
        type: 'Natural Treatment',
        description: 'Pure tea tree oil for natural antimicrobial treatment',
        usage: 'Apply diluted to affected areas twice daily',
        purchaseLink: 'https://www.thebodyshop.com',
        price: '$14.00'
      }
    ]
  },
  hyperpigmentation: {
    medication: 'Hydroquinone',
    dosage: '2% topical cream',
    duration: 'Apply twice daily for 8-12 weeks',
    precautions: [
      'Always use sunscreen',
      'Avoid sun exposure',
      'Discontinue if irritation occurs'
    ],
    alternatives: ['Kojic acid', 'Vitamin C serum'],
    recommendedProducts: [
      {
        name: 'The Ordinary Alpha Arbutin 2% + HA',
        type: 'Brightening Treatment',
        description: 'Reduces appearance of dark spots and hyperpigmentation',
        usage: 'Apply a few drops twice daily',
        purchaseLink: 'https://theordinary.com',
        price: '$8.90'
      },
      {
        name: 'SkinCeuticals C E Ferulic',
        type: 'Antioxidant Serum',
        description: 'Vitamin C serum that helps improve uneven skin tone',
        usage: 'Apply 4-5 drops every morning',
        purchaseLink: 'https://www.skinceuticals.com',
        price: '$166.00'
      }
    ]
  }
};

let model: tf.LayersModel | null = null;

export async function loadModel() {
  try {
    // Replace the simple model with a more sophisticated architecture
    model = tf.sequential({
      layers: [
        // Input layer with data augmentation
        tf.layers.conv2d({
          inputShape: [224, 224, 3],
          kernelSize: 3,
          filters: 32,
          activation: 'relu',
          padding: 'same'
        }),
        tf.layers.batchNormalization(),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        
        // Additional convolutional blocks
        tf.layers.conv2d({ kernelSize: 3, filters: 64, activation: 'relu', padding: 'same' }),
        tf.layers.batchNormalization(),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        
        tf.layers.conv2d({ kernelSize: 3, filters: 128, activation: 'relu', padding: 'same' }),
        tf.layers.batchNormalization(),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        
        // Dense layers
        tf.layers.flatten(),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.dense({ units: 256, activation: 'relu' }),
        tf.layers.dense({ units: skinConditions.length, activation: 'softmax' })
      ]
    });
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load AI model');
  }
}

export async function preprocessImage(imageData: string): Promise<tf.Tensor4D> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Enhanced preprocessing pipeline
        const tensor = tf.tidy(() => {
          const pixels = tf.browser.fromPixels(img);
          
          // Resize to model input size
          const resized = tf.image.resizeBilinear(pixels, [224, 224]);
          
          // Normalize pixel values to [-1, 1]
          const normalized = resized.toFloat().sub(127.5).div(127.5);
          
          // Add batch dimension
          return normalized.expandDims(0);
        });
        
        resolve(tensor as tf.Tensor4D);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = (error) => reject(error);
    img.src = imageData;
  });
}

export async function detectCondition(imageData: string): Promise<DetectionResult> {
  let tensor: tf.Tensor4D | null = null;
  let predictions: tf.Tensor | null = null;

  try {
    if (!model) {
      await loadModel();
    }

    if (!imageData) {
      throw new Error('No image data provided');
    }

    tensor = await preprocessImage(imageData);
    
    if (!tensor) {
      throw new Error('Failed to preprocess image');
    }

    // Make prediction
    predictions = await model!.predict(tensor) as tf.Tensor;
    const probabilities = await predictions.data();
    
    if (!probabilities || probabilities.length !== skinConditions.length) {
      throw new Error('Invalid prediction output');
    }

    // Get highest probability condition
    const maxProbIndex = probabilities.indexOf(Math.max(...Array.from(probabilities)));
    
    if (maxProbIndex < 0 || maxProbIndex >= skinConditions.length) {
      throw new Error('Invalid condition index');
    }

    const condition = skinConditions[maxProbIndex];
    
    return {
      disease: condition.name,
      confidence: Math.round(probabilities[maxProbIndex] * 100 * 10) / 10,
      description: condition.description
    };
  } catch (error) {
    console.error('Error during detection:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze image');
  } finally {
    // Ensure tensors are always properly disposed
    if (tensor) tensor.dispose();
    if (predictions) predictions.dispose();
  }
}

export function getPrescription(diseaseName: string): Prescription {
  const condition = skinConditions.find(c => c.name === diseaseName);
  if (!condition) {
    throw new Error('Condition not found');
  }
  
  const prescription = prescriptionDatabase[condition.id];
  if (!prescription) {
    throw new Error('Prescription not found');
  }
  
  return {
    ...prescription,
    recommendedProducts: [
      {
        name: 'La Roche-Posay Anthelios Melt-In Sunscreen SPF 100',
        type: 'Sun Protection',
        description: 'High protection sunscreen specifically formulated for sensitive skin',
        usage: 'Apply generously 15 minutes before sun exposure, reapply every 2 hours',
        purchaseLink: 'https://www.nykaa.com/brands/la-roche-posay',
        price: '₹2780'
      },
      {
        name: 'Neutrogena Ultra Sheer Dry Touch Sunblock SPF 50+',
        type: 'Sun Protection',
        description: 'Lightweight, non-greasy sunscreen perfect for Indian climate',
        usage: 'Apply daily before sun exposure',
        purchaseLink: 'https://www.amazon.in/Neutrogena/s?k=Neutrogena+sunscreen',
        price: '₹599'
      }
    ]
  };
}