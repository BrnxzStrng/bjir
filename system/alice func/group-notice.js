const fs = require('fs');
const chalk = require('chalk');
const {
    delay,
    proto,
    jidDecode,
    jidNormalizedUser ,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    downloadContentFromMessage,
} = require('@whiskeysockets/baileys');
const moment = require('moment-timezone');

module.exports.狗肉你哦t = async (alice, json) => {
    try {
        if (!global.welcome) return; // Cek apakah fitur welcome diaktifkan

        const res = json[0]; // Ambil pembaruan grup pertama
        const messages = [];

        try {
            // Cek dan siapkan pesan berdasarkan pembaruan grup
            if (res.announce !== undefined) {
                messages.push(res.announce 
                    ? `*[ System Notice ]* Group disenyapkan oleh admin!` 
                    : `*[ System Notice ]* Group telah dibuka!`);
            }

            if (res.restrict !== undefined) {
                messages.push(res.restrict 
                    ? `*[ System Notice ]* Sukses membatasi akses member!` 
                    : `*[ System Notice ]* Group telah dibuka!`);
            }

            if (res.desc?.trim()) {
                messages.push(`*[ System Notice ]* Deskripsi diubah ke:\n\n${res.desc}`);
            }

            if (res.subject) {
                messages.push(`*[ System Notice ]* Judul berubah menjadi *${res.subject}*`);
            }

            // Kirim semua pesan sekaligus
            const chatId = res.id; // Pastikan Anda memiliki chatId yang benar
            for (const message of messages) {
                await alice.sendMessage(chatId, { text: message });
            }

        } catch (err) {
            console.error('Error processing group notice:', err);
        }
    } catch (err) {
        console.error('Error in groupNotice function:', err);
    }
};

// Watch file untuk mendeteksi perubahan
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});