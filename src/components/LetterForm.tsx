import { useState, useRef } from "react";
import { Mic, MicOff, Send, X, Image, FileAudio, Sparkles } from "lucide-react";
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
    } catch {
      toast({
        title: "Ups!",
        description: "Nu am putut accesa microfonul. Verifică permisiunile browserului.",
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
        title: "Hei, scrisoarea e goală!",
        description: "Scrie câteva cuvinte pentru persoana care a crezut în tine.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit({
      author: author.trim() || "cineva care își amintește",
      content: content.trim(),
      image: image || undefined,
      audio: audio || undefined,
    });

    setAuthor("");
    setContent("");
    setImage(null);
    setAudio(null);
    setIsSubmitting(false);

    toast({
      title: "Mulțumim frumos! ♡",
      description: "Scrisoarea ta a zburat spre peretele amintirilor.",
    });
  };

  return (
    <section id="write" className="py-24 bg-card relative overflow-hidden">
      {/* Decorative notebook margin */}
      <div className="absolute left-8 md:left-16 top-0 bottom-0 w-[2px] bg-primary/20 hidden lg:block" />
      
      {/* Floating decoration */}
      <div className="absolute top-20 right-10 font-handwritten text-8xl text-primary/5 hidden lg:block">
        ✉
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="font-handwritten text-4xl md:text-5xl text-foreground mb-4">
              e rândul tău
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              scrie-i acelei persoane. nu trebuie să fie perfect, trebuie doar să fie din inimă.
              poate nu o să ajungă la ea niciodată, dar tu o să știi că ai spus-o.
            </p>
          </div>

          {/* Letter form - notebook style */}
          <form onSubmit={handleSubmit} className="relative">
            {/* Paper effect */}
            <div className="bg-background shadow-lg p-8 md:p-12 paper-texture">
              {/* "Dear..." line */}
              <div className="mb-8">
                <label className="font-handwritten text-lg text-muted-foreground">
                  de la:
                </label>
                <Input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="numele tău (sau lasă gol)"
                  className="font-handwritten text-xl bg-transparent border-0 border-b-2 border-dashed border-border focus:border-primary rounded-none px-0 focus-visible:ring-0"
                />
              </div>

              {/* Letter content */}
              <div className="mb-8">
                <label className="font-handwritten text-lg text-muted-foreground">
                  scrisoarea ta:
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dragă [persoană],

Vreau să-ți mulțumesc pentru acel moment când...

Nu știu dacă ți-ai dat seama vreodată cât de mult a însemnat pentru mine..."
                  className="font-handwritten text-xl bg-transparent border-0 focus-visible:ring-0 min-h-[250px] resize-none leading-8 placeholder:text-muted-foreground/40"
                  style={{ 
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, hsl(var(--border)) 31px, hsl(var(--border)) 32px)',
                    lineHeight: '32px',
                    paddingTop: '0'
                  }}
                />
              </div>

              {/* Media attachments */}
              <div className="space-y-4">
                <p className="font-handwritten text-lg text-muted-foreground">
                  atașează o amintire? ♡
                </p>

                <div className="flex flex-wrap gap-3">
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
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                      className="gap-2 font-handwritten text-lg"
                    >
                      <Image className="w-4 h-4" />
                      {image ? "altă poză" : "o poză"}
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
                      size="sm"
                      onClick={() => audioInputRef.current?.click()}
                      className="gap-2 font-handwritten text-lg"
                    >
                      <FileAudio className="w-4 h-4" />
                      {audio ? "alt fișier" : "un audio"}
                    </Button>
                  </div>

                  {/* Record Audio */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`gap-2 font-handwritten text-lg ${isRecording ? "text-primary border-primary animate-pulse" : ""}`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        oprește
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        înregistrează
                      </>
                    )}
                  </Button>
                </div>

                {/* Preview uploaded media */}
                {(image || audio) && (
                  <div className="flex flex-wrap gap-4 pt-4">
                    {image && (
                      <div className="relative bg-white p-2 shadow-md rotate-2">
                        <img
                          src={image}
                          alt="Preview"
                          className="h-24 w-24 object-cover sepia-[0.2]"
                        />
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground flex items-center justify-center shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {audio && (
                      <div className="relative bg-secondary p-4 flex items-center gap-3">
                        <FileAudio className="w-6 h-6 text-primary" />
                        <span className="font-handwritten text-lg text-muted-foreground">
                          mesaj audio ♪
                        </span>
                        <button
                          type="button"
                          onClick={() => setAudio(null)}
                          className="w-6 h-6 bg-primary text-primary-foreground flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit - stamp style */}
              <div className="mt-10 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-handwritten text-xl px-8 py-6 animate-gentle-pulse"
                >
                  {isSubmitting ? (
                    "se trimite..."
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      trimite scrisoarea
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LetterForm;
