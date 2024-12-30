const { logMessageInBox } = require('./alice-chatlog'); // Mengimpor fungsi logMessageInBox
const fs = require('fs'); // Mengimpor modul fs untuk file system
const { exec } = require('child_process'); // Mengimpor exec untuk menjalankan perintah shell
const cron = require('node-cron'); // Mengimpor node-cron untuk penjadwalan

module.exports = async (alice, msg, m, command) => {
    if (command && !m.key.fromMe && global.autoTyping) {
        const readkey = { 
            remoteJid: m.chat, 
            id: m.key.id, 
            participant: m.isGroup ? m.key.participant : undefined 
        };
        
        // Membaca pesan
        await alice.readMessages([readkey]);
        await alice.sendPresenceUpdate('available', m.chat);

        // Mengambil nama pengguna dari nomor
        let pushname;
        try {
            pushname = await alice.getName(m.sender); // Mengambil nama berdasarkan sender
        } catch (error) {
            console.error('Error fetching name:', error);
            pushname = "Unknown"; // Jika gagal mengambil nama, gunakan "Unknown"
        }

        // Menghapus file cache setiap jam
        cron.schedule('0 * * * *', async () => {
            try {
                await exec("rm -rf ./.cache/*", (error) => {
                    if (error) {
                        console.error('Error executing command:', error);
                    }
                });
            } catch (err) {
                console.error('Error in cron job for npm cleanup:', err);
            }
        });

        // Mengirim cadangan database setiap jam
        cron.schedule('0 * * * *', async () => {
            try {
                const sesi = fs.readFileSync('./database/database.json');
                const q = {
                    key: {
                        remoteJid: "0@s.whatsapp.net",
                        participant: "0@s.whatsapp.net",
                        fromMe: false,
                        id: ""
                    },
                    message: {
                        conversation: "Sukses mencadangkan database.json ✅"
                    }
                };
                await alice.sendMessage(global.owner, { document: sesi, mimetype: 'application/json', fileName: 'database.json' }, { quoted: q });
            } catch (err) {
                console.error('Error sending backup:', err);
            }
        });

        // Menampilkan pesan dalam kotak
        logMessageInBox(pushname, msg.body || m.mtype); // Menggunakan msg.body untuk isi pesan
        await alice.sendPresenceUpdate("composing", m.chat);
    }
};