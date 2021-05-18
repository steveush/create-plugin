const spawn = require("cross-spawn");

const install = (target, ...packageName) => {
    return new Promise((resolve, reject) => {
        const command = 'npm',
            args = ['install', '-D', ...packageName];
        process.chdir(target);
        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', (code) => {
            if (code !== 0) {
                return reject(`installDeps failed: ${command} ${args.join(' ')}`);
            }
            resolve();
        });
    });
};

module.exports = install;