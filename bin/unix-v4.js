#!/usr/bin/env node
/**
 * Unix V4 CLI
 *
 * Run Unix V4 shell in your terminal:
 *   node bin/unix-v4.js
 *
 * Or with npm:
 *   npm start
 */

import * as readline from 'readline';
import { UnixShell } from '../src/shell/shell.js';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// I/O interface for Node.js
const io = {
  write: (s) => process.stdout.write(s),
  read: () => new Promise((resolve) => {
    rl.once('line', (line) => resolve(line));
    rl.once('close', () => resolve(null));
  })
};

// ASCII art banner
console.log(`
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ██╗   ██╗███╗   ██╗██╗██╗  ██╗    ██╗   ██╗██╗  ██╗       │
│   ██║   ██║████╗  ██║██║╚██╗██╔╝    ██║   ██║██║  ██║       │
│   ██║   ██║██╔██╗ ██║██║ ╚███╔╝     ██║   ██║███████║       │
│   ██║   ██║██║╚██╗██║██║ ██╔██╗     ╚██╗ ██╔╝╚════██║       │
│   ╚██████╔╝██║ ╚████║██║██╔╝ ██╗     ╚████╔╝      ██║       │
│    ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝      ╚═══╝       ╚═╝       │
│                                                              │
│           Bell Telephone Laboratories, 1973                  │
│                                                              │
│   The first Unix with kernel written in C                    │
│   Recovered from tape, December 2025                         │
│                                                              │
│   Type 'help' for commands, or try: moo, ttt, wump           │
│   Type 'exit' to quit                                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
`);

// Run shell
const shell = new UnixShell(io);
shell.run().then(() => {
  rl.close();
  process.exit(0);
}).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
