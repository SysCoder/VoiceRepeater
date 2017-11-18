# VoiceRepeater
Actions on Google Dialog Flow add-on. VoiceRepeater is a drop in module that repeats the last prompt with a prefix.

# You need to run the following in the directory of your package.json:
npm install voice-repeater --save

# You need to add something like the following to your code:
If you are following the action map pattern, there are three things you need to do in the code
* Add require statement
* Add function handler
* Register function handler

```javascript
const VoiceRepeater = require('voice-repeater').VoiceRepeater; // Add require statement

exports.yourFunction = functions.https.onRequest((request, response) => {
    ...
    let voiceRepeater = new VoiceRepeater(app);  // Add function handler
    function repeatLastStatment(app) {
      app.ask(voiceRepeater.lastPromptWithPrefix()); 
    }
    const actionMap = new Map();
    actionMap.set('repeat_last_statement', repeatLastStatment); // Register function handler
    app.handleRequest(actionMap);
});
```

# Add changes to API.AI
You should create an intent that will trigger when you want the voice app to repeat itself.
