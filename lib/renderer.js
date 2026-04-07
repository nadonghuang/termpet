/**
 * Renderer — 终端渲染工具
 * 负责彩色输出、ASCII 艺术、状态条等
 */

'use strict';

const ART = require('./art');

// ANSI 颜色代码
const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bgWhite: '\x1b[47m',
};

class Renderer {
  /**
   * 给文本上色
   */
  static colorize(text, color) {
    // 检测 NO_COLOR 环境变量
    if (process.env.NO_COLOR) return text;
    const code = COLORS[color] || COLORS.reset;
    return `${code}${text}${COLORS.reset}`;
  }

  /**
   * 绘制带边框的盒子
   */
  static box(lines) {
    const maxWidth = 44;
    const bordered = [];

    // 顶边
    bordered.push(Renderer.colorize(`╭${'─'.repeat(maxWidth)}╮`, 'cyan'));

    for (const line of lines) {
      // 去除 ANSI 码来计算可见宽度
      const visibleLen = stripAnsi(line).length;
      const padding = Math.max(0, maxWidth - visibleLen);
      bordered.push(Renderer.colorize('│', 'cyan') + line + ' '.repeat(padding) + Renderer.colorize('│', 'cyan'));
    }

    // 底边
    bordered.push(Renderer.colorize(`╰${'─'.repeat(maxWidth)}╯`, 'cyan'));

    return '\n' + bordered.join('\n') + '\n';
  }

  /**
   * 绘制属性状态条
   */
  static statBar(label, value, max, color) {
    const barWidth = 20;
    const ratio = value / max;
    const filled = Math.round(ratio * barWidth);
    const empty = barWidth - filled;

    const bar = '█'.repeat(Math.max(0, filled)) + '░'.repeat(Math.max(0, empty));
    const num = `${Math.round(value)}`.padStart(3, ' ');

    const coloredBar = Renderer.colorize(bar, color);
    const coloredNum = Renderer.colorize(num, 'white');
    const labelPadded = label.padEnd(4, '　');

    return `  ${labelPadded} ${coloredBar} ${coloredNum}/${max}`;
  }

  /**
   * 获取 ASCII 艺术
   */
  static getArt(type, state) {
    const petArt = ART[type];
    if (!petArt) return '  ???';

    const frames = petArt[state] || petArt['idle'] || ['  ???'];
    const frame = Array.isArray(frames[0]) ? frames[Math.floor(Math.random() * frames.length)] : frames;

    return frame.map(line => `  ${line}`).join('\n');
  }

  /**
   * 进度条（用于 XP）
   */
  static xpBar(current, needed) {
    const barWidth = 10;
    const ratio = current / needed;
    const filled = Math.round(ratio * barWidth);
    const bar = '▸'.repeat(filled) + '▹'.repeat(barWidth - filled);
    return Renderer.colorize(bar, 'green');
  }
}

/**
 * 去除 ANSI 转义码
 */
function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

module.exports = { Renderer, stripAnsi };
