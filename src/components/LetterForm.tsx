import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mic, MicOff, Send, X, Image, FileAudio, Play, Pause, Video } from "lucide-react";

function VideoPreviewItem({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  return (
    <div className="relative border border-border rounded-lg overflow-hidden shadow-sm max-w-[200px]">
      <video
        src={url}
        controls
        className="w-full h-auto max-h-32 object-cover"
        muted
        playsInline
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-0 right-0 w-6 h-6 rounded-bl-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

function AudioPreviewItem({
  src,
  index,
  onRemove,
}: {
  src: string;
  index: number;
  onRemove: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement>(null);

  return (
    <div className="relative bg-background/40 border border-border rounded-lg p-4 flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={() => {
          if (ref.current) {
            if (isPlaying) ref.current.pause();
            else ref.current.play();
            setIsPlaying(!isPlaying);
          }
        }}
        className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 hover:bg-primary/90"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        <span className="text-sm">{isPlaying ? "pauză" : "ascultă"}</span>
      </button>
      <span className="text-sm text-muted-foreground">mesaj audio {index + 1}</span>
      <button
        type="button"
        onClick={() => {
          ref.current?.pause();
          setIsPlaying(false);
          onRemove();
        }}
        className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
        aria-label="Elimină audio"
      >
        <X className="w-3 h-3" />
      </button>
      <audio
        ref={ref}
        src={src}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        className="hidden"
      />
    </div>
  );
}
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
  audios?: string[];
  videos?: string[];
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
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [audios, setAudios] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [promoConsent, setPromoConsent] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingElapsedSeconds, setRecordingElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const maxSize = 50 * 1024 * 1024; // 50MB
    const maxCount = 10;
    const toAdd: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        toast({
          title: "Fișier prea mare",
          description: "Fiecare video trebuie să fie mai mic de 50MB",
          variant: "destructive",
        });
        continue;
      }
      toAdd.push(file);
    }
    if (toAdd.length > 0) {
      setVideoFiles((prev) => [...prev, ...toAdd].slice(0, maxCount));
    }
    e.target.value = "";
  };

  const removeVideo = (index: number) =>
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxCount = 10;
    const toAdd: string[] = [];
    let processed = 0;
    const finish = () => {
      processed++;
      if (processed === files.length) {
        setAudios((prev) => [...prev, ...toAdd].slice(0, maxCount));
        e.target.value = "";
      }
    };
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        toast({
          title: "Fișier prea mare",
          description: "Fiecare fișier audio trebuie să fie mai mic de 10MB",
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
    e.target.value = "";
  };

  const removeAudio = (index: number) => setAudios((prev) => prev.filter((_, i) => i !== index));

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
          setAudios((prev) => [...prev, reader.result as string].slice(0, 10));
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

  const hasContent = content.trim().length > 0;
  const hasMedia = images.length > 0 || videoFiles.length > 0 || audios.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasContent && !hasMedia) {
      toast({
        title: "Hei, scrisoarea e goală",
        description: "Scrie câteva cuvinte sau încarcă video, audio sau poze.",
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
      let videoDataUrls: string[] | undefined;
      if (videoFiles.length > 0) {
        try {
          videoDataUrls = await Promise.all(
            videoFiles.map(
              (f) =>
                new Promise<string>((resolve, reject) => {
                  const r = new FileReader();
                  r.onloadend = () => resolve(r.result as string);
                  r.onerror = () => reject(new Error("Nu s-a putut procesa video-ul"));
                  r.readAsDataURL(f);
                })
            )
          );
        } catch {
          toast({
            title: "Eroare la procesarea video",
            description: "Încearcă un fișier mai mic.",
            variant: "destructive",
          });
          return;
        }
      }

      await onSubmit({
        author: author.trim() || "cineva care își amintește",
        content: content.trim() || "",
        images,
        audios: audios.length ? audios : undefined,
        videos: videoDataUrls,
        isPrivate,
        promoConsent,
      });
      setAuthor("");
      setContent("");
      setImages([]);
      setVideoFiles([]);
      setAudios([]);
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
        <div className="max-w-4xl mx-auto">
          <div className="text-left mb-10">
            <span className="text-detalii font-semibold tracking-wider text-primary">ideo ideis</span>
            <h2 className="text-titlu-capitol text-foreground mt-2 mb-2">
              scrie o scrisoare
            </h2>
            <p className="text-body text-muted-foreground max-w-lg">
              scrie câteva rânduri sau încarcă video, audio sau poze - către tine, cel de la 16 ani și povestește-ne despre cine a avut încredere în tine atunci și ce a însemnat acel moment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="note-paper letter-fold relative p-6 md:p-8 pl-7 md:pl-9 bg-card text-foreground">
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  de la:
                </label>
                <Input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="numele tău [sau lasă gol]"
                  className="border-border bg-background/50 focus-visible:ring-primary/25 rounded placeholder:text-muted-foreground/80"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  scrisoarea ta:
                </label>
                <p className="text-xs text-muted-foreground/80 mb-2">
                  poți scrie text sau doar încărca video / audio / poze mai jos
                </p>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={"Dragă [numele tău] de la 16 ani,\n\nAstăzi mi-am amintit de momentul în care cineva a avut încredere în tine...\n\nPoate nu știai atunci cât de mult avea să conteze, dar... "}
                  className="border-border bg-background/50 min-h-[200px] resize-none leading-relaxed rounded placeholder:text-muted-foreground/80 focus-visible:ring-primary/25"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">atașează amintiri</p>
                  <p className="text-xs text-muted-foreground/80">
                    poze, video, audio sau înregistrare vocală
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={handleVideoUpload}
                    accept="video/*"
                    multiple
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={audioInputRef}
                    onChange={handleAudioUpload}
                    accept="audio/*"
                    multiple
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-background/40 hover:bg-primary/5 hover:border-primary/30 transition-colors text-foreground"
                  >
                    <Image className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium">poze</span>
                    {images.length > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums">{images.length}</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (videoInputRef.current) {
                        videoInputRef.current.value = "";
                        videoInputRef.current.click();
                      }
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-background/40 hover:bg-primary/5 hover:border-primary/30 transition-colors text-foreground"
                  >
                    <Video className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium">video</span>
                    {videoFiles.length > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums">{videoFiles.length}</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-background/40 hover:bg-primary/5 hover:border-primary/30 transition-colors text-foreground"
                  >
                    <FileAudio className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium">audio</span>
                    {audios.length > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums">{audios.length}</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                      isRecording
                        ? "text-primary border-primary/50 bg-primary/10"
                        : "border-border bg-background/40 hover:bg-primary/5 hover:border-primary/30 text-foreground"
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="w-6 h-6" />
                    ) : (
                      <Mic className="w-6 h-6 text-primary" />
                    )}
                    <span className="text-sm font-medium">{isRecording ? "oprește" : "înregistrează"}</span>
                    {isRecording && (
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {formatRecordingTime(recordingElapsedSeconds)} / {formatRecordingTime(MAX_RECORDING_SECONDS)}
                      </span>
                    )}
                  </button>
                </div>

                {(images.length > 0 || videoFiles.length > 0 || audios.length > 0) && (
                  <div className="flex flex-wrap gap-4 pt-4 mt-4">
                    {images.map((img, idx) => (
                      <div
                        key={`img-${idx}`}
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
                    {videoFiles.map((file, idx) => (
                      <VideoPreviewItem
                        key={`vid-${idx}`}
                        file={file}
                        onRemove={() => removeVideo(idx)}
                      />
                    ))}
                    {audios.map((a, idx) => (
                      <AudioPreviewItem
                        key={`aud-${idx}`}
                        src={a}
                        index={idx}
                        onRemove={() => removeAudio(idx)}
                      />
                    ))}
                  </div>
                )}

                <div className="pt-4 mt-4 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    dacă nu bifezi „privată”, scrisoarea va apărea pe peretele amintirilor de pe site.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={isPrivate}
                        onCheckedChange={(v) => setIsPrivate(v === true)}
                        className="border-border h-3.5 w-3.5"
                      />
                      <span>vreau să rămână privată</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={promoConsent}
                        onCheckedChange={(v) => setPromoConsent(v === true)}
                        className="border-border h-3.5 w-3.5"
                      />
                      <span>
                        sunt de acord cu{" "}
                        <Link to="/termeni" className="underline hover:text-foreground/80">
                          termenii și confidențialitatea
                        </Link>{" "}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || !promoConsent}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 rounded font-semibold shadow-sm"
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
