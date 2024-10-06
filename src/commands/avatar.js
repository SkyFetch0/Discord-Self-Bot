const { createCanvas, loadImage } = require('canvas');

module.exports = {
    name: 'avatar',
    description: 'Displays user avatar',
    async execute(message, args) {
        let user;
        
        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        } 
        else if (message.reference && message.reference.messageID) {
            const referencedMessage = await message.channel.messages.fetch(message.reference.messageID);
            user = referencedMessage.author;
        } 
        else {
            user = message.author;
        }

        const avatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
        message.channel.send({ files: [avatarURL] });
    },
};
