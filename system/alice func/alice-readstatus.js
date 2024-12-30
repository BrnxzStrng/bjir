/* CREATED BY DARWIN */
const fs = require('fs')
const chalk = require('chalk')
const { getContentType } = global.baileys
const { getBuffer } = require('../../system/functions')

module.exports = async (alice, msg, m) => {
    if (global.autoreadsw && (msg.key.remoteJid === 'status@broadcast')) {
        // if (msg.key.participant == global.owner) return // kecualikan owner 
        alice.readMessages([msg.key])
       
        let mt = getContentType(msg.message)
        let swdel = `Status dari @${msg.key.participant.split('@')[0]} Telah dihapus`
        
        if (/protocolMessage/i.test(mt)) {
            await alice.sendMessage(global.owner, { text: swdel, mentions: [msg.key.participant] }, { quoted: m })
            // Tambahkan reaksi di sini
            console.log('Mengirim reaksi untuk status yang dihapus');
            await alice.sendMessage(msg.key.remoteJid, { react: { text: '👀', key: msg.key } }) // Ganti '👀' dengan emoji yang diinginkan
            return;
        }
        
        if (/(imageMessage|audioMessage|videoMessage|extendedTextMessage)/i.test(mt)) {
            let laporsw = `Melihat story dari @${msg.key.participant.split('@')[0]} ${(mt == 'extendedTextMessage') ? '\nStory Teks Berisi : ' + msg.message.extendedTextMessage.text : (mt == 'imageMessage') ? '\nStory Gambar dengan Caption : ' + msg.message.imageMessage.caption : (mt == 'audioMessage') ? '\nStory Audio dengan Caption : ' + msg.message.audioMessage.caption : (mt == 'videoMessage') ? '\nStory Video dengan Caption : ' + msg.message.videoMessage.caption : '\nTidak diketahui cek aja langsung.'}`
            
            await alice.copyNForward(global.owner, m, { text: laporsw, mentions: [msg.key.participant] }, { quoted: m })
            await alice.sendMessage(global.owner, { text: laporsw, mentions: [msg.key.participant] }, { quoted: m })
            // Tambahkan reaksi di sini
            console.log('Mengirim reaksi untuk status yang dilihat');
            await alice.sendMessage(msg.key.remoteJid, { react: { text: '👀', key: msg.key } }) // Ganti '👀' dengan emoji yang diinginkan
        }
    }
}