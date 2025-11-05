"use client";

import { useState, MouseEvent, ChangeEvent, DragEvent } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

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
  };

  const handleUpload = () => {
    if (file) {
      // Handle file upload logic here
      console.log("Uploading file:", file.name);
      alert(`'${file.name}' adlı dosya yükleniyor...`);
    }
  };

  const handleDelete = () => {
    setFile(null);
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
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer mt-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("file-upload-input")?.click()}
        >
          <Input
            type="file"
            id="file-upload-input"
            className="hidden"
            onChange={handleFileChange}
          />
          {file ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <FileIcon className="w-12 h-12 text-gray-500" />
                <p className="ml-2 text-gray-700">{file.name}</p>
                <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="w-12 h-12 text-gray-500" />
              <p className="mt-4 text-gray-600">
                Dosyanızı buraya sürükleyip bırakın veya seçmek için tıklayın
              </p>
              <p className="text-sm text-gray-500 mt-1">
                (PDF, DOCX, PNG, JPG, vb.)
              </p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={handleDelete} disabled={!file}>
            Sil
          </Button>
          <Button onClick={handleUpload} disabled={!file}>
            Yükle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
