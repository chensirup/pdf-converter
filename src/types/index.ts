export interface ConversionTool {
  id: string;
  title: string;
  description: string;
  image: string;
  from: string;
  to: string;
  acceptTypes: string;
}

export interface FileState {
  file: File | null;
  name: string;
  size: number;
  type: string;
}

export interface ConversionStatus {
  isConverting: boolean;
  progress: number;
  error: string | null;
  result: Blob | null;
}
