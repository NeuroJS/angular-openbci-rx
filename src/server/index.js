
const { Cyton } = require('openbci-observable');
const { voltsToMicrovolts, bufferCount } = require('eeg-pipes');
const io = require('socket.io')(4301);

const simulate = process.argv[2] === '--simulate';
const options = { verbose: true, simulate };

async function init () {
    const brain = new Cyton(options);
    await brain.connect();
    await brain.start();

    brain.stream
        .pipe(voltsToMicrovolts(), bufferCount(250))
        .subscribe(eeg => io.emit('metric:eeg', eeg));
}

init();
