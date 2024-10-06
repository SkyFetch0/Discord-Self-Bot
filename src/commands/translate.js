const config = require('../../config');
if(config.deepls === 0) return "";
const deepl = require('deepl-node');

const translator = new deepl.Translator(config.deepl);

async function translate(text,lang = "tr") {
    const result = await translator.translateText(text, null, lang);
    console.log(result);
    return result.text;
}

module.exports = {
    name: 'translate',
    description: 'Translate a replied message',
    async execute(message, args) {
        if (args.length === 0) {
            return message.channel.send('Please provide a target language!');
        }

        const targetLang = args.shift(); 

        if (!message.reference) {
            return message.channel.send('please reply to the message you want to translate');
        }
     
        try {
            const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
            const text = referencedMessage.content;

            const translated = await translate(text, targetLang); 
            message.channel.send(translated);
        } catch (error) {
            console.error(error);
            message.channel.send('There was an error translating the message.');
        }
    },
};