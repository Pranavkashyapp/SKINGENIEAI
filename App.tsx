import React, { useEffect } from 'react';
import { Camera as CameraIcon, Loader2, Stethoscope, Pill as Pills } from 'lucide-react';
import { useStore } from './store';
import { Camera } from './components/Camera';
import { ErrorMessage } from './components/ErrorMessage';
import { detectCondition, getPrescription, loadModel } from './services/modelService';

interface Product {
  name: string;
  type: string;
  description: string;
  usage: string;
  price?: string;
  purchaseLink?: string;
}

interface Prescription {
  medication: string;
  dosage: string;
  duration: string;
  precautions: string[];
  alternatives?: string[];
  recommendedProducts: Product[];
}

function App() {
  const {
    currentStep,
    image,
    result,
    prescription,
    setStep,
    setResult,
    setPrescription,
    setError,
    setLoading,
    reset
  } = useStore();

  useEffect(() => {
    loadModel().catch(() => {
      setError('Failed to load AI model. Please refresh the page.');
    });
  }, [setError]);

  useEffect(() => {
    if (currentStep === 'processing' && image) {
      const analyzeImage = async () => {
        try {
          setLoading(true);
          const detectionResult = await detectCondition(image);
          setResult(detectionResult);
          const prescriptionResult = getPrescription(detectionResult.disease);
          setPrescription(prescriptionResult);
          setStep('result');
        } catch (error) {
          setError('Failed to analyze image. Please try again.');
          setStep('capture');
        } finally {
          setLoading(false);
        }
      };

      analyzeImage();
    }
  }, [currentStep, image, setResult, setPrescription, setStep, setError, setLoading]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-100 via-teal-100 to-violet-100 relative overflow-hidden">
      <ErrorMessage />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] -z-10" />
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-[40rem] h-[40rem] bg-violet-500/10 rounded-full blur-3xl" />
        <div className="w-[30rem] h-[30rem] bg-teal-500/10 rounded-full blur-3xl -ml-40" />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            SKIN GENIE AI 
          </h1>
          <p className="text-gray-600 text-lg">
            Advanced skin analysis powered by artificial intelligence
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-6">
            {['capture', 'processing', 'result', 'prescription'].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep === step
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-white text-gray-400 border border-gray-200'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className={`mt-2 text-sm ${currentStep === step ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`h-0.5 w-16 transition-all duration-300 ${
                      currentStep === step ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
            {currentStep === 'capture' && (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center mx-auto mb-6">
                  <CameraIcon className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Capture Image
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Take a clear photo of the affected skin area for accurate analysis
                </p>
                <Camera />
              </div>
            )}

            {currentStep === 'processing' && (
              <div className="text-center py-12">
                <Loader2 className="w-20 h-20 mx-auto mb-6 text-indigo-600 animate-spin" />
                <h2 className="text-2xl font-semibold mb-4">Analyzing Your Image</h2>
                <p className="text-gray-600 text-lg">
                  Our AI is processing your skin condition...
                </p>
              </div>
            )}

            {currentStep === 'result' && result && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center mx-auto mb-6">
                    <Stethoscope className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Analysis Complete
                  </h2>
                </div>

                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3">Detected Condition:</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl text-indigo-700">{result.disease}</span>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {result.confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{result.description}</p>
                </div>

                <button
                  onClick={() => setStep('prescription')}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
                >
                  View Treatment Plan
                </button>
              </div>
            )}

            {currentStep === 'prescription' && prescription && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center mx-auto mb-6">
                    <Pills className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Treatment Plan
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-violet-50 to-indigo-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-3">Recommended Treatment</h3>
                    <p className="text-xl text-indigo-700">{prescription.medication}</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold mb-3">Instructions</h3>
                    <div className="space-y-2 text-gray-700">
                      <p>{prescription.dosage}</p>
                      <p>{prescription.duration}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-semibold mb-3">Precautions</h3>
                    <ul className="space-y-2">
                      {prescription.precautions.map((precaution, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3" />
                          {precaution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {prescription.alternatives && (
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                      <h3 className="text-xl font-semibold mb-3">Alternative Treatments</h3>
                      <ul className="space-y-2">
                        {prescription.alternatives.map((alternative, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3" />
                            {alternative}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-violet-50 to-indigo-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4">Recommended Products</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {prescription.recommendedProducts.map((product, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-lg text-indigo-700 mb-2">{product.name}</h4>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">{product.type}</p>
                            <p className="text-sm text-gray-700">{product.description}</p>
                            <p className="text-sm text-gray-600"><span className="font-medium">How to use:</span> {product.usage}</p>
                            {product.price && (
                              <p className="text-sm font-medium text-indigo-600">{product.price}</p>
                            )}
                            {product.purchaseLink && (
                              <a
                                href={product.purchaseLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-sm text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                              >
                                Purchase Now
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
                >
                  Start New Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;