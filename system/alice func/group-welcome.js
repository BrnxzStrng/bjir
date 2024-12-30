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
    prepareWAMessageMedia,
} = require('@whiskeysockets/baileys');
const moment = require('moment-timezone');

module.exports.骨肉親情 = async (alice, anu) => {
    try {
        // Fungsi untuk mengirim pesan katalog
        const sendCatalogMessage = async (userId, productId, title, description, imageUrl) => {
            try {
                const messa = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: alice.waUploadToServer });
                
                const catalog = generateWAMessageFromContent(userId, proto.Message.fromObject({
                    "productMessage": {
                        "product": {
                            "productImage": messa.imageMessage,
                            "productId": productId,
                            "title": title,
                            "description": description,
                            "currencyCode": "YURO",
                            "productImageCount": 6,
                        },
                        "businessOwnerJid": '6283873891575@s.whatsapp.net',
                    }
                }), { userJid: userId });

                await alice.relayMessage(userId, catalog.message, { messageId: catalog.key.id });
            } catch (error) {
                console.error("Error sending catalog message:", error);
            }
        };

        // Fungsi untuk menggantikan @member dan @subject dengan nama anggota dan subjek grup
        const replaceMentions = (text, memberName, groupSubject) => {
            return text
                .replace(/@member/g, memberName)  // Gantikan @member dengan nama anggota
                .replace(/@subject/g, groupSubject); // Gantikan @subject dengan nama grup
        };

        let metadata = await alice.groupMetadata(anu.id);
        let participants = anu.participants;

        for (let num of participants) {
            // Mendapatkan foto profil pengguna
            let pp = await alice.profilePictureUrl(num, 'image').catch((_) => "https://telegra.ph/file/1ecdb5a0aee62ef17d7fc.jpg");
            let nama = await alice.getName(num);
            let memb = metadata.participants.length;

            // Fungsi Booster
            if (global.boostgc && (anu.action === 'add' || anu.action === 'remove')) {
                await alice.groupUpdateSubject(anu.id, `${memb} MEMBER`);
            }

            // Mengirim pesan selamat datang jika ada anggota baru
            if (global.welcome && anu.action === 'add') {
                let welcomeMessage = replaceMentions(`New Welcome @member (⁠ ͡⁠°⁠ᴥ⁠ ͡⁠°⁠ ⁠ʋ⁠)`, nama, metadata.subject);
                await sendCatalogMessage(anu.id, "8400850699979873", `Welcome To ${metadata.subject}`, welcomeMessage, pp);
            } 
            // Mengirim pesan jika anggota keluar
            else if (global.welcome && anu.action === 'remove') {
                let exitMessage = replaceMentions(`Leaving From @subject`, nama, metadata.subject);
                await sendCatalogMessage(anu.id, "8400850699979873", exitMessage, `go far and shake your dick ${nama}`, pp);
            }

            // Deteksi promosi dan demosi
            if (global.welcome && anu.action === 'promote') {
                let promoteMessage = replaceMentions(`Promoted from @subject!`, nama, metadata.subject);
                await sendCatalogMessage(anu.id, "8400850699979873", promoteMessage, `${nama} telah menjadi MC`, pp);
            } else if (global.welcome && anu.action === 'demote') {
                let demoteMessage = replaceMentions(`Demoted from @subject!`, nama, metadata.subject);
                await sendCatalogMessage(anu.id, "8400850699979873", demoteMessage, `${nama} telah menjadi NPC`, pp);
            }
        }
    } catch (err) {
        console.error('Error in groupWelcome function:', err);
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