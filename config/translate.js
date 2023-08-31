const axios = require('axios');

async function translateText(sourceLanguage, targetLanguage, text) {
  const options = {
    method: 'POST',
    url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
    params: {
      'to[0]': targetLanguage,
      'api-version': '3.0',
      profanityAction: 'NoAction',
      textType: 'plain',
    },
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'fc434d978fmshfb92ed2fc665174p179066jsn16f07318851a',
      'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
    },
    data: [
      {
        Text: text,
      },
    ],
  };

  try {
    const response = await axios.request(options);
    return response.data[0].translations[0].text;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  translateText,
};
