const { createCanvas, loadImage } = require('canvas');
const canvafy = require('canvafy');
const config = require('../../config');

module.exports = {
    name: 'ship',
    description: 'Ship two users',
    async execute(message, args) {
        let user1, user2;

        if (message.mentions.users.size === 2) {
            const users = message.mentions.users.array();
            user1 = users[0];
            user2 = users[1];
        } 
        else if (message.mentions.users.size === 1) {
            user1 = message.author;
            user2 = message.mentions.users.first();
        } 
        else {
            user1 = message.author;
            user2 = message.client.users.cache.random();
        }

        const ship = await new canvafy.Ship()
            .setAvatars(user1.displayAvatarURL({ dynamic: true, format: "png" }), user2.displayAvatarURL({ dynamic: true, format: "png" }))
            .setBackground("image", config.ship)
            .setBorder("#f0f0f0")
            .setOverlayOpacity(0.5)
            .build();

        message.reply({
            content: `> **     ${message.author.tag} ❓ ${user2.tag}**`,
            files: [{
                attachment: ship,
                name: `ship-${user2.id}.png`
            }]
        });
    },
};
