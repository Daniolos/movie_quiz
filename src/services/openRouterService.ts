import axios from 'axios';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

class OpenRouterService {
  private apiKey: string = '';

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Movie Quiz App',
    };
  }

  async generateWrongAnswers(
    triviaText: string,
    correctAnswer: string,
    movieTitle: string
  ): Promise<string[]> {
    try {
      console.log('[OpenRouterService] Generating wrong answers for trivia');

      const prompt = `Given this movie trivia about "${movieTitle}":
"${triviaText}"

The correct answer is: "${correctAnswer}"

Generate 3 plausible but INCORRECT alternative answers that could seem believable. The answers should be:
1. Related to movies or the film industry
2. Believable enough that someone might think they're correct
3. Different from the correct answer
4. Short and concise (similar length to the correct answer)

Return ONLY the 3 wrong answers as a JSON array of strings, nothing else. Example format:
["Wrong answer 1", "Wrong answer 2", "Wrong answer 3"]`;

      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        },
        {
          headers: this.getHeaders(),
        }
      );

      console.log('[OpenRouterService] API response:', response.data);

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      // Parse the JSON array from the response
      const wrongAnswers = JSON.parse(content.trim());

      if (!Array.isArray(wrongAnswers) || wrongAnswers.length !== 3) {
        throw new Error('Invalid response format');
      }

      console.log('[OpenRouterService] Generated wrong answers:', wrongAnswers);
      return wrongAnswers;
    } catch (error) {
      console.error('[OpenRouterService] Error generating wrong answers:', error);

      // Fallback generic wrong answers
      return [
        'This is not mentioned in the trivia',
        'This did not happen',
        'This is incorrect information',
      ];
    }
  }

  async validateApiKey(key: string): Promise<boolean> {
    try {
      this.setApiKey(key);

      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            {
              role: 'user',
              content: 'Say "OK"',
            },
          ],
        },
        {
          headers: this.getHeaders(),
        }
      );

      return !!response.data.choices[0]?.message?.content;
    } catch (error) {
      console.error('[OpenRouterService] API key validation failed:', error);
      return false;
    }
  }
}

export const openRouterService = new OpenRouterService();
