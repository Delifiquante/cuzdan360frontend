"use client";

import { useState, MouseEvent, ChangeEvent, DragEvent } from "react";
import { UploadCloud, File as FileIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { analyzeReceipt, bulkCreateTransactions } from "@/lib/services/transactionService";

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState<'idle' | 'analyzing' | 'processing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveFile = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFile(null);
    setUploadStage('idle');
    setProgress(0);
  };

  const simulateProgress = (start: number, end: number, duration: number) => {
    return new Promise<void>((resolve) => {
      const stepTime = 50;
      const steps = duration / stepTime;
      const increment = (end - start) / steps;
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          clearInterval(timer);
          setProgress(end);
          resolve();
        } else {
          setProgress(Math.min(current, end)); // Asla end değerini geçmesin
        }
      }, stepTime);
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStage('analyzing');
    setProgress(0);

    try {
      // Adım 1: Analiz Simülasyonu (Gerçek işlem başlamadan önce bi tık ilerlet)
      await simulateProgress(0, 30, 800);

      // Adım 1 (Gerçek): Servis üzerinden analiz et
      const transactionsToCreate = await analyzeReceipt(file);

      // Analiz bitti, progress'i %60'a çek
      await simulateProgress(30, 60, 500);

      if (transactionsToCreate.length === 0) {
        toast({
          variant: "warning",
          title: "Sonuç Yok",
          description: "Belgeden herhangi bir işlem okunamadı.",
        });
        setIsUploading(false);
        setUploadStage('idle');
        setProgress(0);
        return;
      }

      setUploadStage('processing');
      // Adım 2 (Gerçek öncesi): Kullanıcıya "işleniyor" hissi ver
      await simulateProgress(60, 80, 600);

      // Adım 2 (Gerçek): Bulk create ile kaydet
      await bulkCreateTransactions(transactionsToCreate);

      // İşlem tamamlandı, %100 yap
      await simulateProgress(80, 100, 400);

      setUploadStage('completed');

      toast({
        title: "Başarılı",
        description: `${transactionsToCreate.length} adet işlem başarıyla oluşturuldu.`,
      });

      // Kısa bir bekleme sonrası formu temizle
      setTimeout(() => {
        setFile(null);
        setUploadStage('idle');
        setIsUploading(false);
        setProgress(0);
      }, 1500);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "İşlem Başarısız",
        description: error.message || "Dosya yüklenirken veya işlenirken bir sorun oluştu.",
      });
      setIsUploading(false);
      setUploadStage('idle');
      setProgress(0);
    }
  };

  const handleDelete = () => {
    setFile(null);
    setUploadStage('idle');
    setProgress(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dosya Yükle</CardTitle>
        <p className="text-sm text-gray-500 pt-2">
          Finansal analiz için bir belge (ör. jpg, PDF) yükleyin. Yapay zeka,
          verilerinizi işleyerek size öngörüler sunacaktır.
        </p>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer mt-4 transition-colors hover:border-primary/50 relative overflow-hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !isUploading && document.getElementById("file-upload-input")?.click()}
        >
          {/* Progress Bar Background */}
          {isUploading && (
            <div
              className="absolute inset-0 bg-primary/5 transition-all duration-300 ease-out z-0"
              style={{ width: `${progress}%` }}
            />
          )}

          <Input
            type="file"
            id="file-upload-input"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          <div className="relative z-10">
            {file ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-2">
                  {isUploading ? (
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  ) : (
                    <FileIcon className="w-12 h-12 text-primary" />
                  )}
                </div>
                <p className="text-lg font-medium text-gray-700">{file.name}</p>

                {isUploading ? (
                  <div className="mt-2 text-primary font-semibold animate-pulse">
                    {uploadStage === 'analyzing' && "Yapay Zeka Analiz Ediyor..."}
                    {uploadStage === 'processing' && "İşlemler Oluşturuluyor..."}
                    {uploadStage === 'completed' && "Tamamlandı!"}
                    <span className="ml-2 text-sm text-gray-500">({Math.round(progress)}%)</span>
                  </div>
                ) : (
                  <div className="mt-2">
                    <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={handleRemoveFile}>
                      <X className="w-4 h-4 mr-1" /> Dosyayı Kaldır
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">
                  Belgeyi buraya sürükleyin
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  veya seçmek için tıklayın (PDF, JPG, PNG)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {!isUploading && file && (
            <Button variant="outline" onClick={handleDelete} disabled={isUploading}>
              İptal
            </Button>
          )}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="min-w-[120px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                İşleniyor
              </>
            ) : (
              "Analiz Başlat"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
