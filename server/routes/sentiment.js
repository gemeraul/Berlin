const express = require('express');

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /sentiment.
const recordRoutes = express.Router();

// Google Natural Language API connection
const language = require('@google-cloud/language');
const languageClient = new language.LanguageServiceClient();

// This section will help you get a sentiment analysis for a given text
recordRoutes.route('/sentiment').post(async function (req, res) {

  const document = {
    content: req.body.text,
    type: 'PLAIN_TEXT',
  };

  // Detects the sentiment of the text
  const [result] = await languageClient.analyzeSentiment({document: document});
  const sentiment = result.documentSentiment;
  console.log(sentiment)
  res.status(200).json({
    message: 'Successfully analyzed text.',
    score: sentiment.score
  })
});


module.exports = recordRoutes;
