import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useInstallPluginFromFile } from '@/queries/plugin.query-options';
import { Upload, X, FileArchive, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UploadPluginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadPluginDialog({ open, onOpenChange }: UploadPluginDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const installMutation = useInstallPluginFromFile();

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.name.endsWith('.zip')) {
      alert('Please select a .zip file');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('File size must be less than 50MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    installMutation.mutate(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);
        onOpenChange(false);
      },
    });
  };

  const handleCancel = () => {
    setSelectedFile(null);
    onOpenChange(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Install Plugin from File</DialogTitle>
          <DialogDescription>
            Upload a plugin package (.zip) to install it on your system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Upload Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors
              ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${selectedFile ? 'bg-muted/50' : 'hover:bg-muted/50'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileInput}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <FileArchive className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm">
                    Drag and drop plugin file here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports .zip files up to 50MB
                </p>
              </div>
            )}
          </div>

          {/* Warning */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Only install plugins from trusted sources. Malicious plugins can compromise your system security.
            </AlertDescription>
          </Alert>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Requirements:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Valid plugin package in .zip format</li>
              <li>Must contain manifest.json and index.js</li>
              <li>All dependencies listed in package.json</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={installMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || installMutation.isPending}
          >
            {installMutation.isPending ? (
              <>
                <span className="mr-2">Installing...</span>
                <span className="animate-spin">⏳</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Install Plugin
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
