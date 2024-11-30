// Select elements from the DOM
const audio = new Audio('click-234708.mp3');

const chatHistory = document.getElementById("chat-history");
const userMessageInput = document.getElementById("user-message");
const sendMessageButton = document.getElementById("send-message");

let recyclingLevel = 0;
let totalProjects = 0;

// Append messages to chat history
function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.className = sender;
    messageDiv.textContent = message;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Awards based on recycling level
function awards(recyclingLevel) {
    let award = "";
    if (recyclingLevel === 1) award = "Junior Engineer";
    else if (recyclingLevel === 3) award = "Aspiring Scientist";
    else if (recyclingLevel === 5) award = "Innovation Leader";
    else if (recyclingLevel === 7) award = "STEM Champion";
    else if (recyclingLevel === 9) award = "Future Engineer";

    if (award) {
        sendMessage(`🎉 Congratulations! You have won an award for recycling ${recyclingLevel} materials: ${award}!`);
    }
}

// Instructions for different projects
function getInstructions(material, project) {
    const instructions = {
        "paper windmill": `Instructions for making a Paper Windmill:
        1. Cut a square piece of paper and fold it diagonally both ways.
        2. Make cuts the diagonal lines, stopping short of the center.
        3. Fold every other corner to the center and pin them in place.
        4. Attach the windmill to a stick or straw and observe how it spins in the wind.
        To continue, enter a material (e.g., paper, plastic bottle, cardboard, can, plastic bag) or 'exit'.`,
        "plastic bottle solar heater": `Instructions for making a Solar Water Heater:
        1. Paint plastic bottles black and arrange them in a series.
        2. Connect them using tubing to form a water loop.
        3. Place the setup under direct sunlight and measure the water temperature.
        To continue, enter a material (e.g., paper, plastic bottle, cardboard, can, plastic bag) or 'exit'.`,
        "cardboard periscope": `Instructions for making a Periscope:
        1. Use two mirrors and cardboard to construct a tube.
        2. Position the mirrors at 45-degree angles inside the tube.
        3. Test how the periscope lets you see around obstacles. 
        To continue, enter a material (e.g., paper, plastic bottle, cardboard, can, plastic bag) or 'exit'.`,
        "can battery": `Instructions for making a Simple Battery:
        1. Use an aluminum can, copper wire, and a saltwater solution.
        2. Connect the aluminum and copper to form a basic circuit.
        3. Measure the voltage produced. 
        To continue, enter a material (e.g., paper, plastic bottle, cardboard, can, plastic bag) or 'exit'.`,
        "plastic bag parachute": `Instructions for making a Parachute:
        1. Cut a plastic bag into a square and attach strings to its corners.
        2. Tie the strings to a small weight or object.
        3. Drop it from a height and observe how it slows the fall. 
        To continue, enter a material (e.g., paper, plastic bottle, cardboard, can, plastic bag) or 'exit'.`,
    };
    return instructions[`${material} ${project}`] || "Instructions not available.";
}

// Split instructions into separate messages
function sendInstructions(instructions) {
    const steps = instructions.split("\n").filter(step => step.trim() !== ""); // Split into lines and filter empty lines
    steps.forEach((step, index) => {
        // Delay each step to create a sequential effect
        setTimeout(() => {
            sendMessage(step.trim());
        }, index * 2000); // Adjust delay (e.g., 2000ms) for pacing
    });
}

// Generate response based on user input
function generateResponse(material) {
    material = material.toLowerCase();
    let response = "";
    let project = "";

    if (material.includes("paper")) {
        project = "windmill";
        response = `Idea: Create a paper windmill to learn about aerodynamics! 💨`;
    } else if (material.includes("plastic bottle")) {
        project = "solar heater";
        response = `Idea: Build a solar water heater using plastic bottles. ☀️`;
    } else if (material.includes("cardboard")) {
        project = "periscope";
        response = `Idea: Build a periscope to explore optics. 👁️`;
    } else if (material.includes("can")) {
        project = "battery";
        response = `Idea: Create a simple battery using aluminum cans and learn about chemistry.🔋`;
    } else if (material.includes("plastic bag")) {
        project = "parachute";
        response = `Idea: Create a parachute to study air resistance.🪂`;
    } else {
        response = "Sorry, I don't have any ideas for that material yet. Try another one!🙁";
    }

    if (response && project) {
        sendMessage(response);
        setTimeout(() => {
            const showInstructions = confirm("Would you like to see instructions for this project?");
            if (showInstructions) {
                const instructions = getInstructions(material, project);
                sendInstructions(instructions); // Call the new sendInstructions function
                recyclingLevel++;
                totalProjects++;
                awards(recyclingLevel);
            }
            else {
                sendMessage("Thank you for your idea! Keep recycling!😊");
            }
        }, 3000);
    } else {
        sendMessage(response);
    }
}

// Modified sendMessage function with typing animation
function sendMessage(message, delay = 1000) {
    // Create a message element for the chatbot's response
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "Chatbot");
    chatHistory.appendChild(messageElement);

    setTimeout(() => { // Delay before starting the animation
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < message.length) {
                if (message[index] === "\n") {
                    messageElement.innerHTML += "<br>";
                } else {
                    messageElement.innerHTML += message[index];
                }
                index++;
            } else {
                clearInterval(typingInterval);
            }
            chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll as typing progresses
        }, 20); // Typing speed: 20ms per character
    }, delay); // Delay before starting the animation
}

// Event listener for the send button
sendMessageButton.addEventListener("click", () => {    audio.play();
    const userMessage = userMessageInput.value.trim();
    if (userMessage === "") return;

    appendMessage("User", userMessage);

    if (userMessage.toLowerCase() === "exit") {
        sendMessage("Goodbye! Keep innovating and recycling!");
        userMessageInput.disabled = true;
        sendMessageButton.disabled = true;
    } else {
        generateResponse(userMessage);
    }

    userMessageInput.value = "";
});

// Introduction with line breaks
sendMessage("Welcome to the Recycling EngineerBot, an AI-powered chatbot designed to help kids learn engineering through projects using recyclable materials. 🌎🌳🥬", 0);
sendMessage("Let's get started! What material would you like to learn about? Enter a material (e.g., paper, plastic bottle, cardboard, can, plastic bag):", 3500);
sendMessage("Type 'exit' to leave the chatbot.", 7000);
sendMessageButton.addEventListener("click", () => {
    audio.play().catch(error => console.error("Audio playback failed:", error));
});
audio.volume = 1.0; // Full volume
