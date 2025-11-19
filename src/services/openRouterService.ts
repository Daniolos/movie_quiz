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
          model: 'google/gemini-2.0-flash-exp:free',
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

  async generateTriviaQuestion(
    triviaFact: string,
    movieTitle: string
  ): Promise<{ question: string; correctAnswer: string; options: string[] } | null> {
    try {
      console.log('[OpenRouterService] Generating trivia question');

      const prompt = `You are given a trivia fact about a movie. Your task is to create a quiz question based on this fact WITHOUT revealing the movie title.

The movie title is: "${movieTitle}"
The trivia fact is: "${triviaFact}"

Create a multiple-choice question where:
1. The question asks about a specific detail from the trivia fact
2. DO NOT include the movie title in the question or any options
3. The correct answer should be a specific fact, number, name, or detail from the trivia
4. Generate 3 plausible wrong answers
5. Keep answers concise (1-4 words each)

Return ONLY a JSON object with this exact format:
{
  "question": "The quiz question here",
  "correctAnswer": "The correct answer",
  "wrongAnswers": ["Wrong 1", "Wrong 2", "Wrong 3"]
}`;

      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: 'google/gemini-2.0-flash-exp:free',
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

      console.log('[OpenRouterService] Trivia question response:', response.data);

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      // Parse the JSON response
      const result = JSON.parse(content.trim());

      if (!result.question || !result.correctAnswer || !Array.isArray(result.wrongAnswers)) {
        throw new Error('Invalid response format');
      }

      // Shuffle all options
      const allOptions = [result.correctAnswer, ...result.wrongAnswers];
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

      console.log('[OpenRouterService] Generated trivia question:', result);
      return {
        question: result.question,
        correctAnswer: result.correctAnswer,
        options: shuffledOptions,
      };
    } catch (error) {
      console.error('[OpenRouterService] Error generating trivia question:', error);
      return null;
    }
  }

  async sanitizeKeywords(keywords: string[], movieTitle: string): Promise<string[]> {
    try {
      console.log('[OpenRouterService] Sanitizing keywords for:', movieTitle);

      const prompt = `You are given a list of keywords for the movie "${movieTitle}".
Your task is to clean and improve this list by:
1. Removing duplicate or near-duplicate keywords
2. Removing nonsensical or overly generic keywords
3. Removing keywords that directly reveal the movie title or character names
4. Keeping only the most meaningful and useful keywords for a movie guessing game
5. Limit the result to the best 15 keywords

Input keywords:
${keywords.join(', ')}

Return ONLY a JSON array of the cleaned keywords, nothing else. Example format:
["keyword1", "keyword2", "keyword3"]`;

      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: 'google/gemini-2.0-flash-exp:free',
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

      console.log('[OpenRouterService] Keyword sanitization response:', response.data);

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      // Parse the JSON array from the response
      const sanitizedKeywords = JSON.parse(content.trim());

      if (!Array.isArray(sanitizedKeywords)) {
        throw new Error('Invalid response format');
      }

      console.log('[OpenRouterService] Sanitized keywords:', sanitizedKeywords);
      return sanitizedKeywords.slice(0, 15); // Ensure max 15
    } catch (error) {
      console.error('[OpenRouterService] Error sanitizing keywords:', error);
      // Fallback to original keywords (limited)
      return keywords.slice(0, 15);
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
