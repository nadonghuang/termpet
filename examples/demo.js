#!/usr/bin/env node

/**
 * termpet 示例 — 快速演示
 */

'use strict';

const { Pet } = require('../lib/pet');
const { Renderer } = require('../lib/renderer');

// 创建一只猫
const cat = Pet.create('cat', 'Mochi');
console.log(Renderer.box([
  '',
  Renderer.colorize('🐾 创建宠物: Mochi the cat', 'green'),
  '',
  Renderer.getArt('cat', 'idle'),
  ''
]));

// 喂食
cat.performAction('feed');
console.log(Renderer.box([
  '',
  Renderer.colorize('🍖 喂食了 Mochi！', 'cyan'),
  '',
  Renderer.getArt('cat', 'eating'),
  '',
  Renderer.statBar('饱食', cat.hunger, 100, 'cyan'),
  ''
]));

// 玩耍
cat.performAction('play');
console.log(Renderer.box([
  '',
  Renderer.colorize('🎾 和 Mochi 玩耍！', 'yellow'),
  '',
  Renderer.getArt('cat', 'happy'),
  '',
  Renderer.statBar('快乐', cat.happiness, 100, 'yellow'),
  ''
]));

// 展示所有宠物类型
console.log(Renderer.box([
  '',
  Renderer.colorize('🐾 所有宠物类型', 'green'),
  ''
]));

const types = ['cat', 'dog', 'dragon', 'bunny', 'penguin', 'fox'];
for (const type of types) {
  const art = Renderer.getArt(type, 'idle');
  console.log(Renderer.colorize(`  ${type}:`, 'yellow'));
  console.log(art);
  console.log('');
}
