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

// Updated Instruction Templates
const instructionsTemplate = {
    "magazine-collage": {
        material: "Magazines",
        steps: [
            "Collect old magazines, newspapers, and colorful printed materials.",
            "Cut out interesting shapes, colors, and images from the magazines.",
            "Take a piece of cardboard or thick paper as your base.",
            "Arrange the cutouts to create a themed collage (like nature, space, or your favorite hobby).",
            "Use a glue stick to carefully paste down each piece, overlapping for interesting effects.",
            "Optional: Add personal drawings or writings to personalize your artwork.",
        ],
    },
    "cardboard-marble-run": {
        material: "Cardboard",
        steps: [
            "Collect clean cardboard boxes, toilet paper rolls, and paper towel tubes.",
            "Cut cardboard into long, straight pieces or use the tubes as tracks.",
            "Use tape or glue to connect the pieces at slight angles to create a path.",
            "Create barriers, turns, and drops to make the marble run more interesting.",
            "Test your marble run by dropping a small marble or ping pong ball and watching it travel.",
            "Experiment with different angles and track designs to see how they affect the ball's movement.",
        ],
    },
    "electronic-parts-robot": {
        material: "Electronics",
        steps: [
            "Ask an adult to help you safely disassemble old, unused electronics (like remote controls or small devices).",
            "Collect interesting parts: buttons, small motors, wires, and plastic casings.",
            "Use a sturdy base like a small cardboard box for the robot's body.",
            "Attach electronic parts using safe, child-friendly glue or tape.",
            "Create a face or design using the buttons and parts.",
            "IMPORTANT: An adult must supervise and help with any electronic part handling.",
        ],
    },
    "compost-terrarium": {
        material: "Food Waste",
        steps: [
            "Find a clear plastic container with a lid (like a large jar or clean food container).",
            "Ask an adult to help you create drainage holes in the bottom.",
            "Layer the bottom with small rocks or pebbles for drainage.",
            "Add a layer of soil mixed with your food scraps (like fruit peels, coffee grounds).",
            "Plant some small seeds or seedlings on top of the compost layer.",
            "Water lightly and place in a sunny spot. Watch how the food waste helps plants grow!",
        ],
    },
    "paper-seed-starter": {
        material: "Paper",
        steps: [
            "Tear used paper (printer paper, newspapers) into small pieces.",
            "Soak the paper pieces in water for about an hour.",
            "Blend the wet paper into a smooth pulp using a blender.",
            "Press the pulp into small molds or egg carton sections.",
            "Let the paper dry completely into seed-starting pots.",
            "Fill the pots with soil and plant seeds. The paper will biodegrade and help the seeds grow!",
        ],
    },
    "water-filter-experiment": {
        material: "Water Filter",
        steps: [
            "Collect a plastic water bottle, cotton balls, sand, small rocks, and gravel.",
            "Cut the bottom off the water bottle and turn it upside down like a funnel.",
            "Place cotton balls at the bottle's neck to act as the first filter layer.",
            "Add layers of fine sand, then small rocks, then larger gravel.",
            "Pour dirty water (like muddy water from outside) through the filter.",
            "Observe how the layers clean the water. ALWAYS have an adult verify the water's cleanliness before any contact!",
        ],
    },
    "bottle-vertical-garden": {
        material: "Bottles",
        steps: [
            "Collect clean plastic bottles of various sizes.",
            "Ask an adult to help you cut the bottles horizontally, creating planting sections.",
            "Punch small drainage holes in the bottom of each bottle section.",
            "Fill each section with potting soil.",
            "Plant herbs, small flowers, or succulents in each bottle section.",
            "Hang the bottles vertically using strong string or wire, creating a hanging garden.",
        ],
    }
};

// Updated Generate Response Function
function generateResponse(material) {
    material = material.toLowerCase();
    let response = "";
    let project = "";

    // Check for materials and assign appropriate projects
    if (material.includes("magazines")) {
        project = "magazine-collage";
        response = `Creative Idea: Make a vibrant magazine collage to explore art and recycling! 🎨`;
    } else if (material.includes("cardboard")) {
        project = "cardboard-marble-run";
        response = `Fun Project: Build an exciting marble run using cardboard! Learn physics while recycling. 🔮`;
    } else if (material.includes("electronics") || material.includes("electronic")) {
        project = "electronic-parts-robot";
        response = `Maker Project: Create a unique robot from old electronic parts! 🤖`;
    } else if (material.includes("food waste")) {
        project = "compost-terrarium";
        response = `Green Project: Turn food waste into a living terrarium! 🌱`;
    } else if (material.includes("paper")) {
        project = "paper-seed-starter";
        response = `Eco-Friendly Project: Make seed-starting pots from recycled paper! 🌿`;
    } else if (material.includes("water filter")) {
        project = "water-filter-experiment";
        response = `Science Experiment: Build a water filter and learn about clean water! 💧`;
    } else if (material.includes("bottles")) {
        project = "bottle-vertical-garden";
        response = `Garden Project: Create a vertical garden from plastic bottles! 🌻`;
    } else {
        response = "Sorry, I don't have a project for that material yet. Try another one! 🙁";
    }

    // If a valid project is found, offer instructions
    if (response && project) {
        sendMessage(response);
        setTimeout(() => {
            const showInstructions = confirm("Would you like to see instructions for this project?");
            if (showInstructions) {
                const instructions = getInstructions(project);
                sendInstructions(instructions);

                // Scratch project offer
                const scratchProject = confirm("Would you like to see a related Scratch project about this material?");
                if (scratchProject) {
                    sendMessage("Scratch project link will be provided soon! Stay tuned for a interactive coding experience related to your recycling project. 🖥️");
                }

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
sendMessage("Let's get started! What material would you like to learn about? Enter a material related to sustainability to start a project(e.g. magazines, cardboard, electronics, food waste, paper, water filter, bottles):", 3500);
appendMessage("Chatbot","Type 'exit' to leave the chatbot.", 8000);