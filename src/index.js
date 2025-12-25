/**
 * Unix V4 Web - Main Entry Point
 *
 * Brings the 1973 Unix Fourth Edition to modern JavaScript.
 *
 * Usage:
 *   Browser: import { UnixShell, Terminal } from 'unix-v4-web';
 *   Node.js: node bin/unix-v4.js
 */

export { UnixFilesystem } from './fs/filesystem.js';
export { UnixShell } from './shell/shell.js';
export { MooGame } from './games/moo.js';
export { TicTacToe } from './games/ttt.js';
export { WumpGame } from './games/wump.js';

/**
 * Create an I/O interface for the browser terminal
 */
export function createTerminalIO(terminal) {
  let inputResolve = null;
  let inputBuffer = '';

  terminal.onData((data) => {
    // Echo character
    terminal.write(data);

    if (data === '\r' || data === '\n') {
      terminal.write('\n');
      if (inputResolve) {
        const line = inputBuffer;
        inputBuffer = '';
        inputResolve(line);
        inputResolve = null;
      }
    } else if (data === '\x7f' || data === '\b') {
      // Backspace
      if (inputBuffer.length > 0) {
        inputBuffer = inputBuffer.slice(0, -1);
        terminal.write('\b \b');
      }
    } else if (data === '\x03') {
      // Ctrl-C
      inputBuffer = '';
      terminal.write('^C\n');
      if (inputResolve) {
        inputResolve(null);
        inputResolve = null;
      }
    } else {
      inputBuffer += data;
    }
  });

  return {
    write: (s) => terminal.write(s.replace(/\n/g, '\r\n')),
    read: () => new Promise((resolve) => { inputResolve = resolve; })
  };
}

/**
 * Boot Unix V4 in a terminal
 */
export async function boot(io) {
  const shell = new UnixShell(io);
  await shell.run();
}
