const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)
const left = global.menu.leftcorner;
const right = global.menu.rightcorner;
const block = global.menu.block;
const line = global.menu.line;

// Fungsi untuk membuat daftar perintah
const createCommandList = (prefix, commands) => {
    // Pastikan commands adalah array
    if (!Array.isArray(commands)) {
        throw new Error('commands harus berupa array');
    }
    return commands.map(command => `  ${block} • ${prefix}${command}`).join('\n');
};

// Fungsi untuk membuat daftar perintah
const createMenu = (prefix, commands, title) => {
    const commandList = createCommandList(prefix, commands);
    return `*${title}*\n\n${commandList}\n\n`;
}

// Fungsi untuk memuat perintah dari file JSON
const loadCommandsFromFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        console.log(`Data ${filePath}:`, data); // Log data untuk debugging
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading commands from ${filePath}:`, error.message);
        return [];
    }
}
// MENU UTAMA
global.menuutama = (prefix) => {
    const menus = loadCommandsFromFile(path.join(__dirname, 'command', 'menu utama.json'));
    return createMenu(prefix, menus, 'C A T E G O R Y');
}

// MENU RANDOM
global.menurandom = (prefix) => {
    const randomPhotos = loadCommandsFromFile(path.join(__dirname, 'command', 'menu random.json'));
    return createMenu(prefix, randomPhotos, 'R A N D O M');
}

// MENU NSFW
global.menunsfw = (prefix) => {
    const nsfwCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu nsfw.json'));
    const otherCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu other.json'));
    const allCommands = [...nsfwCommands, ...otherCommands];
    return createMenu(prefix, allCommands, 'N S F W');
}

// MENU TOOLS
global.menutools = (prefix) => {
    const toolCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu tools.json'));
    return createMenu(prefix, toolCommands, 'T O O L S');
}

// MENU ASUPAN
global.menuasupan = (prefix) => {
    const asupanCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu asupan.json'));
    return createMenu(prefix, asupanCommands, 'A S U P A N');
}

// MENU PHOTOOXY
global.menuphotoxy = (prefix) => {
    const photoxyCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu photoxy.json'));
    return createMenu(prefix, photoxyCommands, 'P H O T O X Y');
}

// MENU CLONE BOT
global.menujadibot = (prefix) => {
    const jadibotCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu jadibot.json'));
    return createMenu(prefix, jadibotCommands, 'C L O N E    B O T');
}

// MENU TEXT PRO
global.menutextpro = (prefix) => {
    const textProCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu textpro.json'));
    return createMenu(prefix, textProCommands, 'T E X T P R O');
}

// MENU OWNER
global.menuowner = (prefix) => {
    const ownerCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu owner.json'));
    return createMenu(prefix, ownerCommands, 'O W N E R');
}

// MENU SEARCH
global.menusearch = (prefix) => {
    const searchCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu search.json'));
    return createMenu(prefix, searchCommands, 'S E A R C H');
}

// MENU CHATBOT
global.menuchatbot = (prefix) => {
    const chatbotCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu chatbot.json'));
    const diffusionCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu diffusion.json'));
    const CombineGpt = [...chatbotCommands, ...diffusionCommands];
    return createMenu(prefix, CombineGpt, 'C H A T B O T');
}

// MENU CONVERT
global.menuconvert = (prefix) => {
    const convertCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu convert.json'));
    return createMenu(prefix, convertCommands, 'C O N V E R T');
}

// MENU DOWNLOAD
global.menudownload = (prefix) => {
    const downloadCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu download.json'));
    return createMenu(prefix, downloadCommands, 'D O W N L O A D');
}

// MENU EPHOTO
global.menuephoto = (prefix) => {
    const ephotoCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu ephoto.json'));
    return createMenu(prefix, ephotoCommands, 'E P H O T O');
}

// MENU PRIMBON GAME
global.menuprimbon = (prefix) => {
    const primbonCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu primbon.json'));
    return createMenu(prefix, primbonCommands, 'P R I M B O N');
}

// MENU GROUP
global.menugroup = (prefix) => {
    const groupCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu group.json'));
    return createMenu(prefix, groupCommands, 'G R O U P');
}

// MENU ANIME
global.menuanime = (prefix) => {
    const animeCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu anime.json'));
    return createMenu(prefix, animeCommands, 'A N I M E');
}

// MENU RPG GAMES
global.menurpg = (prefix) => {
    const rpgCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu rpg.json'));
    return createMenu(prefix, rpgCommands, 'R P G    G A M E S');
}

// MENU AUDIO
global.menuaudio = (prefix) => {
    const audioCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu audio.json'));
    return createMenu(prefix, audioCommands, 'A U D I O');
}

// MENU GAME
global.menugame = (prefix) => {
    const gameCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu game.json'));
    return createMenu(prefix, gameCommands, 'G A M E S');
}

// MENU SHOP
global.menushop = (prefix) => {
    const shopCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu shop.json'));
    return createMenu(prefix, shopCommands, 'S H O P   S H O P');
}

// MENU FUN ASK
global.menufun = (prefix) => {
    const funCommands = loadCommandsFromFile(path.join(__dirname, 'command', 'menu fun.json'));
    return createMenu(prefix, funCommands, 'F U N');
}

// NO COPAS NOOB
// CRDT - DARWIN