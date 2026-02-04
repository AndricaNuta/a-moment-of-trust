import { useState, useRef } from "react";
import { Upload, Mic, MicOff, Send, X, Image, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Letter {
  id: string;
  author: string;
  content: string;
  image?: string;
  audio?: string;
  createdAt: Date;
}

interface LetterFormProps {
  onSubmit: (letter: Omit<Letter, "id" | "createdAt">) => void;
}

const LetterForm = ({ onSubmit }: LetterFormProps) => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fișier prea mare",
          description: "Imaginea trebuie să fie mai mică de 5MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fișier prea mare",
          description: "Înregistrarea trebuie să fie mai mică de 10MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudio(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudio(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu am putut accesa microfonul. Verifică permisiunile.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Scrisoare goală",
        description: "Te rugăm să scrii câteva cuvinte în scrisoare.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit({
      author: author.trim() || "Anonim",
      content: content.trim(),
      image: image || undefined,
      audio: audio || undefined,
    });

    // Reset form
    setAuthor("");
    setContent("");
    setImage(null);
    setAudio(null);
    setIsSubmitting(false);

    toast({
      title: "Mulțumim!",
      description: "Scrisoarea ta a fost trimisă cu succes.",
    });
  };

  return (
    <section id="write" className="py-24 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex gap-2 mb-6">
              <span className="w-2 h-2 bg-primary" />
              <span className="w-2 h-2 bg-primary/60" />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold ideo-headline mb-4">
              scrie-i o scrisoare
            </h2>
            <p className="text-muted-foreground">
              scrisoarea ta către persoana care a avut încredere în tine când 
              aveai 16 ani. poate fi scurtă, poate fi lungă. poate fi personală 
              sau poate fi o reflecție. important e să fie sinceră.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Author Name */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                numele tău (opțional)
              </label>
              <Input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Lasă gol pentru a rămâne anonim"
                className="bg-secondary border-border focus:border-primary"
              />
            </div>

            {/* Letter Content */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                scrisoarea ta
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dragă [persoană],&#10;&#10;Îți mulțumesc pentru că ai avut încredere în mine când..."
                className="bg-secondary border-border focus:border-primary min-h-[200px] resize-none"
              />
            </div>

            {/* Media Uploads */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                adaugă o imagine sau o înregistrare audio (opțional)
              </p>

              <div className="flex flex-wrap gap-4">
                {/* Image Upload */}
                <div>
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => imageInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Image className="w-4 h-4" />
                    {image ? "Schimbă imaginea" : "Adaugă imagine"}
                  </Button>
                </div>

                {/* Audio Upload */}
                <div>
                  <input
                    type="file"
                    ref={audioInputRef}
                    onChange={handleAudioUpload}
                    accept="audio/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => audioInputRef.current?.click()}
                    className="gap-2"
                  >
                    <FileAudio className="w-4 h-4" />
                    {audio ? "Schimbă audio" : "Încarcă audio"}
                  </Button>
                </div>

                {/* Record Audio */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`gap-2 ${isRecording ? "text-primary border-primary" : ""}`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Oprește înregistrarea
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Înregistrează
                    </>
                  )}
                </Button>
              </div>

              {/* Preview uploaded media */}
              {(image || audio) && (
                <div className="flex flex-wrap gap-4 pt-4">
                  {image && (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Preview"
                        className="h-20 w-20 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {audio && (
                    <div className="relative bg-secondary p-3 flex items-center gap-2">
                      <FileAudio className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Înregistrare audio
                      </span>
                      <button
                        type="button"
                        onClick={() => setAudio(null)}
                        className="ml-2 w-6 h-6 bg-destructive text-destructive-foreground flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? (
                  "Se trimite..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Trimite scrisoarea
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LetterForm;
