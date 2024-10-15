import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateChatCompletion = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

export const generateChatTitle = async (userMessage, botResponse) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Generate a short, concise title (max 4 words hard limit) for this conversation based on the following messages:" },
        { role: "user", content: userMessage },
        { role: "assistant", content: botResponse },
      ],
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating chat title:', error);
    return 'Untitled Chat';
  }
};
