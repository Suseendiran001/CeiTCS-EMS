import React, { useState, useEffect } from 'react';
import { Upload, X, Check, AlertCircle, Clock, FileCheck, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | null;

interface DocumentUploaderProps {
  label: string;
  id: string;
  description?: string;
  onUpload: (file: File) => void;
  currentImage?: string | null;
  onRemove?: () => void;
  accept?: string;
  maxSizeMB?: number;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
  readOnly?: boolean;
  compact?: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  label,
  id,
  description = 'SVG, PNG, JPG or PDF (max. 5MB)',
  onUpload,
  currentImage,
  onRemove,
  accept = 'image/*,.pdf',
  maxSizeMB = 5,
  verificationStatus = null,
  rejectionReason = '',
  readOnly = false,
  compact = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Update preview URL when currentImage prop changes
  useEffect(() => {
    if (currentImage) {
      setPreviewUrl(currentImage);
    }
  }, [currentImage]);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (readOnly) return;
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (readOnly) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileSelected = (file: File) => {
    // Reset any previous errors
    setError(null);
    setSelectedFile(file);
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    // Check file type (if accept is specified)
    if (accept !== '*') {
      const fileType = file.type.split('/')[0];
      const isPdf = file.type === 'application/pdf';
      const acceptedTypes = accept.split(',').map(type => 
        type.trim().replace('*', '').replace('/', '')
      );
      
      if (accept.includes('image/') && !isPdf && fileType !== 'image') {
        setError('Only image or PDF files are accepted.');
        return;
      }
    }
    
    // Create a preview URL for the file
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setPreviewUrl('pdf-document');
    }
    
    // Mock upload progress
    setUploadProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        
        // Call the onUpload callback
        onUpload(file);
        
        // Reset progress after a delay
        setTimeout(() => {
          setUploadProgress(null);
        }, 500);
      } else {
        setUploadProgress(Math.min(progress, 99));
      }
    }, 100);
  };
  
  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };
  
  const handleRemove = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (onRemove) {
      onRemove();
    }
  };

  // Get badge based on verification status
  const getVerificationBadge = () => {
    if (!verificationStatus) return null;
    
    switch (verificationStatus) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 border border-green-200 gap-1">
            <FileCheck className="h-3 w-3" /> Verified
          </Badge>
        );
      case 'rejected':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="bg-red-100 text-red-800 border border-red-200 gap-1 cursor-help">
                  <FileX className="h-3 w-3" /> Rejected
                </Badge>
              </TooltipTrigger>
              {rejectionReason && (
                <TooltipContent>
                  <p className="max-w-xs">{rejectionReason}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        );
      case 'pending':
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 border border-amber-200 gap-1">
            <Clock className="h-3 w-3" /> Pending Verification
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center text-xs text-red-500">
              <AlertCircle className="h-3 w-3 mr-1" />
              {error}
            </div>
          )}
          {getVerificationBadge()}
        </div>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg transition-colors ${
          isDragOver 
            ? 'border-company-primary bg-company-light/30' 
            : error 
              ? 'border-red-200 bg-red-50'
              : verificationStatus === 'verified'
                ? 'border-green-200 bg-green-50/30'
                : verificationStatus === 'rejected'
                  ? 'border-red-200 bg-red-50/30'
                  : 'border-gray-200 hover:border-company-primary/50 hover:bg-gray-50'
        } ${readOnly ? 'pointer-events-none opacity-80' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative p-2">
            {previewUrl === 'pdf-document' || (typeof previewUrl === 'string' && previewUrl.endsWith('.pdf')) ? (
              <div className="h-40 flex items-center justify-center bg-gray-100 rounded">
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M9 15h6"/>
                    <path d="M9 11h6"/>
                  </svg>
                  <span className="text-gray-500 text-sm">PDF Document</span>
                </div>
              </div>
            ) : (
              <img 
                src={previewUrl} 
                alt={`${label} preview`} 
                className={`${compact ? 'max-h-32' : 'max-h-40'} max-w-full mx-auto rounded object-contain`}
              />
            )}
            
            {!readOnly && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4 h-8 w-8 shadow-sm"
                      onClick={handleRemove}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove {label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {verificationStatus === 'rejected' && rejectionReason && (
              <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md text-xs text-red-700">
                <strong>Reason for rejection:</strong> {rejectionReason}
              </div>
            )}
          </div>
        ) : (
          <div className={`${compact ? 'p-4' : 'p-6'} flex flex-col items-center justify-center`}>
            <Upload className={`${compact ? 'h-8 w-8 mb-1' : 'h-10 w-10 mb-2'} text-gray-400`} />
            
            {uploadProgress !== null ? (
              <div className="w-full max-w-xs space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-center text-gray-500">
                  {uploadProgress < 100 
                    ? `Uploading... ${Math.round(uploadProgress)}%` 
                    : <span className="flex items-center justify-center text-green-600">
                        <Check className="h-3 w-3 mr-1" /> Upload complete
                      </span>
                  }
                </p>
              </div>
            ) : (
              <>
                <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500 text-center`}>
                  {readOnly 
                    ? 'No document uploaded yet'
                    : 'Drag and drop your file here, or click to browse'
                  }
                </p>
                <p className="text-xs text-gray-400 mt-1 text-center">
                  {description}
                </p>
                {!readOnly && (
                  <label
                    htmlFor={id}
                    className={`mt-${compact ? '2' : '3'} inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 ${compact ? 'h-8 px-3 py-1 text-xs' : 'h-9 px-4 py-2'} cursor-pointer`}
                  >
                    Browse Files
                    <input
                      id={id}
                      type="file"
                      className="hidden"
                      accept={accept}
                      onChange={handleManualUpload}
                    />
                  </label>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;
