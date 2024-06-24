const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Initialize the client
const client = new Client({
    webVersionCache: {
        type: "remote",
        remotePath:
            "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
});

// Generate and scan QR code for authentication
client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client is ready!");

    // Define reminders
    const reminders = [
        { name: "Mili", birthday: "2024-06-24", phone: "1234567890" },
        // Add more friends here
    ];

    // Check for today's birthdays and send reminders
    const today = new Date().toISOString().split("T")[0];
    reminders.forEach((reminder) => {
        if (reminder.birthday === today) {
            sendBirthdayReminder(reminder);
        }
    });
});

client.on("auth_failure", (msg) => {
    // Fired if session restore was unsuccessful
    console.error("AUTHENTICATION FAILURE", msg);
});

client.on("disconnected", (reason) => {
    console.log("Client was logged out", reason);
});

function sendBirthdayReminder(reminder) {
    const message = `Happy Birthday ${reminder.name}! 🎉`;
    const chatId = `${reminder.phone}@c.us`; // WhatsApp chat ID format

    client
        .sendMessage(chatId, message)
        .then((response) => {
            console.log(`Message sent to ${reminder.name}: ${response.id.id}`);
        })
        .catch((error) => {
            console.error("Error sending message:", error);
        });
}

// Start the client
client.initialize();
