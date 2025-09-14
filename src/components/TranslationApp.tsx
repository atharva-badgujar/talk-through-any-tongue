import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TranslationCard } from "./TranslationCard";
import { ArrowUpDown, Languages, Volume2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TypeScript declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const TranslationApp = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [inputLanguage, setInputLanguage] = useState("en");
  const [outputLanguage, setOutputLanguage] = useState("es");
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  // Mock translation function - replace with actual API call
  const translateText = async (text: string, from: string, to: string) => {
    setIsTranslating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock translation - in real app, use Google Translate API or similar
    const mockTranslations: Record<string, string> = {
      "hello": "hola",
      "goodbye": "adiós",
      "thank you": "gracias",
      "how are you": "¿cómo estás?",
      "good morning": "buenos días",
    };
    
    const translated = mockTranslations[text.toLowerCase()] || `[Translated: ${text}]`;
    setOutputText(translated);
    setIsTranslating(false);
  };

  // Handle speech recognition
  const toggleSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = inputLanguage;

      if (!isListening) {
        recognition.start();
        setIsListening(true);
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
          toast({
            title: "Speech recognition error",
            description: "Please try again or check your microphone",
            variant: "destructive",
          });
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } else {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive",
      });
    }
  };

  // Auto-translate when input changes
  useEffect(() => {
    if (inputText.trim()) {
      const debounceTimer = setTimeout(() => {
        translateText(inputText, inputLanguage, outputLanguage);
      }, 500);
      
      return () => clearTimeout(debounceTimer);
    } else {
      setOutputText("");
    }
  }, [inputText, inputLanguage, outputLanguage]);

  const swapLanguages = () => {
    const tempLang = inputLanguage;
    setInputLanguage(outputLanguage);
    setOutputLanguage(tempLang);
    
    const tempText = inputText;
    setInputText(outputText);
    setOutputText(tempText);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-soft">
              <Languages className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Live Translator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Translate text and speech in real-time
          </p>
        </div>

        {/* Translation Interface */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Source Text</h2>
            <TranslationCard
              type="input"
              value={inputText}
              onChange={setInputText}
              language={inputLanguage}
              onLanguageChange={setInputLanguage}
              placeholder="Type or speak to translate..."
              isListening={isListening}
              onMicToggle={toggleSpeechRecognition}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Translation</h2>
            <TranslationCard
              type="output"
              value={isTranslating ? "Translating..." : outputText}
              language={outputLanguage}
              onLanguageChange={setOutputLanguage}
              placeholder="Translation will appear here..."
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={swapLanguages}
            variant="outline"
            size="lg"
            className="bg-background border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
          >
            <ArrowUpDown className="h-5 w-5 mr-2" />
            Swap Languages
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="text-center p-6 bg-card rounded-xl shadow-soft">
            <div className="w-12 h-12 bg-gradient-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Languages className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">50+ Languages</h3>
            <p className="text-muted-foreground text-sm">
              Support for major world languages with high accuracy
            </p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-xl shadow-soft">
            <div className="w-12 h-12 bg-gradient-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Volume2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Voice Input</h3>
            <p className="text-muted-foreground text-sm">
              Speak naturally and get instant translations
            </p>
          </div>
          
          <div className="text-center p-6 bg-card rounded-xl shadow-soft">
            <div className="w-12 h-12 bg-gradient-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Copy className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Easy Sharing</h3>
            <p className="text-muted-foreground text-sm">
              Copy and share translations with one tap
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};