import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wheat, Users, TrendingUp, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-agriculture.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Precise Recommendations",
      description: "Get AI-powered crop suggestions based on your soil, climate, and budget"
    },
    {
      icon: TrendingUp,
      title: "Better Yield",
      description: "Optimize your farm's productivity with data-driven insights"
    },
    {
      icon: Users,
      title: "Farmer-Friendly",
      description: "Simple interface designed specifically for farmers' needs"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wheat className="h-8 w-8 text-forest-green" />
            <h1 className="text-2xl font-bold text-foreground">AgriGuide</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  AI-Based Crop
                  <span className="block text-forest-green">Recommendation System</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Helping farmers choose the right crop for better yield. Make informed decisions 
                  with our intelligent crop recommendation system.
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-earth hover:shadow-earth transition-all duration-300 text-lg px-8 py-6"
                onClick={() => navigate("/recommend")}
              >
                Get Started
                <Wheat className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="lg:order-2">
              <img 
                src={heroImage} 
                alt="Agricultural landscape with crops" 
                className="rounded-2xl shadow-earth w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-warm-cream/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose AgriGuide?
            </h2>
            <p className="text-xl text-muted-foreground">
              Smart farming starts with smart decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-gentle transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-earth rounded-full mb-6">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-12 bg-gradient-earth border-0">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Optimize Your Harvest?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join thousands of farmers who trust AgriGuide for their crop decisions
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 bg-primary-foreground text-forest-green hover:bg-primary-foreground/90"
              onClick={() => navigate("/recommend")}
            >
              Start Recommendation
              <Target className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t bg-card/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 AgriGuide. Empowering farmers with AI technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;