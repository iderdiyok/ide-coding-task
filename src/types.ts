export interface Product {
  id: string;
  type: string;
  price: number;
  promotionPrice?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageValidationError {
  type: 'format' | 'dimensions' | 'size';
  message: string;
}

export interface ImageUpload {
  file: File;
  preview: string;
  dimensions?: ImageDimensions;
  error?: ImageValidationError;
}