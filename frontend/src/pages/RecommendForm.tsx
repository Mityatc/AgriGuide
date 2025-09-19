import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wheat, CloudRain, Thermometer, DollarSign, MapPin, FlaskConical, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  soilType: string;
  phValue: string;
  rainfall: string;
  temperature: string;
  state: string;
  budget: string;
  lang: 'en' | 'hi' | 'mr' | 'bn' | 'gu' | 'ta' | 'te' | 'kn' | 'ml' | 'pa' | 'or';
}

const RecommendForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    soilType: "",
    phValue: "",
    rainfall: "",
    temperature: "",
    state: "",
    budget: "",
    lang: 'en'
  });

  const soilTypes = ["Clay", "Loam", "Sandy", "Silt", "Peaty", "Chalky"];
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = Object.entries(formData);
    const missingFields = requiredFields.filter(([_, value]) => !value.trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate pH range
    const ph = parseFloat(formData.phValue);
    if (ph < 0 || ph > 14) {
      toast({
        title: "Invalid pH Value",
        description: "pH value must be between 0 and 14",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

      // Format data for API to match backend
      const apiData = {
        soil: formData.soilType,
        ph: parseFloat(formData.phValue),
        rainfall: parseFloat(formData.rainfall),
        temperature: parseFloat(formData.temperature),
        state: formData.state,
        budget: parseFloat(formData.budget),
        lang: formData.lang,
      };

      // Make API call
      const response = await axios.post(`${API_BASE}/recommend`, apiData, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Navigate to results with normalized data
      navigate('/results', { 
        state: { 
          recommendations: { crops: response.data?.crops || [] },
          inputData: formData 
        } 
      });
    } catch (error) {
      console.error('API Error:', error);
      
      // Fallback: no recommendations
      navigate('/results', { 
        state: { 
          recommendations: { crops: [] },
          inputData: formData 
        } 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <header className="p-6 border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
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

      {/* Form Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Crop Recommendation Form
            </h1>
            <p className="text-xl text-muted-foreground">
              Tell us about your farm conditions to get personalized crop recommendations
            </p>
          </div>

          <Card className="p-8 shadow-gentle bg-card/80 backdrop-blur-sm border-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Soil Type */}
                <div className="space-y-3">
                  <Label htmlFor="soil-type" className="text-base font-medium flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-forest-green" />
                    Soil Type
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('soilType', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* pH Value */}
                <div className="space-y-3">
                  <Label htmlFor="ph-value" className="text-base font-medium flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-forest-green" />
                    pH Value (0-14)
                  </Label>
                  <Input
                    id="ph-value"
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    placeholder="e.g., 6.5"
                    value={formData.phValue}
                    onChange={(e) => handleInputChange('phValue', e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Rainfall */}
                <div className="space-y-3">
                  <Label htmlFor="rainfall" className="text-base font-medium flex items-center gap-2">
                    <CloudRain className="h-4 w-4 text-forest-green" />
                    Rainfall (mm)
                  </Label>
                  <Input
                    id="rainfall"
                    type="number"
                    min="0"
                    placeholder="e.g., 1200"
                    value={formData.rainfall}
                    onChange={(e) => handleInputChange('rainfall', e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Temperature */}
                <div className="space-y-3">
                  <Label htmlFor="temperature" className="text-base font-medium flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-forest-green" />
                    Temperature (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 25.5"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* State */}
                <div className="space-y-3">
                  <Label htmlFor="state" className="text-base font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-forest-green" />
                    State
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget */}
                <div className="space-y-3">
                  <Label htmlFor="budget" className="text-base font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-forest-green" />
                    Budget (INR)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    placeholder="e.g., 50000"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Output Language & Voice */}
                <div className="space-y-3">
                  <Label htmlFor="lang" className="text-base font-medium flex items-center gap-2">
                    Output Language & Voice
                  </Label>
                  <Select value={formData.lang} onValueChange={(value) => handleInputChange('lang', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                      <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                      <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                      <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                      <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={loading}
                  className="w-full md:w-auto bg-gradient-earth hover:shadow-earth transition-all duration-300 text-lg px-12 py-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Getting Recommendations...
                    </>
                  ) : (
                    <>
                      Get Recommendations
                      <Wheat className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default RecommendForm;