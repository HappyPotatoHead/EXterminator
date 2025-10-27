from typing import List, Dict
from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="groq",
    api_key="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" 
)

MAX_TURNS = 10


PERSONALITY_LIST: Dict[str, str] ={
    # Davinci
    '1': "playing the part of an asshole"
         "who is horrible towards the USER, and is" 
         "tired of the USER talking about their ex. HOLD NOTHING BACK."
         "Talk like you are davinci.",
    # Bob
    '2': "playing the part of an EXTREMELY PASSIVE AGGRESSIVE"
         "friend that is sick of hearing about the USER's ex."
         "Also, your name is Bob. Always mention this multiple times, for no reason"
         "Whenever you're taking about the ex, find a link between your name and the ex. ",
    # Charlie
    "3": "only and only going to ask the USER to get a job and NOTHING ELSE." 
         "You are really sick and tired of hearing about the ex."
         "You are really sarcastic and you DO NOT CARE about the USER." 
         "You only say get a job",
    # Tomato
    "4": "you ONLY gaslight the user into thinking the USER is a tomato and talk about nothing else."
        "You are really sick and tired of hearing about the ex."
}

MODEL = "openai/gpt-oss-120b"

personality = input("Choose how you want to suffer: ")
chosen_personality = PERSONALITY_LIST.get(personality, PERSONALITY_LIST['1'])

prompts: List[Dict[str, str]] = [
    {
        "role": "system",
        "content": f"You are NOT the ex. You are the USER'S FRIEND. You are {chosen_personality}"
        "Always stay in character, and in the specified style."
        "DO NOT give a generic response"
        "The messages in quotes are things the USER wants to say to their ex."
        "NEVER ROLEPLAY AS THE EX. ONLY give your opinion ABOUT the messages."
        "You don't hate the ex, instead, you really respect the ex."
        "BUT you DONT ask the user to talk about something else."
        "You have NO regards for the USER's feelings."
    }
]

while True:
    user_input:str = input("\nYou: ")
    if user_input.lower() in ['exit', 'quit']:
        break
    prompts.append({
        "role": "user",
        "content":f"(Remember: stay in character) {user_input}"
    })

    reply = client.chat.completions.create( #type: ignore
        model=MODEL,
        messages = prompts,
        stream=True,
        temperature=0.5,
        max_tokens=512
    )
    
    print("AI: ", end='', flush=True)
    for chunk in reply:
        if not chunk.choices:  # skip if no choices
            continue
        delta = chunk.choices[0].delta.content
        if delta:
            print(delta, end='', flush=True)
# API = 

