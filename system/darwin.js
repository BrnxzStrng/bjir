// CREATED BY DARWIN
require('../lib/funclist');
require('../system/alice func/SessionClean')
require('../system/functions');
require('../bot setting/alice-set')
const util = require('util')
const path = require('path')
const yts = require('yt-search');
const axios = require('axios')
const {
    Telegraf
} = require('telegraf');
const fetch = require('node-fetch')
const fs = require('fs');
const chalk = require('chalk');
const speed = require('performance-now')
// copas? taruh nama gw [ darwin ] fvck noob
const {
    spawn
} = require('child_process');

let isRunning = false;
const dataToSave = {
    bots: [{
        name: namebot,
        token: token
    }]
};

// Menyimpan data ke dalam file JSON
fs.writeFileSync('./system/telelice.json', JSON.stringify(dataToSave, null, 2));


function start() {
    if (isRunning) return;
    isRunning = true;

    let args = [path.join(__dirname, '../message/main.js'), ...process.argv.slice(2)];
    console.log([process.argv[0], ...args].join('\n'));

    let p = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });

    p.on('message', data => {
        if (data === 'reset') {
            console.log('Restarting Bot...');
            p.kill();
            start();
        } else if (data === null) {
            console.log('Received null code, but not restarting Bot. Monitoring...');
            start();
        } else {
            console.log('Received data:', data);
        }
    });

    p.on('exit', code => {
        start();
        console.error('Exited with code:', code);
        isRunning = false;
        if (code === 0 || code === 1) {
            console.log('Starting Bot again...');
            start();
        }
    });
}


const {
    config,
    saveConfig
} = require('./addbottoken');

let WaitForInput = {}; // Objek untuk menyimpan pengguna yang sedang menunggu token

function initializeBot(name, token) {
    if (!token || typeof token !== 'string' || token.trim() === '') {
        console.error(chalk.bgCyan.white.bold('TOKEN BOT TELEGRAM TIDAK VALID'));
        console.error(chalk.bgBlack.white.bold('Isi token bot anda di settings.js'));
        return;
    }

    const bot = new Telegraf(token);
    const dataFilePath = path.join(__dirname, '../assets/telebot/database', 'darwinireng.json');

    // Mendengarkan pesan
    bot.on('message', async (alice) => {
        const chatId = alice.chat.id;
        const userId = alice.from.id;

        // Cek apakah file sudah ada
        let userData = [];
        if (fs.existsSync(dataFilePath)) {
            // Baca data dari file
            const fileData = fs.readFileSync(dataFilePath);
            userData = JSON.parse(fileData);
        }

        // Tambahkan ID pengguna jika belum ada
        if (!userData.includes(userId)) {
            userData.push(userId);
            // Simpan kembali ke file
            fs.writeFileSync(dataFilePath, JSON.stringify(userData, null, 2));
            console.log(`ID ${userId} saved to database`);
        }

        // Tampilkan menu
        const userName = alice.from.username || alice.from.first_name;
        const userMessage = alice.text;

        console.log(chalk.bgCyan.black(`Telegram :`) + ` ${userName}`);
        console.log(chalk.bgWhite.black(`Message :`) + ` ${userMessage}`);
     
        // Fungsi untuk mendapatkan respons dari OpenAI
        async function anakff(text, logic) {
            let responng = await axios.post("https://chateverywhere.app/api/chat/", {
                "model": {
                    "id": "gpt-4",
                    "name": "GPT-4",
                    "maxLength": 32000, // Sesuaikan token limit jika diperlukan
                    "tokenLimit": 8000, // Sesuaikan token limit untuk model GPT-4
                    "completionTokenLimit": 5000, // Sesuaikan jika diperlukan
                    "deploymentName": "gpt-4"
                },
                "messages": [{
                    "pluginId": null,
                    "content": text,
                    "role": "user"
                }],
                "prompt": logic,
                "temperature": 0.5
            }, {
                headers: {
                    "Accept": "/*/",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                }
            });

            let resuld = responng.data;
            return resuld;
        }

    if (global.chatgpt) {
        console.log('ChatGPT is enabled');
        let promptAlice = "Kamu adalah Alice Zuberg, seorang ksatria yang kuat dan berani...";
        
        try {
            let dongooo = await anakff(userMessage, promptAlice);
            console.log('Response from OpenAI:', dongooo);
            await bot.telegram.sendMessage(chatId, dongooo);
        } catch (e) {
            console.error('Error calling OpenAI API:', e);
            await bot.telegram.sendMessage(chatId, 'Maaf, terjadi kesalahan saat memproses permintaan Anda.');
        }
    } else {
        console.log('ChatGPT is not enabled');
    }
        
        // Tampilkan menu dengan tombol
        if (userMessage.toLowerCase() === '/menu') {
            const menuKeyboard = {
                reply_markup: {
                    keyboard: [
                        [{
                            text: 'Hentai'
                        }],
                        [{
                            text: 'Search'
                        }],
                        [{
                            text: 'Bookmark'
                        }],
                        [{
                            text: 'Create Bot'
                        }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            };

            bot.telegram.sendMessage(chatId, 'Silakan pilih opsi:', menuKeyboard);
} else if (userMessage === 'Hentai') {
    WaitForInput[chatId] = true; // Tandai bahwa pengguna sedang menunggu judul
    bot.telegram.sendMessage(chatId, 'Silakan kirim judul hentai.');
} else if (WaitForInput[chatId]) {
    // Jika pengguna sedang menunggu judul
    try {
        const { searchHentai } = require('../lib/scrapper/searchHentai');
        // Menggunakan fungsi searchHentai yang telah diimpor
        const searchResults = await searchHentai(userMessage); // Pastikan menggunakan userMessage

        if (searchResults.result.length === 0) {
            return bot.telegram.sendMessage(chatId, '*[ Error ]* Hasil tidak ada');
        }

        // Mengirimkan hasil pencarian dengan gambar dan caption
        for (const [index, result] of searchResults.result.entries()) {
            await bot.telegram.sendPhoto(chatId, result.thumbnail, {
                caption: `*${index + 1}.* ${result.title}\nViews: ${result.views}\nLink: ${result.url}`,
                parse_mode: 'Markdown'
            });
        }

        // Menambahkan tombol untuk mencari kembali
        const searchAgainKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Cari Lagi', callback_data: 'search_again' }]
                ]
            }
        };

        await bot.telegram.sendMessage(chatId, 'Ingin mencari lagi?', searchAgainKeyboard);

    } catch (error) {
        console.error('Error during search:', error);
        bot.telegram.sendMessage(chatId, 'Gagal melakukan pencarian. Silakan coba lagi.');
    } finally {
        delete WaitForInput[chatId]; // Hapus tanda bahwa pengguna sudah menunggu judul
    }
} else if (userMessage === 'Search') {
    // Logika untuk pencarian lainnya
            bot.telegram.sendMessage(chatId, 'Anda memilih Search. Silakan masukkan kata kunci yang ingin dicari:');
        } else if (userMessage === 'Bookmark') {
            bot.telegram.sendMessage(chatId, 'Anda memilih Bookmark. Silakan masukkan URL yang ingin Anda bookmark:');
        } else if (userMessage === 'Create Bot') {
            const createBotKeyboard = {
                reply_markup: {
                    keyboard: [
                        [{
                            text: 'Add Bot'
                        }],
                        [{
                            text: 'List Bot'
                        }],
                        [{
                            text: 'Delete Bot'
                        }]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            };

            bot.telegram.sendMessage(chatId, 'Silakan pilih opsi untuk Create Bot:', createBotKeyboard);
        } else if (userMessage === 'Add Bot') {
            WaitForInput[chatId] = true; // Tandai bahwa pengguna sedang menunggu token
            bot.telegram.sendMessage(chatId, 'Silakan kirim token bot yang ingin ditambahkan.');
        } else if (WaitForInput[chatId]) {
            // Jika pengguna sedang menunggu token
            const token = userMessage;

            try {
                // Menginisialisasi bot untuk mendapatkan informasi
                const newBot = new Telegraf(token);
                const getme = await newBot.telegram.getMe();

                // Mengambil nama dan username bot
                const name = getme.username;
                const botName = getme.first_name;

                // Menambahkan bot ke konfigurasi
                config.bots.push({
                    name,
                    token
                });
                saveConfig();

                // Inisialisasi bot
                initializeBot(name, token);
                bot.telegram.sendMessage(chatId, `Bot @${name} (${botName}) telah ditambahkan dan dijalankan.`);
            } catch (error) {
                console.error('Error adding bot:', error);
                bot.telegram.sendMessage(chatId, 'Gagal menambahkan bot. Pastikan token yang diberikan valid.');
            } finally {
                delete WaitForInput[chatId]; // Hapus tanda bahwa pengguna sudah menunggu token
            }
        } else if (userMessage === 'List Bot') {
            if (config.bots.length === 0) {
                return bot.telegram.sendMessage(chatId, 'Tidak ada bot yang terdaftar.');
            }

            let response = 'Daftar bot:\n';
            config.bots.forEach((bot, index) => {
                response += `${index + 1}. @${bot.name}\n`;
            });

            bot.telegram.sendMessage(chatId, response);
        } else if (userMessage === 'Delete Bot') {
            bot.telegram.sendMessage(chatId, 'Silakan masukkan nama bot yang ingin dihapus. Contoh: /deletebot <nama>');
        }

        // Fitur untuk menghapus bot
        bot.command('deletebot', (alice) => {
            const args = alice.message.text.split(' ');
            if (args.length < 2) {
                return alice.reply('Silakan masukkan nama bot yang ingin dihapus. Contoh: /deletebot <nama>');
            }

            const name = args[1];
            const botIndex = config.bots.findIndex(bot => bot.name === name);

            if (botIndex === -1) {
                return alice.reply(`Bot dengan nama @${name} tidak ditemukan.`);
            }

            config.bots.splice(botIndex, 1);
            saveConfig();

            alice.reply(`Bot @${name} telah dihapus.`);
        });

    });

    // Handle SIGINT and SIGTERM signals
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    // Launch the bot
    bot.launch()
        .then(() => {
            console.log(`Bot dengan token telah dimulai!`);
        })
        .catch(error => {
            console.error('Gagal memulai bot', error);
        });
}



// Initialize all bots from the config
config.bots.forEach(bot => initializeBot(bot.name, bot.token));
// END OF TELE BOT INDEX STARTER BY DARWIN
start()