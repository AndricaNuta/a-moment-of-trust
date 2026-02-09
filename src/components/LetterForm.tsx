import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Mic, MicOff, Send, X, Image, FileAudio, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Letter {
  id: string;
  author: string;
  content: string;
  images: string[];
  audio?: string;
  createdAt: Date;
  isPrivate?: boolean;
}

export type LetterSubmitPayload = Omit<Letter, "id" | "createdAt"> & {
  isPrivate?: boolean;
  promoConsent: boolean;
};

interface LetterFormProps {
  onSubmit: (letter: LetterSubmitPayload) => void | Promise<void>;
}

const LetterForm = ({ onSubmit }: LetterFormProps) => {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [promoConsent, setPromoConsent] = useState(false);
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
    const files = e.target.files;
    if (!files?.length) return;
    const maxSize = 5 * 1024 * 1024;
    const maxCount = 10;
    const toAdd: string[] = [];
    let processed = 0;
    const finish = () => {
      processed++;
      if (processed === files.length) {
        setImages((prev) => [...prev, ...toAdd].slice(0, maxCount));
        e.target.value = "";
      }
    };
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        toast({
          title: "Fișier prea mare",
          description: "Fiecare imagine trebuie să fie mai mică de 5MB",
          variant: "destructive",
        });
        finish();
        continue;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        toAdd.push(reader.result as string);
        finish();
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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

    if (!promoConsent) {
      toast({
        title: "Consimțământ necesar",
        description: "Te rugăm să accepți că informațiile pot fi folosite în conținut promoțional.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        author: author.trim() || "cineva care își amintește",
        content: content.trim(),
        images,
        audio: audio || undefined,
        isPrivate,
        promoConsent,
      });
      setAuthor("");
      setContent("");
      setImages([]);
      setAudio(null);
      setIsPrivate(false);
      setPromoConsent(false);
      toast({
        title: "Mulțumim",
        description: isPrivate
          ? "Scrisoarea ta a fost salvată și nu va fi publicată pe perete."
          : "Scrisoarea ta a fost adăugată pe perete.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nu s-a putut trimite scrisoarea.";
      toast({
        title: "Scrisoarea nu s-a salvat",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="write" className="py-14 lg:py-16 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-left mb-10">
            <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">ideo ideis</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mt-2 mb-2">
              scrie o scrisoare
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
              Câteva rânduri către tine, cel de la 16 ani, despre cine a avut încredere în tine atunci și ce a însemnat acel moment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="note-paper letter-fold relative rounded-xl p-6 md:p-8 pl-7 md:pl-9">
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  de la:
                </label>
                <Input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="numele tău [sau lasă gol]"
                  className="border-border bg-background/50 focus-visible:ring-primary/25 rounded-lg placeholder:text-muted-foreground/80"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  scrisoarea ta:
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={"Dragă [numele tău] de la 16 ani,\n\nAstăzi mi-am amintit de momentul în care cineva a avut încredere în tine...\n\nPoate nu știai atunci cât de mult avea să conteze, dar... "}
                  className="border-border bg-background/50 min-h-[200px] resize-none leading-relaxed rounded-lg placeholder:text-muted-foreground/80 focus-visible:ring-primary/25"
                />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-muted-foreground">atașează amintiri?</p>

                <div className="flex flex-wrap gap-3">
                  <div>
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                      className="gap-2 border-border bg-background/40 hover:bg-primary/5 hover:border-primary/30 text-foreground rounded-lg"
                    >
                      <Image className="w-4 h-4" />
                      {images.length ? `+ poze (${images.length})` : "poze"}
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
                      className="gap-2 border-border bg-background/40 hover:bg-primary/5 hover:border-primary/30 text-foreground rounded-lg"
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
                    className={`gap-2 rounded-lg ${isRecording ? "text-primary border-primary/50 bg-primary/10" : "border-border bg-background/40 hover:bg-primary/5 hover:border-primary/30 text-foreground"}`}
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

                <div className="pt-4 mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={isPrivate}
                      onCheckedChange={(v) => setIsPrivate(v === true)}
                      className="rounded border-border h-3.5 w-3.5"
                    />
                    <span>Vreau sa ramana privata</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={promoConsent}
                      onCheckedChange={(v) => setPromoConsent(v === true)}
                      className="rounded border-border h-3.5 w-3.5"
                    />
                    <span>
                      Sunt de acord cu{" "}
                      <Link to="/termeni" className="underline hover:text-foreground/80">
                        termenii și confidențialitatea
                      </Link>{" "}
                    </span>
                  </label>
                </div>

                {(images.length > 0 || audio) && (
                  <div className="flex flex-wrap gap-4 pt-4">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative border border-border rounded-lg overflow-hidden shadow-sm"
                      >
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="h-24 w-24 object-cover photo-bw"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-0 right-0 w-6 h-6 rounded-bl-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {audio && (
                      <div className="relative bg-background/40 border border-border rounded-lg p-4 flex items-center gap-3 flex-wrap">
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
                          className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 hover:bg-primary/90"
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

              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || !promoConsent}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 rounded-lg font-medium shadow-sm"
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
