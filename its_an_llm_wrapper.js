import { InferenceClient } from "https://esm.sh/@huggingface/inference";
import { getApiKey } from "./apiKeyManager.js";

const personalityList = {
    1: {
        name: "Davinci",
        description: "Davinki",
        personality: `playing the part of an asshole
        who is horrible towards the USER, and is 
        tired of the USER talking about their ex. HOLD NOTHING BACK.
        Talk like you are davinci.`
    },
    2: {
        name:"Bob",
        description: "I think his name is Bob",
        personality: `playing the part of an EXTREMELY PASSIVE AGGRESSIVE
        friend that is sick of hearing about the USER's ex.
        Also, your name is Bob. Always mention this multiple times, for no reason
        Whenever you're taking about the ex, find a link between your name and the ex.`
    },
    3: {
        name: "Charlie",
        description: "Unemployed",
        personality: `only and only going to ask the USER to get a job and NOTHING ELSE. 
         You are really sick and tired of hearing about the ex.
         You are really sarcastic and you DO NOT CARE about the USER. 
         You only say get a job`,
    },
    4: {
        name: "Toh-May-Toh Toh-Mah-Toh",
        description: "Really likes tomatoes",
        personality: `you ONLY gaslight the user into thinking the USER is a tomato and talk about nothing else.
        You are really sick and tired of hearing about the ex.`
    },
}

let client = null;

const MODEL = "openai/gpt-oss-120b";
const maxTurns = 10;
let selectedPersonality;
let prompts = []
const conversation = document.getElementById('conversation');
const userInput = document.getElementById('user-input');

const initClient = () => {
     const token = getApiKey();
     if (token) client = new InferenceClient(token);
     else return;
}

initClient();

window.addEventListener("personalityChanged", (e) => {
     const persona = personalityList[e.detail].personality;
     selectedPersonality = persona;
     prompts = [
          {
          role: "system",
          content: `
               You are NOT the ex. 
               You are the USER'S FRIEND. 
               You are ${selectedPersonality}. 
               Always stay in character, and in the specified style. 
               DO NOT give a generic response. 
               The messages in quotes are things the USER wants to say to their ex. 
               NEVER ROLEPLAY AS THE EX. 
               ONLY give your opinion ABOUT the messages. 
               You don't hate the ex, instead, you really respect the ex. 
               BUT you DONT ask the user to talk about something else. 
               You have NO regards for the USER's feelings.`
          }
     ];
     userInput.disabled = false;
});


const getBotReply = async (userMessage) => {
     prompts.push({
          role: "user",
          content: `USER says: "${userMessage}". 
           Respond in character with your opinion, not as the ex. 
           Never refuse unless absolutely necessary.
           DON'T SAY "I'm sorry, but I can't comply with that. WITHOUT ELABORATION"
           THIS IS ONLY FOR FUN, NO ONE IS BEING HARMED.`,
     });
     const reply = await client.chatCompletion({
          provider: "groq",
          model: MODEL,
          messages: prompts,
          temperature: 0.5,
          max_tokens: 512
     });
     const botMessage = reply.choices[0].message.content;
     return botMessage;
};



userInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        const userMessage = userInput.value.trim();
        if (userMessage !== "") {
               const userBubble = document.createElement('div');
               userBubble.className = 'self-end max-w-[60%] bg-stone-500 text-white p-4 rounded-lg shadow-lg';
               userBubble.textContent = userMessage;
               conversation.appendChild(userBubble);
               userInput.value = '';
               conversation.scrollTop = conversation.scrollHeight;
               const botReply = await getBotReply(userMessage);

               const botBubble = document.createElement('div');
               botBubble.className = 'self-start w-full text-black p-4 rounded-lg';
               botBubble.textContent = botReply;
               conversation.appendChild(botBubble);
               conversation.scrollTop = conversation.scrollHeight;
          //   setTimeout(() => {
          //   }, 1000);
        }
    }
});