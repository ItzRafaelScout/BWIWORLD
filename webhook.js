// Discord webhook integration
const webhooks = ["https://discord.com/api/webhooks/1403163696674508921/p4ZzMYPO3Wfw5GzLc-c83XPPDQxAuSADdfVtRIylM899KmpzYH79bTiSjJx1fZd_JS_n"]; // Your webhook URLs will go here

// Default avatar URL
const DEFAULT_AVATAR = "https://files.catbox.moe/h66npt.webp"; // Replace with your default avatar URL

function sanitizeMessage(msg) {
    return msg.replace(/@/g, "#");
}

function isValidUrl(msg) {
    return !msg.includes("http://") && !msg.includes("https://");
}

function sendWebhookMessage(name, message, avatar = DEFAULT_AVATAR) {
    if (!isValidUrl(message)) return;
    
    const sanitizedMessage = sanitizeMessage(message);
    
    webhooks.forEach((url) => {
        const postreq = require("https").request({
            method: "POST",
            host: "discord.com",
            path: url,
            port: 443,
            headers: {
                "content-type": "application/json"
            }
        });

        postreq.write(JSON.stringify({
            username: name,
            content: sanitizedMessage,
            avatar_url: avatar
        }));

        postreq.end();

        postreq.on("error", (error) => {
            console.error("Failed to send webhook:", error);
        });
    });
}

// Main message function
function say(name, message, pfp) {
    sendWebhookMessage(name, message, pfp);
}

// User join notification
function userJoined(username) {
    const joinMessage = ` ${username} has joined the chat`;
    sendWebhookMessage("System", joinMessage);
    console.log(`User joined: ${username}`);
}

// User leave notification
function userLeft(username) {
    const leaveMessage = `${username} has left the chat`;
    sendWebhookMessage("System", leaveMessage);
    console.log(`User left: ${username}`);
}

module.exports = {
    say,
    userJoined,
    userLeft
};
