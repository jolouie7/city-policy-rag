'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export function FileUpload({ onUpload, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={`p-12 border-2 border-dashed transition-all duration-300 cursor-pointer group ${
        isDragging 
          ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg' 
          : 'border-border hover:border-primary/50 hover:bg-muted/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={disabled ? undefined : handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <div className="text-center space-y-6">
        <div className="text-6xl group-hover:scale-110 transition-transform duration-300">📄</div>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Drop your PDF here or click to browse</p>
          <p className="text-sm text-muted-foreground">
            Only PDF files are supported
          </p>
        </div>
        <Button 
          type="button" 
          variant="secondary" 
          disabled={disabled}
          className="shadow-sm hover:shadow-md transition-all"
          size="lg"
        >
          Select File
        </Button>
      </div>
    </Card>
  );
}
