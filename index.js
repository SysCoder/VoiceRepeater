'use strict';

const REPEAT_PREFIX = [
  "Sorry, I said: ",
  "Let me repeat that. ",
  "Sure, I said: ",
  "I said: "
];

class VoiceRepeater {
  constructor(app) {
    const originalAsk = app.ask.bind(app);
    this.app = app;
    let lastPromptWithPrefix = this.lastPromptWithPrefix.bind(this);
    let lastPrompt = this.lastPrompt.bind(this);
    app.ask = function (response) {
      let textToSpeech = "";
      if (response.hasOwnProperty("items")) {
        for (let item of response.items) {
          if (item.hasOwnProperty("simpleResponse")) {
            let simpleResponse = item.simpleResponse;
            if (simpleResponse.hasOwnProperty("textToSpeech")) {
              textToSpeech = simpleResponse.textToSpeech;
            }
          }
        }
      } else if (response.hasOwnProperty("speech")) {
        textToSpeech = response.speech;
      } else if (typeof response !== 'object') {
        textToSpeech = response;
      }

      // Check to see if last prompt was a repeat prompt with prefix.
      if (textToSpeech === lastPromptWithPrefix()) {
        textToSpeech = lastPrompt();
      }

      const ssmlOpenTag = "<SSML>";
      let repeatPrefix = getRandomeElementInArray(REPEAT_PREFIX);
      const lastStatement = textToSpeech;

      if (lastStatement.startsWith(ssmlOpenTag)) {
        lastStatement = lastStatement.slice(ssmlOpenTag.length);
        repeatPrefix = ssmlOpenTag + repeatPrefix;
      }

      app.setContext("last_prompt", 100,
        {
          "last_prompt": textToSpeech,
          "prefixed_last_prompt": repeatPrefix + lastStatement,
        });
      originalAsk(response);
    }
  }

  lastPromptWithPrefix() {
     return this.app.getContext("last_prompt") !== null
         ? this.app.getContextArgument("last_prompt", "prefixed_last_prompt").value
         : "um....I don't remember what I said!";
  }

  lastPrompt() {
    return this.app.getContext("last_prompt") !== null
        ? this.app.getContextArgument("last_prompt", "last_prompt").value
        : "um....I don't remember what I said!";
  }
}

function getRandomeElementInArray(someArray) {
  return someArray[Math.floor(Math.random()*someArray.length)]
}

exports.VoiceRepeater = VoiceRepeater;
