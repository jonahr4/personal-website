//JONAH ROTHMAN STOCKBOT JAVASCRIPT
//sk-2pyZBm9kyq-HIVqTQhDM4MeW25QGQs7ZM4ptaY6SloT3BlbkFJZulvQj6Wi-jVx2GwDj7vygkCu7UFx32cItxwriJ6IA

// When User Sends a message to the bot by clicking the send button
document.getElementById('send-btn').addEventListener('click', sendMessage);

// When User Presses Enter key in the input field
document.getElementById('chat-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Add event listener to the New Chat button
document.getElementById('newchat-btn').addEventListener('click', startNewChat);

// Function to start a new chat
async function startNewChat() {
    // Clear the chat display
    const chatDisplay = document.getElementById('chat-display');
    chatDisplay.innerHTML = ''; // Clear all messages

    //Display Chatbot Greeting Response
    const botResponse = await getBotResponse("New chat Message clicked. All messages are wiped. Greet user for a new chat");

    // Convert newline characters to <br> tags
    const botMessage = document.createElement('p');
    botMessage.innerHTML = botResponse.replace(/\n/g, '<br>'); // Convert \n to <br>
    botMessage.classList.add('bot-message');
    chatDisplay.appendChild(botMessage);
}

//Funcrtion to display message on the chatbox
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const chatDisplay = document.getElementById('chat-display');

    if (input.value.trim()) { //if not an empty string

        //Display user message
        const userMessage = document.createElement('p');
        userMessage.textContent = input.value;
        const userTxt = input.value;
        userMessage.classList.add('user-message');
        chatDisplay.appendChild(userMessage);

        //Clear input field
        input.value = '';

        // Scroll to the bottom of the chat display
        chatDisplay.scrollTop = chatDisplay.scrollHeight;


        //Display Chatbot Response
        const botResponse = await getBotResponse(userTxt);

        // Convert newline characters to <br> tags
        const botMessage = document.createElement('p');
        botMessage.innerHTML = botResponse.replace(/\n/g, '<br>'); // Convert \n to <br>
        botMessage.classList.add('bot-message');
        chatDisplay.appendChild(botMessage);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
}



async function getBotResponse(userText) {
    try {
        //const response = await fetch('http://localhost:3000/get-response', {
        const response = await fetch('https://stockbot-crbd.onrender.com/get-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userText }),
        });
        const data = await response.json();
        return data.botResponse;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, something went wrong.';
    }
}
