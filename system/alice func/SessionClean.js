const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Tentukan jalur ke folder sesi secara langsung
const sessionName = global.sessionName; // Pastikan nama session benar
const folderPath = `./system/${sessionName}`; // Jalur relatif ke folder sesi
const excludeFile = 'creds.json';

console.log('Folder path:', folderPath); // Log untuk memeriksa folderPath

const deleteFiles = () => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      if (file !== excludeFile) {
        fs.unlink(path.join(folderPath, file), (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log(`Deleted file: ${file}`); // Log file yang dihapus
          }
        });
      }
    });
  });
};

// Mengatur cron job untuk menjalankan deleteFiles setiap jam
const startCronJob = () => {
  cron.schedule('0 * * * *', deleteFiles); // Menjalankan setiap jam pada menit ke-0
};

// Memanggil fungsi startCronJob secara otomatis saat modul diimpor
startCronJob();

module.exports = startCronJob;