/**
 * Unix V4 Shell Simulation
 *
 * A simplified recreation of the Unix V4 shell (sh).
 * Supports basic commands and running the games.
 *
 * Historical note: The Unix V4 shell was written by Ken Thompson.
 * It's the ancestor of all modern Unix shells.
 */

import { UnixFilesystem } from '../fs/filesystem.js';
import { MooGame } from '../games/moo.js';
import { TicTacToe } from '../games/ttt.js';
import { WumpGame } from '../games/wump.js';

export class UnixShell {
  constructor(io) {
    this.io = io;
    this.fs = new UnixFilesystem();
    this.cwd = '/';
    this.env = {
      HOME: '/',
      PATH: '/bin:/usr/bin:/usr/games',
      USER: 'root',
      TERM: 'vt100'
    };
    this.running = true;
    this.currentGame = null;

    // ttt.k storage for learning
    this.tttKnowledge = '';
  }

  /**
   * Parse a simple command line
   */
  parseCommand(line) {
    const parts = line.trim().split(/\s+/);
    const cmd = parts[0] || '';
    const args = parts.slice(1);
    return { cmd, args };
  }

  /**
   * Resolve a path (handle . and ..)
   */
  resolvePath(path) {
    if (path.startsWith('/')) {
      return path;
    }

    // Relative path
    let base = this.cwd;
    if (!base.endsWith('/')) base += '/';
    return base + path;
  }

  /**
   * Format date like Unix V4
   */
  formatDate(timestamp) {
    const d = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate().toString().padStart(2)} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  /**
   * Execute a command
   */
  async execute(line) {
    const { cmd, args } = this.parseCommand(line);

    if (!cmd) return;

    switch (cmd) {
      case 'exit':
      case 'logout':
        this.running = false;
        break;

      case 'pwd':
        this.io.write(this.cwd + '\n');
        break;

      case 'cd':
        await this.cmd_cd(args);
        break;

      case 'ls':
        await this.cmd_ls(args);
        break;

      case 'cat':
        await this.cmd_cat(args);
        break;

      case 'echo':
        this.io.write(args.join(' ') + '\n');
        break;

      case 'date':
        const now = new Date();
        // Unix V4 date format: Wed Jun 12 19:51:34 EDT 1974
        this.io.write(now.toString() + '\n');
        break;

      case 'who':
        this.io.write('root     tty0    Jun 10 00:00\n');
        break;

      case 'uname':
        this.io.write('Unix Fourth Edition\n');
        break;

      case 'help':
        await this.cmd_help();
        break;

      case 'clear':
        this.io.write('\x1b[2J\x1b[H');
        break;

      // Games!
      case '/usr/games/moo':
      case 'moo':
        await this.runGame('moo');
        break;

      case '/usr/games/ttt':
      case 'ttt':
        await this.runGame('ttt');
        break;

      case '/usr/games/wump':
      case 'wump':
        await this.runGame('wump');
        break;

      case '/usr/games/bj':
      case 'bj':
        this.io.write('Black Jack\n[Not yet implemented - try moo, ttt, or wump]\n');
        break;

      case '/usr/games/chess':
      case 'chess':
        this.io.write('Chess\n[Not yet implemented - try moo, ttt, or wump]\n');
        break;

      case '/usr/games/cubic':
      case 'cubic':
        this.io.write('Cubic (4x4x4 Tic-Tac-Toe)\n[Not yet implemented - try moo, ttt, or wump]\n');
        break;

      default:
        // Try to find it as a path
        const inode = this.fs.namei(this.resolvePath(cmd));
        if (inode && inode.isExecutable()) {
          this.io.write(`${cmd}: execution not supported\n`);
        } else {
          this.io.write(`${cmd}: not found\n`);
        }
    }
  }

  async cmd_cd(args) {
    const path = args[0] || '/';
    const resolved = this.resolvePath(path);
    const inode = this.fs.namei(resolved);

    if (!inode) {
      this.io.write(`cd: ${path}: not found\n`);
      return;
    }

    if (!inode.isDirectory()) {
      this.io.write(`cd: ${path}: not a directory\n`);
      return;
    }

    this.cwd = resolved;
  }

  async cmd_ls(args) {
    let path = args[0] || this.cwd;
    const longFormat = args.includes('-l');
    const all = args.includes('-a');

    // Filter out flags from path
    if (path.startsWith('-')) {
      path = this.cwd;
    }

    const resolved = this.resolvePath(path);
    const entries = this.fs.readdir(resolved);

    if (!entries) {
      this.io.write(`ls: ${path}: not found\n`);
      return;
    }

    for (const entry of entries) {
      // Skip . and .. unless -a
      if (!all && (entry.name === '.' || entry.name === '..')) {
        continue;
      }

      if (longFormat) {
        const inode = entry.inode;
        const perms = inode.getPermissionString();
        const size = inode.i_size.toString().padStart(6);
        const date = this.formatDate(inode.i_mtime);
        this.io.write(`${perms} ${inode.i_nlink} root ${size} ${date} ${entry.name}\n`);
      } else {
        this.io.write(entry.name + '\n');
      }
    }
  }

  async cmd_cat(args) {
    if (args.length === 0) {
      this.io.write('cat: missing file operand\n');
      return;
    }

    for (const path of args) {
      const resolved = this.resolvePath(path);
      const content = this.fs.read(resolved);

      if (content === null) {
        this.io.write(`cat: ${path}: not found or is directory\n`);
        continue;
      }

      this.io.write(content);
      if (!content.endsWith('\n')) {
        this.io.write('\n');
      }
    }
  }

  async cmd_help() {
    this.io.write(`Unix V4 Shell Commands:
  ls [-la]      - list directory contents
  cd [dir]      - change directory
  pwd           - print working directory
  cat file      - display file contents
  echo text     - display text
  date          - show current date/time
  who           - show logged in users
  uname         - show system name
  clear         - clear screen
  exit          - exit shell

Games (in /usr/games):
  moo           - Bulls and Cows (624 bytes)
  ttt           - Tic-Tac-Toe with learning (2192 bytes)
  wump          - Hunt the Wumpus (5386 bytes)
  bj            - Blackjack [not implemented]
  chess         - Chess [not implemented]
  cubic         - 4x4x4 Tic-Tac-Toe [not implemented]

Type a game name to play!
`);
  }

  async runGame(name) {
    const gameIo = {
      write: (s) => this.io.write(s),
      read: () => this.io.read()
    };

    try {
      switch (name) {
        case 'moo':
          const moo = new MooGame(gameIo);
          await moo.run();
          break;

        case 'ttt':
          // Create storage for ttt.k
          const storage = {
            read: async () => this.tttKnowledge,
            write: async (data) => { this.tttKnowledge = data; }
          };
          const ttt = new TicTacToe(gameIo, storage);
          await ttt.run();
          break;

        case 'wump':
          const wump = new WumpGame(gameIo);
          await wump.run();
          break;
      }
    } catch (e) {
      if (e.message === 'EOF' || e.message === 'INTERRUPT') {
        // Game was interrupted, return to shell
      } else {
        throw e;
      }
    }
  }

  /**
   * Show login prompt and MOTD
   */
  async login() {
    // Skip actual login for simplicity
    this.io.write('\nUnix Fourth Edition\n');
    this.io.write('Bell Telephone Laboratories\n');
    this.io.write('1973\n\n');
  }

  /**
   * Main loop
   */
  async run() {
    await this.login();

    while (this.running) {
      this.io.write('# ');
      const line = await this.io.read();

      if (line === null) {
        // EOF
        break;
      }

      try {
        await this.execute(line);
      } catch (e) {
        this.io.write(`Error: ${e.message}\n`);
      }
    }

    this.io.write('logout\n');
  }
}
