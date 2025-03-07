```
import OpenAI from "openai";
import dotenv from "dotenv";


dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    store: true,
    messages: [
        {"role": "user", "content": "write a haiku about ai"}
    ]
});
print(completion);
```
