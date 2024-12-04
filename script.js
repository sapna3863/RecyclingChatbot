// Constants
const CONSTANTS = {
    AUDIO_FILE: 'Sounds/click-234708.mp3',
    DONEAUDIO_FILE: 'Sounds/decidemp3-14575.mp3',
    CHAT_HISTORY_ID: "chat-history",
    USER_MESSAGE_ID: "user-message",
    SEND_BUTTON_ID: "send-message",
};

// Initialize Audio
const audio = new Audio(CONSTANTS.AUDIO_FILE);
const doneaudio = new Audio(CONSTANTS.DONEAUDIO_FILE);
audio.volume = 1.0; // Click sound
doneaudio.volume = 0.5; // Done sound

audio.addEventListener("canplaythrough", () => console.log("Click audio is ready to play."));
doneaudio.addEventListener("canplaythrough", () => console.log("Done audio is ready to play."));
audio.addEventListener("error", () => console.error("Failed to load click audio."));
doneaudio.addEventListener("error", () => console.error("Failed to load done audio."));

// Retrieve DOM Elements
const chatHistory = document.getElementById(CONSTANTS.CHAT_HISTORY_ID);
const userMessageInput = document.getElementById(CONSTANTS.USER_MESSAGE_ID);
const sendMessageButton = document.getElementById(CONSTANTS.SEND_BUTTON_ID);

// Ensure elements exist
if (!chatHistory || !userMessageInput || !sendMessageButton) {
    console.error("Critical elements missing from DOM.");
}

// State Variables
let recyclingLevel = 0;
let totalProjects = 0;

// Award Levels
const awardLevels = {
    1: "Junior Engineer",
    3: "Aspiring Scientist",
    5: "Innovation Leader",
    7: "STEM Champion",
    9: "Future Engineer",
};

// Instruction Templates
const instructionsTemplate = {
    "windmill": {
        material: "Paper",
        steps: [
            "Cut a square piece of paper, about 10x10 cm in size.",
            "Fold the paper diagonally from corner to corner, then unfold.",
            "Make cuts along the diagonal lines, stopping about 2-3 cm from the center.",
            "Fold every other corner to the center and secure them with a pin or glue.",
            "Attach the windmill to a stick or straw using glue or a pin, then observe how it spins when placed in the wind.",
        ],
    },
    "solar heater": {
        material: "Plastic Bottle",
        steps: [
            "Paint plastic bottles black to absorb more heat from the sun.",
            "Cut the bottoms off the bottles and arrange them in a line or circle, leaving space for tubing between each bottle.",
            "Connect the bottles using clear plastic tubing to form a closed water loop.",
            "Place the setup under direct sunlight and wait for it to warm up.",
            "Measure the water temperature after 30 minutes to see how much heat has been absorbed.",
        ],
    },
    "periscope": {
        material: "Cardboard",
        steps: [
            "Take two small mirrors (or reflective plastic) and cut them to fit inside a cardboard tube.",
            "Cut the cardboard into two sections, one to form the body and the other to hold the mirrors at 45-degree angles.",
            "Position the mirrors inside the tube, with each mirror at a 45-degree angle, to reflect the light from one end to the other.",
            "Seal the mirrors in place with glue, then look through one end to see around corners or over obstacles.",
        ],
    },
    "parachute": {
        material: "Plastic Bag",
        steps: [
            "Cut a square or rectangular shape from a plastic bag, about 30x30 cm for a standard parachute.",
            "Tie four strings (around 10 cm long each) to the four corners of the plastic piece.",
            "Attach the other ends of the strings to a small weight (such as a toy or small object).",
            "Drop the parachute from a height and observe how it slows down the descent of the object.",
            "Experiment with different materials and shapes to see how it affects the fall speed.",
        ],
    },
    "pendulum": {
        material: "Bottle Cap",
        steps: [
            "Take a plastic bottle cap and tie a string through a small hole in the center.",
            "Secure the other end of the string to a stationary object or hold it in your hand.",
            "Pull the bottle cap back to one side and release it to swing like a pendulum.",
            "Experiment with different lengths of string to see how it affects the swinging time.",
        ],
    },
    "planter": {
        material: "Egg Carton",
        steps: [
            "Take an empty egg carton and cut off the lid, leaving the bottom section with individual cups.",
            "Fill each cup with potting soil or compost.",
            "Plant small seeds (like herbs or flowers) in each compartment.",
            "Water the plants regularly and place them in a sunny spot.",
            "Once the plants grow, you can transplant them into larger pots or a garden bed.",
        ],
    },
    "recycled art": {
        material: "Magazines",
        steps: [
            "Take old magazines and cut out colorful pictures or patterns.",
            "Use these cutouts to create a collage on a piece of cardboard or canvas.",
            "Glue the cutouts in an artistic design to form your own recycled art masterpiece.",
            "Experiment with layering and mixing different textures to enhance your artwork.",
        ],
    },
    "wind spinner": {
        material: "Plastic Straw",
        steps: [
            "Take a plastic straw and bend it slightly to form a curved shape.",
            "Cut a piece of paper into a spiral shape, and attach it to the end of the straw using glue or tape.",
            "Make sure the paper is light enough to spin when the wind blows.",
            "Place the wind spinner outside on a windy day and watch it spin in the breeze.",
        ],
    },
    "recycled paper": {
        material: "Newspaper",
        steps: [
            "Tear up old newspapers into small pieces and soak them in water for 1-2 hours.",
            "Blend the soaked newspaper with water until it forms a thick pulp.",
            "Spread the pulp out evenly on a flat surface, using a screen or mesh to drain excess water.",
            "Once it’s mostly dry, peel off the pulp and let it air dry for a few more hours.",
            "Use your recycled paper for writing, drawing, or crafting!",
        ],
    },
};


// Functions
function appendMessage(person, message, delay = 1000) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", person); // Assign the correct sender class (user or bot)
    messageDiv.textContent = message;

    const isNearBottom = chatHistory.scrollTop + chatHistory.clientHeight >= chatHistory.scrollHeight - 50;

    // Disable input before appending the message
    userMessageInput.disabled = true;
    sendMessageButton.disabled = true;

    setTimeout(() => {
        chatHistory.appendChild(messageDiv);
        // Scroll to the bottom if near the bottom
        if (isNearBottom) {
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }

        // Re-enable input after the message is appended
        userMessageInput.disabled = false;
        sendMessageButton.disabled = false;
    }, delay);
}
function awards(level) {
    if (awardLevels[level]) {
        sendMessage(`🎉 Congratulations! You have won an award for recycling ${level} materials: ${awardLevels[level]}!`);
    }
}

function getInstructions(project) {
    const template = instructionsTemplate[project];
    if (template) {
        return `Instructions for making a ${template.material} ${project}:\n${template.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}\nTo continue, enter a material or 'exit'.`;
    }
    return "Instructions not available.";
}

function typingAnimation(element, message, typingSpeed = 20, callback) {
    let index = 0;
    const interval = setInterval(() => {
        if (index < message.length) {
            element.innerHTML += message[index] === "\n" ? "<br>" : message[index];
            index++;
        } else {
            clearInterval(interval);
            if (callback) callback();
            doneaudio.play().catch(error => console.error("Done audio playback failed:", error));
        }
    }, typingSpeed);
}

function sendMessage(message, delay = 1000) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "Chatbot");
  chatHistory.appendChild(messageElement);

  // Disable input while typing
  userMessageInput.disabled = true;
  sendMessageButton.disabled = true;

  setTimeout(() => {
    typingAnimation(messageElement, message, 20, () => {
      chatHistory.scrollTop = chatHistory.scrollHeight;
      // Re-enable input after the message is finished
      userMessageInput.disabled = false;
      sendMessageButton.disabled = false;
    });
  }, delay);
}

function sendInstructions(instructions) {
    const steps = instructions.split("\n").filter(step => step.trim() !== "");
    steps.forEach((step, index) => {
        setTimeout(() => {
            appendMessage("Chatbot",step.trim(),0);
            // Re-enable input after the last instruction is sent
            if (index === steps.length - 1) {
                userMessageInput.disabled = false;
                sendMessageButton.disabled = false;
            }
        }, index * 2000);
    });
}

function generateResponse(material) {
    material = material.toLowerCase();
    let response = "";
    let project = "";

    // Check for recyclable materials and assign appropriate projects
    if (material.includes("paper")) {
        project = "windmill";
        response = `Idea: Create a paper windmill to learn about aerodynamics! 💨`;
    } else if (material.includes("plastic bottle")) {
        project = "solar heater";
        response = `Idea: Build a solar water heater using plastic bottles. ☀️`;
    } else if (material.includes("cardboard")) {
        project = "periscope";
        response = `Idea: Build a periscope to explore optics. 👁️`;
    } else if (material.includes("plastic bag")) {
        project = "parachute";
        response = `Idea: Create a parachute to study air resistance.🪂`;
    } else if (material.includes("bottle cap")) {
        project = "pendulum";
        response = `Idea: Build a pendulum with a bottle cap to study motion and physics. 🏗️`;
    } else if (material.includes("egg carton")) {
        project = "planter";
        response = `Idea: Use an egg carton to create a small planter for growing seeds. 🌱`;
    } else if (material.includes("magazines")) {
        project = "recycled art";
        response = `Idea: Use old magazines to create unique recycled art pieces. 🎨`;
    } else if (material.includes("plastic straw")) {
        project = "wind spinner";
        response = `Idea: Create a wind spinner using plastic straws to explore the power of wind. 🌬️`;
    } else if (material.includes("newspaper")) {
        project = "recycled paper";
        response = `Idea: Make your own recycled paper from old newspapers. 📰`;
    } else {
        response = "Sorry, I don't have any ideas for that material yet. Try another one! 🙁";
    }

    // If a valid project is found, offer instructions
    if (response && project) {
        sendMessage(response);
        setTimeout(() => {
            const showInstructions = confirm("Would you like to see instructions for this project?");
            if (showInstructions) {
                const instructions = getInstructions(project);
                sendInstructions(instructions);
                recyclingLevel++;
                totalProjects++;
                awards(recyclingLevel);
            } else {
                sendMessage("Thank you for your idea! Keep recycling! 😊");
            }
        }, 3000);
    } else {
        sendMessage(response);
    }
}


// Event Listeners
sendMessageButton.addEventListener("click", () => {
    audio.play().catch(error => console.error("Click audio playback failed:", error));
    const userMessage = userMessageInput.value.trim();
    if (userMessage === "") return;

    appendMessage("user", userMessage, 0);

    if (userMessage.toLowerCase() === "exit") {
        appendMessage("Chatbot", "Goodbye! Keep innovating and recycling!", 0);
        userMessageInput.disabled = true;
        sendMessageButton.disabled = true;
    } else {
        generateResponse(userMessage);
    }

    userMessageInput.value = "";
});

// Introduction Messages
sendMessage("Welcome to the Recycling EngineerBot, an AI-powered chatbot designed to help kids learn engineering through projects using recyclable materials. 🌎🌳🥬", 0);
sendMessage("Let's get started! What material would you like to learn about? Enter a material (e.g., paper, plastic bottle, cardboard, plastic bag, bottle cap, egg carton, magazines, plastic straw, newspaper, recycled paper):", 3500);
appendMessage("Chatbot","Type 'exit' to leave the chatbot.", 8000);