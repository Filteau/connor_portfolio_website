document.addEventListener('DOMContentLoaded', () => {
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalInput = document.getElementById('terminalInput');
    const terminalScreen = document.getElementById('terminalScreen');
    const cursor = document.querySelector('.cursor');
    const prompt = document.querySelector('.prompt');
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingText = document.getElementById('loadingText');
    const loadingAscii = document.getElementById('loadingAscii');
    const audioToggleButton = document.getElementById('audioToggle');
    const audioVolume = new Tone.Volume(-24).toDestination();

    let currentPath = '';
    let jokeIndex = 0;
    let isMuted = false;
    let isAudioInitialized = false;
    let isTyping = false;
    let synth, enterSynth;

    // Function to set up Tone.js, called on first user interaction
    function setupAudio() {
        if (isAudioInitialized) return;
        try {
            // Initialize the audio context
            Tone.start();
            synth = new Tone.Synth().connect(audioVolume);
            enterSynth = new Tone.Synth({
                oscillator: { type: 'square' },
                envelope: {
                    attack: 0.001,
                    decay: 0.1,
                    sustain: 0.01,
                    release: 0.1
                }
            }).connect(audioVolume);
            isAudioInitialized = true;
        } catch (e) {
            console.error('Failed to start Tone.js audio context:', e);
        }
    }

    function playBeep() {
        if (!isMuted && isAudioInitialized) {
            synth.triggerAttackRelease("D2", "4n");
        }
    }

    function playEnterSound() {
        if (!isMuted && isAudioInitialized) {
            enterSynth.triggerAttackRelease("D2", "8n");
        }
    }

    audioToggleButton.addEventListener('click', () => {
        // User interaction, so audio can initialize
        setupAudio();
        isMuted = !isMuted;
        audioToggleButton.textContent = isMuted ? 'UNMUTE AUDIO' : 'MUTE AUDIO';
    });

    const commands = {
        'help': `Available commands:
        - help      : Show this help message.
        - about     : Learn about me.
        - projects  : See my projects.
        - socials   : Find me on the net.
        - tools     : Access tools tools.
        - clear     : Clear the terminal screen.
        - greetings : Get a friendly message.
        - exit      : Exit current mode.
`,
        'about': `
ABOUT CONNOR
NAME        : [CONNOR FILTEAU]
OCCUPATION  : [DATA ANALYST & RESPIRATORY THERAPIST]
SKILLS      : [PYTHON, C++, JAVA, RESTful API]
INTERESTS   : [READING, CODING, SCIENCE, FOOD, HISTORY, MUSIC, TRAVEL]
`,
        'projects': async () => {
            const projectsText = `CONNOR'S PROJECTS
PROJECT Alpha : connor_portfolio_website
DESCRIPTION   : My attempt at creating a fallout inspired terminal, quite basic and nothing fancy.
STATUS        : [Continuing development]
LINK          : `;
            await typeText(projectsText);
            const projectLink = document.createElement('a');
            projectLink.href = "https://github.com/Filteau/connor_portfolio_website";
            projectLink.target = "_blank";
            projectLink.textContent = "View on GitHub";
            terminalOutput.appendChild(projectLink);
            const br = document.createElement('br');
            terminalOutput.appendChild(br);
            terminalScreen.scrollTop = terminalScreen.scrollHeight;
            const otherProjects = `\nPROJECT Beta  : [Some-project-name-again?]
DESCRIPTION   : [some placeholder text]
STATUS        : [Under development].
LINK          : [this be where I put the link]

PROJECT Gamma  : [Some-project-name-again-again]
DESCRIPTION    : [some placeholder text]
STATUS         : [Under development]
LINK           : [this be where I put the link]
`;
            await typeText(otherProjects);
            return '';
        },
    
        // TODO: fix the links below
        'socials': `SOCIALS
LINKEDIN    : <a href="https://www.linkedin.com/in/connor-ebel-28a001187/" target="_blank">linkedin.com/in/connorfilteau</a>
GITHUB      : <a href="https://github.com/Filteau" target="_blank">github.com/Filteau</a>
EMAIL       : ebel.work@gmail.com
`,
        'tools': `Entering tools TOOLS mode.
Available tools:
    - time      : Current Time and Date
    - joke      : Tell me a joke!
    - exit      : Go back to main commands.

Type a tool name or 'exit'.
`,
        'tools-time': () => {
            const now = new Date();
            return `CURRENT SYSTEM TIME: ${now.toLocaleTimeString()}
CURRENT SYSTEM DATE: ${now.toLocaleDateString()}
`;
        },
        'tools-joke': () => {
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything!\n",
                "Did you hear about the two guys who stole a calendar? They each got six months.\n",
                "What do you call a fake noodle? An im-pasta!\n",
                "How many ghouls does it take to change a lightbulb? None, they huddle around the glowing one!\n",
                "How many lives does an irradiated cat have? 18 half-lives.\n",
                "Yo mama so ugly, even a deathclaw runs away when they see her.\n"
            ];
            const joke = jokes[jokeIndex % jokes.length];
            jokeIndex++;
            return joke;
        },
        'greetings': () => {
            const greetings = [
                "Salutations, traveler!\n",
                "Greetings, wastelander.\n",
                "Howdy, pardner.\n",
                "Welcome to another wasteland, hope you brought some rad-x.\n"
            ];
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];
            return greeting;
        },
        
    };

    // function that will typeout the text with a little delay
    function typeText(text) {
        isTyping = true;
        return new Promise((resolve) => {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    // Play beep only after audio is initialized
                    if (text.charAt(i) !== ' ' && text.charAt(i) !== '\n') {
                        playBeep();
                    }
                    terminalOutput.innerHTML += text.charAt(i);
                    terminalScreen.scrollTop = terminalScreen.scrollHeight;
                    i++;
                } else {
                    clearInterval(typingInterval);
                    isTyping = false;
                    resolve();
                }
            }, 15);
        });
    }

    // Process user input
    terminalInput.addEventListener('keydown', async (event) => {
        // user interaction, initialize audio
        setupAudio();

        if (event.key === 'Enter') {
            if (isTyping) return;
            playEnterSound();
            const command = terminalInput.value.trim().toLowerCase();
            terminalOutput.innerHTML += `\n> ${terminalInput.value}\n`;
            terminalInput.value = '';
            terminalInput.disabled = true;
            cursor.style.display = 'none';

            let response = '';

            if (currentPath === 'tools') {
                if (command === 'exit') {
                    currentPath = '';
                    jokeIndex = 0;
                    response = "Exiting TOOLS mode. Type 'help' for main commands.\n";
                    await typeText(response);
                } else if (commands[`tools-${command}`]) {
                    response = commands[`tools-${command}`]();
                    await typeText(response);
                } else {
                    response = `UNKNOWN COMMAND: ${command}\nType 'exit' to return or 'help' for tools.\n`;
                    await typeText(response);
                }
            } else { // Main path
                if (commands[command]) {
    const commandResult = commands[command];
    if (typeof commandResult === 'function') {
        // The projects command needs to be handled separately since it doesn't return a string,
        //  it types out the text internally.
        if (command === 'projects' || command === 'socials') {
            await commandResult();
        } else {
            const resultText = commandResult();
            await typeText(resultText);
        }
    } else {
        await typeText(commandResult);
    }
}
            }

            terminalInput.disabled = false;
            terminalInput.focus();
            cursor.style.display = 'inline-block';
            prompt.textContent = '>';
        } else {
            // Play a beep for each key press, except for backspace and arrow keys
            if (event.key.length === 1) {
                playBeep();
            }
        }
    });

    async function initializeTerminal() {
        terminalInput.disabled = true;
        prompt.textContent = '';
        await typeText("STANDBY: STARTUP PROTOCOLS INITIATED...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (loadingAscii) {
        loadingAscii.textContent =
        ` ██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗
██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝
╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗▄█╗
 ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝

██╗    ██╗ █████╗ ███╗   ██╗██████╗ ███████╗██████╗ ███████╗██████╗
██║    ██║██╔══██╗████╗  ██║██╔══██╗██╔════╝██╔══██╗██╔════╝██╔══██╗
██║ █╗ ██║███████║██╔██╗ ██║██║  ██║█████╗  ██████╔╝█████╗  ██████╔╝
██║███╗██║██╔══██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗██╔══╝  ██╔══██╗
╚███╔███╔╝██║  ██║██║ ╚████║██████╔╝███████╗██║  ██║███████╗██║  ██║
 ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝`;
        }
        let percent = 0;
        const loadingInterval = setInterval(() => {
            loadingText.textContent = `LOADING... ${percent}%`;
            percent += 10;
            if (percent > 100) {
                clearInterval(loadingInterval);
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    displayTerminalContent();
                }, 1000);
            }
        }, 100);
    }

    async function displayTerminalContent() {
        const vaultTecAscii = `
                               XXXXXXXX
            XXXXXXXXXXXXXX XXXX       X
          XXXXX          XXX          X
         XXXX              XX       XX
        XXXX                XX   XXX
        XXX                  XXXX
       XXX                  X X
       X X              X X   X
     XXX X          XXX       X
  XXX  XX        XXX        XXX
XX      XX   XXX          XXX
X       XXXXXX       XXXXXX
 XXXXXXXX    XXXXXXXXX
`;
        await typeText(`${vaultTecAscii}\n`);
        await typeText("TERMiNOS-LINK PROTOCOL INITIATED...\n");
        await typeText("VAULT VER 1.1.1.\n");
        await typeText("Welcome to my portfolio site, let me know what you think!\n");
        await typeText("For a list of commands, type 'help'.\n");
        terminalInput.disabled = false;
        terminalInput.focus();
        cursor.style.display = 'inline-block';
        prompt.textContent = '>';
    }

    initializeTerminal();

    const terminalWrapper = document.querySelector('.terminal-wrapper');
    if (terminalWrapper) {
        terminalWrapper.addEventListener('click', () => {
            terminalInput.focus();
        });
    }
});