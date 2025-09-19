import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wheat, RotateCcw, Lightbulb, Sprout, ArrowLeft, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface CropOut {
  name: string;
  reason: string;
  fertilizer: string;
}

interface ResultsDataOut {
  crops: CropOut[];
}

interface LocationState {
  recommendations: ResultsDataOut;
  inputData: { lang?: 'en' | 'hi' };
}

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState<ResultsDataOut | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.recommendations) {
      setResults(state.recommendations);
      if (state.inputData?.lang === 'hi') setLang('hi');
    } else {
      // Redirect to form if no data
      navigate('/recommend');
    }
  }, [location.state, navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
        <div className="text-center">
          <Wheat className="h-12 w-12 text-forest-green mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  const hasCrops = results.crops && results.crops.length > 0;

  const langToBcp47: Record<string, string> = {
    en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', bn: 'bn-IN', gu: 'gu-IN', ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', or: 'or-IN'
  };

  const speak = () => {
    if (!results || !hasCrops) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const enLines = results.crops.map((c, i) => `${i + 1}. ${c.name}. Reason: ${c.reason}. Fertilizer: ${c.fertilizer}.`);
    // For non-English, we trust backend to return localized text already
    const nonEnLines = results.crops.map((c, i) => `${i + 1}. ${c.name}. ${c.reason}. ${c.fertilizer}.`);
    const text = lang === 'en' ? `Recommended crops: ${enLines.join(' ')}` : nonEnLines.join(' ');
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langToBcp47[lang] || 'en-IN';
    // Prefer a matching voice if available
    const voices = synth.getVoices();
    const preferred = voices.find(v => lang === 'hi' ? v.lang.toLowerCase().startsWith('hi') : v.lang.toLowerCase().startsWith('en')); 
    if (preferred) utter.voice = preferred;
    synth.cancel();
    synth.speak(utter);
  };

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <header className="p-6 border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wheat className="h-8 w-8 text-forest-green" />
            <h1 className="text-2xl font-bold text-foreground">AgriGuide</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="border-forest-green text-forest-green hover:bg-forest-green hover:text-primary-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Results Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Crop Recommendations
            </h1>
            <p className="text-xl text-muted-foreground">
              Based on your farm conditions, here are our AI-powered suggestions
            </p>
          </div>

          {/* Recommended Crops */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Sprout className="h-6 w-6 text-forest-green" />
              Recommended Crops
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasCrops ? (
                results.crops.map((crop, index) => (
                  <Card key={index} className="p-6 hover:shadow-gentle transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-earth rounded-full flex items-center justify-center text-4xl">
                        🌾
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {crop.name}
                      </h3>
                      <div className="text-muted-foreground text-sm text-left mt-2">
                        <div className="mb-1"><span className="font-semibold">Reason:</span> {crop.reason}</div>
                        <div><span className="font-semibold">Fertilizer:</span> {crop.fertilizer}</div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground">No recommendations available.</div>
              )}
            </div>
          </div>

          {/* Reasoning Section removed: backend returns per-crop reasons */}

          {/* Fertilizers Section removed: shown per-crop above */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/recommend')}
              className="bg-gradient-earth hover:shadow-earth transition-all duration-300 text-lg px-8 py-6"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Try Again
            </Button>
            
            <Button 
              size="lg"
              onClick={speak}
              className="bg-forest-green hover:bg-forest-green/90 text-primary-foreground text-lg px-8 py-6"
            >
              Speak Recommendation
            </Button>

            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/')}
              className="border-forest-green text-forest-green hover:bg-forest-green hover:text-primary-foreground text-lg px-8 py-6"
            >
              <Wheat className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t bg-card/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 AgriGuide. Empowering farmers with AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Results;