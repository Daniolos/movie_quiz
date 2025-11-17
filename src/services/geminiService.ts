import axios from 'axios';
import { GeminiImageRequest } from '@/types/api.types';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

class GeminiService {
  private apiKey: string = '';

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  async generateImage(request: GeminiImageRequest): Promise<string | null> {
    try {
      const response = await axios.post(
        `${GEMINI_API_BASE}/models/gemini-2.5-flash-image:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: request.prompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['IMAGE'],
            temperature: 1.0,
            topP: 0.95,
            topK: 40,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Extract image from response
      const candidates = response.data.candidates;
      if (candidates && candidates.length > 0) {
        const parts = candidates[0].content.parts;
        const imagePart = parts.find((part: any) => part.inlineData);

        if (imagePart && imagePart.inlineData) {
          // Return base64 encoded image
          return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        }
      }

      return null;
    } catch (error: any) {
      console.error('Error generating image:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || 'Failed to generate image'
      );
    }
  }

  async generateMovieImage(
    movieTitle: string,
    genre: string,
    aspectRatio: '1:1' | '16:9' | '9:16' = '16:9'
  ): Promise<string | null> {
    const prompt = `Create a cinematic, dramatic movie poster style image for the movie "${movieTitle}".
    Genre: ${genre}.
    The image should be highly detailed, atmospheric, and capture the essence of the film without showing text or titles.
    Professional movie poster aesthetic with dramatic lighting.`;

    return this.generateImage({ prompt, aspectRatio });
  }

  async generateKeywordImage(
    keyword: string,
    movieContext: string
  ): Promise<string | null> {
    const prompt = `Create an artistic, cinematic visual representation of the concept "${keyword}" in the context of ${movieContext}.
    Highly detailed, dramatic lighting, movie scene aesthetic. No text or words.`;

    return this.generateImage({ prompt, aspectRatio: '1:1' });
  }

  async generateDescriptionImage(
    description: string,
    movieTitle: string
  ): Promise<string | null> {
    const prompt = `Create a dramatic cinematic scene depicting: ${description}.
    This is for the movie "${movieTitle}".
    Highly detailed, atmospheric, professional movie cinematography style. No text or words.`;

    return this.generateImage({ prompt, aspectRatio: '16:9' });
  }

  async validateApiKey(key: string): Promise<boolean> {
    try {
      this.setApiKey(key);

      // Test with a simple generation request
      const response = await axios.post(
        `${GEMINI_API_BASE}/models/gemini-2.5-flash-image:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: 'A simple test image',
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['IMAGE'],
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error('Gemini API key validation failed:', error);
      return false;
    }
  }
}

export const geminiService = new GeminiService();
