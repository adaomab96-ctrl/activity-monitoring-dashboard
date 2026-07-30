/**
 * Start wrapper — ensures NODE_TLS_REJECT_UNAUTHORIZED=0 is inherited
 * by ALL child processes that nest start --watch spawns.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { spawn } = require('child_process');
const path = require('path');

// On Windows use nest.cmd, on Unix use nest
const isWindows = process.platform === 'win32';
const nestCmd  = isWindows ? 'nest.cmd' : 'nest';
const nestBin  = path.join(__dirname, 'node_modules', '.bin', nestCmd);

console.log('🔧 Starting NestJS with TLS verification disabled...');

const child = spawn(nestBin, ['start', '--watch'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
  },
  shell: true,  // required for .cmd files on Windows
});

child.on('error', (err) => {
  console.error('Failed to start nest:', err.message);
  process.exit(1);
});

child.on('exit', (code) => process.exit(code || 0));
