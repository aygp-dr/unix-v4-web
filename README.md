# Unix V4 Web

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-yellow.svg)]()
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)]()

**Unix Fourth Edition (1973) running in your browser and Node.js.**

The first operating system with its kernel written in C, recovered from a
University of Utah tape in December 2025, now preserved in JavaScript.

## Quick Start

### Node.js

```bash
git clone https://github.com/aygp-dr/unix-v4-web
cd unix-v4-web
node bin/unix-v4.js
```

## Games Included

| Game | Size | Description |
|------|------|-------------|
| **moo** | 624 bytes | Bulls and Cows (Mastermind predecessor) |
| **ttt** | 2,192 bytes | Tic-Tac-Toe with **machine learning** |
| **wump** | 5,386 bytes | Hunt the Wumpus |

## Features

### Shell Commands

```
ls [-la]      - list directory contents
cd [dir]      - change directory
pwd           - print working directory
cat file      - display file contents
date          - show current date/time
help          - show all commands
exit          - exit shell
```

### TTT Learning

The tic-tac-toe learns from experience, like the 1973 original:

```
# ttt
Tic-Tac-Toe
Accumulated knowledge? y
268 'bits' of knowledge
```

When you beat it, it updates its knowledge. Play again—it won't fall
for the same tricks.

## Historical Context

```
┌─────────────────────────────────────────────────────────────┐
│                    Unix Fourth Edition                       │
│                                                             │
│  Released: November 1973                                    │
│  Authors: Ken Thompson, Dennis Ritchie                      │
│  Significance: First Unix with kernel written in C          │
│  Recovered: December 2025 from University of Utah tape      │
└─────────────────────────────────────────────────────────────┘
```

## Architecture

```
unix-v4-web/
├── src/
│   ├── fs/filesystem.js    # Inode-based filesystem
│   ├── shell/shell.js      # V4 shell simulation
│   ├── games/
│   │   ├── moo.js          # Bulls and Cows
│   │   ├── ttt.js          # Tic-Tac-Toe with learning
│   │   └── wump.js         # Hunt the Wumpus
│   └── index.js            # Main exports
├── bin/unix-v4.js          # CLI entry point
└── public/index.html       # Web terminal
```

## References

- [squoze.net Unix V4](http://squoze.net/UNIX/v4/)
- [Unix History Repository](https://github.com/dspinellis/unix-history-repo)
- [MENACE](https://en.wikipedia.org/wiki/MENACE_(machine_learning))

## License

MIT
