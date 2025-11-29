import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import dotenv, { config } from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: process.env.OPENAI_API_KEY // Use the API key from the .env file
});

// Create and manage a conversation thread
const thread = await openai.beta.threads.create();

app.post('/get-response', async (req, res) => {
    try {

        // Step 1: Get User Message
        const userMessage = req.body.message;

        // Step 2: Add User Message to Thread
        await openai.beta.threads.messages.create(
            thread.id,
            { role: "user", content: userMessage }
        );

        // Step 3: Run the Assistant to Generate a Response
        const run = await openai.beta.threads.runs.createAndPoll(
            thread.id,
            { assistant_id: "asst_CicC8f9zfehZ7NTs1acUNAQi" }
        );

        //Get latestest bot response
        let botResponse = 'The assistant is still processing. Please try again.';
        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(
              run.thread_id
            );
            for (const message of messages.data.reverse()) {
                botResponse = message.content[0].text.value;
              }
          } else {
            console.log(run.status);
        }

        //display all responses in console
        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(
              run.thread_id
            );
            for (const message of messages.data.reverse()) {
              console.log(`${message.role} > ${message.content[0].text.value}`);
            }
          } else {
            console.log(run.status);
          }
        
        //return bot response
        res.json({ botResponse });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong!', details: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
