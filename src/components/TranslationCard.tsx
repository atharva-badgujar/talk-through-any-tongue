import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Volume2, ArrowUpDown, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranslationCardProps {
  type: "input" | "output";
  value: string;
  onChange?: (value: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  placeholder?: string;
  isListening?: boolean;
  onMicToggle?: () => void;
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
];

export const TranslationCard = ({
  type,
  value,
  onChange,
  language,
  onLanguageChange,
  placeholder,
  isListening = false,
  onMicToggle,
}: TranslationCardProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    if (value) {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied successfully",
      });
    }
  };

  const handleSpeak = () => {
    if (value && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(value);
      utterance.lang = language;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="p-6 bg-card shadow-soft border-0 transition-all duration-300 hover:shadow-strong">
      <div className="flex items-center justify-between mb-4">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-40 border-border bg-muted/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          {type === "input" && onMicToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMicToggle}
              className={`transition-all duration-300 ${
                isListening ? "text-accent bg-accent/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          {value && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSpeak}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <Textarea
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        className="min-h-32 border-0 bg-transparent resize-none text-base leading-relaxed focus:ring-0 focus:outline-none"
        readOnly={type === "output"}
      />
    </Card>
  );
};