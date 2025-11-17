export interface GeminiImageRequest {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
  negativePrompt?: string;
  numberOfImages?: number;
}

export interface GeminiImageResponse {
  images: string[];
  error?: string;
}

export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

export interface APIValidationResult {
  valid: boolean;
  message: string;
  remainingQuota?: number;
}
