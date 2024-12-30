// Log pesan baru
const chalk = require('chalk');

function logMessageInBox(sender, message) {
    const time = new Date().toLocaleTimeString(); // Menambahkan waktu
    console.log(chalk.bgGray('┌──────────────────────────────────────────┐'));
    console.log(chalk.bgGray('│- ' + chalk.green.bold('Time: ') + time)); // Label hijau dan bold
    console.log(chalk.bgGray('│- ' + chalk.green.bold('From: ') + sender)); // Label hijau dan bold
    console.log(chalk.bgGray('│- ' + chalk.green.bold('Text: ') + message)); // Label hijau dan bold
    console.log(chalk.bgGray('└──────────────────────────────────────────┘'));
}

// Mengekspor fungsi agar bisa digunakan di file lain
module.exports = { logMessageInBox }