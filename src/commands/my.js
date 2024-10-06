const os = require('os');
const config = require('../../config');
const { version: discordJsVersion } = require('discord.js-selfbot-v13');
const { version: nodeVersion } = process;

module.exports = {
    name: 'system',
    description: 'Displays system information',
    async execute(message, args) {
        if(message.author.id !== config.owner) return "***You don't have the authority to do this***";

        const totalMemory = os.totalmem(); 
        const freeMemory = os.freemem(); 
        const usedMemory = totalMemory - freeMemory; 

        const totalMemoryMB = (totalMemory / (1024 * 1024)).toFixed(2);
        const freeMemoryMB = (freeMemory / (1024 * 1024)).toFixed(2);
        const usedMemoryMB = (usedMemory / (1024 * 1024)).toFixed(2);

        const cpus = os.cpus();
        const cpuUsage = cpus.map(cpu => {
            const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
            const usage = ((total - cpu.times.idle) / total) * 100;
            return usage.toFixed(2); 
        });

        message.channel.send(`
**Current System Information:**
- **Total RAM:** ${totalMemoryMB} MB
- **Free RAM:** ${freeMemoryMB} MB
- **Used RAM:** ${usedMemoryMB} MB
- **CPU Usage:** ${cpuUsage.join('% ')}%
- **Node.js Version:** ${nodeVersion}
- **SelfBot.js Version:** ${discordJsVersion}
        `);
    },
};
