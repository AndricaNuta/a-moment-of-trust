import { useState, useRef } from "react";
import { Mic, MicOff, Send, X, Image, FileAudio, Sparkles, Play, Pause } from "lucide-react";
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
  const [recordingElapsedSeconds, setRecordingElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const maxDurationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAX_RECORDING_SECONDS = 90; // 1.5 minutes

  const formatRecordingTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

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
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingElapsedSeconds(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingElapsedSeconds((prev) => Math.min(prev + 1, MAX_RECORDING_SECONDS));
      }, 1000);

      maxDurationTimeoutRef.current = setTimeout(() => {
        stopRecording();
        toast({
          title: "Limită atinsă",
          description: "Înregistrarea e limitată la 1,5 minute.",
          variant: "default",
        });
      }, MAX_RECORDING_SECONDS * 1000);
    } catch {
      toast({
        title: "Ups",
        description: "Nu am putut accesa microfonul. Verifică permisiunile browserului.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (maxDurationTimeoutRef.current) {
      clearTimeout(maxDurationTimeoutRef.current);
      maxDurationTimeoutRef.current = null;
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setRecordingElapsedSeconds(0);
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: "Hei, scrisoarea e goală",
        description: "Scrie câteva cuvinte pentru persoana care a crezut în tine.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

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
      title: "Mulțumim",
      description: "Scrisoarea ta a fost adăugată pe perete.",
    });
  };

  return (
    <section id="write" className="py-10 sm:py-14 lg:py-16 bg-card/60 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-left mb-6 sm:mb-8">
            <Sparkles className="w-6 h-6 text-primary mb-2" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2">
              scrie o scrisoare
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              câteva cuvinte din inimă — nu trebuie perfect. poate nu ajunge la ea, dar tu știi că ai spus-o.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-background border border-border rounded-xl p-4 sm:p-6 md:p-8 shadow-sm">
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  de la:
                </label>
                <Input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="numele tău (sau lasă gol)"
                  className="border-border"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  scrisoarea ta:
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={"Dragă [persoană],\n\nVreau să-ți mulțumesc pentru acel moment când...\n\nNu știu dacă ți-ai dat seama vreodată cât de mult a însemnat pentru mine."}
                  className="border-border min-h-[200px] resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">atașează o amintire?</p>

                <div className="flex flex-wrap gap-3">
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
                      className="gap-2"
                    >
                      <Image className="w-4 h-4" />
                      {image ? "altă poză" : "o poză"}
                    </Button>
                  </div>

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
                      className="gap-2"
                    >
                      <FileAudio className="w-4 h-4" />
                      {audio ? "alt fișier" : "un audio"}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`gap-2 ${isRecording ? "text-primary border-primary" : ""}`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        oprește
                        <span className="tabular-nums text-muted-foreground">
                          {formatRecordingTime(recordingElapsedSeconds)} / {formatRecordingTime(MAX_RECORDING_SECONDS)}
                        </span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        înregistrează
                      </>
                    )}
                  </Button>
                </div>

                {(image || audio) && (
                  <div className="flex flex-wrap gap-4 pt-4">
                    {image && (
                      <div className="relative border border-border rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt="Preview"
                          className="h-24 w-24 object-cover photo-bw"
                        />
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="absolute top-0 right-0 w-6 h-6 rounded-bl-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {audio && (
                      <div className="relative bg-muted border border-border rounded-lg p-4 flex items-center gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            if (audioPreviewRef.current) {
                              if (isPlayingPreview) {
                                audioPreviewRef.current.pause();
                              } else {
                                audioPreviewRef.current.play();
                              }
                              setIsPlayingPreview(!isPlayingPreview);
                            }
                          }}
                          className="flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-3 py-2 hover:bg-primary/90"
                        >
                          {isPlayingPreview ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          <span className="text-sm">
                            {isPlayingPreview ? "pauză" : "ascultă"}
                          </span>
                        </button>
                        <span className="text-sm text-muted-foreground">mesaj audio</span>
                        <button
                          type="button"
                          onClick={() => {
                            audioPreviewRef.current?.pause();
                            setIsPlayingPreview(false);
                            setAudio(null);
                          }}
                          className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                          aria-label="Elimină audio"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <audio
                          ref={audioPreviewRef}
                          src={audio}
                          onEnded={() => setIsPlayingPreview(false)}
                          onPause={() => setIsPlayingPreview(false)}
                          onPlay={() => setIsPlayingPreview(true)}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 sm:mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
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
