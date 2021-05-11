### FkNoobsCoH - Analyzer

This utility is used for the Company of Heroes twitch extension, but can also be used as a standalone app. What does this utility do?

 - It connects your game to the Twitch extension (optional).
 - It parses the logfile and emits events, which the Twitch extension communicates with (optional).
 - It keeps track of your played games and saves it into a database. It includes all match details and the replay file.
 - It will show you all you need to know about your opponents, when starting a game. Info includes stats, rank, level etc.

You dont have to be a streamer or twitch user to use this program. You can use the program as a standalone app.

Download the [latest version](https://github.com/redbullzuiper/coh-analyzer-app/releases/download/v0.1.0-beta.1/FkNoobsCoH.-.Analyzer.0.1.0.exe) or check out all [releases](https://github.com/redbullzuiper/coh-analyzer-app/releases)
 
The current state of the project is in beta. So expect bugs and changes! If you find any bug, dont hesitate to create an issue.

### Collaborate
If you wanna collaborate with me on this project, send me a personal message. You can also add me on the following steam accounts:

 - **[\[82AD\] Red](https://steamcommunity.com/profiles/76561198036527204/)**
 - **[Faith | \[TTV\]FkNoobscoh](https://steamcommunity.com/profiles/76561198884295259)** 
 - **[FkNoobs](https://steamcommunity.com/profiles/76561198170623519)**

### Cloning the project

If you want to clone the project, keep in mind that you need to implement:

 - Relic API integration 
 - Database integration (project uses Firestore)
 - Twitch integration using your own developer account

Serve the project by running this command in the terminal

    npm run electron:serve

Build the project by running this command in the terminal

    npm run electron:build
