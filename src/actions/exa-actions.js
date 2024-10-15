import Exa from 'exa-js';
import { generateChatCompletion } from './openai-actions'; // Make sure this import is correct

const exa = new Exa("Exa API Key");

export const performExaSearch = async (query) => {
  try {
    const result = await exa.searchAndContents(query, {
      type: "neural",
      useAutoprompt: true,
      numResults: 4,
      text: true,
      summary: true
    });

    // Generate a summary using OpenAI
    const sourcesText = result.results.map(r => `${r.title}\n${r.text}`).join('\n\n');
    const summaryPrompt = `Summarize the following information from multiple sources about "${query}":\n\n${sourcesText}\n\nProvide a concise summary:`;
    
    const summary = await generateChatCompletion(summaryPrompt);

    return {
      results: result.results,
      summary: summary
    };
  } catch (error) {
    console.error('Error performing Exa search:', error);
    throw error;
  }
};


