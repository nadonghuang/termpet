#!/usr/bin/env node

/**
 * termpet 🐾 — 终端虚拟宠物
 * 你的命令行里的 Tamagotchi
 */

'use strict';

const { Pet, PetState, PetType } = require('../lib/pet');
const { Renderer } = require('../lib/renderer');
const { PetFile } = require('../lib/storage');
const { ACTIONS } = require('../lib/actions');

// ─── 主入口 ───
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  // 帮助信息
  if (command === '--help' || command === '-h' || command === 'help') {
    showHelp();
    return;
  }

  // 版本信息
  if (command === '--version' || command === '-v') {
    const pkg = require('../package.json');
    console.log(`termpet v${pkg.version}`);
    return;
  }

  // 初始化新宠物
  if (command === 'new') {
    createNewPet(args.slice(1));
    return;
  }

  // 加载宠物
  const petFile = new PetFile();
  let pet;

  try {
    pet = petFile.load();
  } catch (e) {
    console.log(Renderer.colorize('\n🐾 还没有宠物！用以下命令创建一个:', 'yellow'));
    console.log(Renderer.colorize('  termpet new <类型> <名字>', 'cyan'));
    console.log(Renderer.colorize('  类型: cat, dog, dragon, bunny, penguin, fox\n', 'gray'));
    return;
  }

  // 更新宠物状态（基于时间流逝）
  pet.tick();

  // 执行命令
  switch (command) {
    case 'status':
    case 's':
      showStatus(pet);
      break;
    case 'feed':
    case 'f':
      pet.performAction('feed');
      showStatus(pet);
      break;
    case 'play':
    case 'p':
      pet.performAction('play');
      showStatus(pet);
      break;
    case 'sleep':
    case 'sl':
      pet.performAction('sleep');
      showStatus(pet);
      break;
    case 'pet':
    case 'pat':
      pet.performAction('pet');
      showStatus(pet);
      break;
    case 'clean':
    case 'c':
      pet.performAction('clean');
      showStatus(pet);
      break;
    case 'walk':
    case 'w':
      pet.performAction('walk');
      showStatus(pet);
      break;
    case 'heal':
    case 'h':
      pet.performAction('heal');
      showStatus(pet);
      break;
    case 'rename':
      pet.rename(args[1]);
      showStatus(pet);
      break;
    case 'release':
      releasePet(petFile);
      return;
    case 'log':
    case 'l':
      showLog(pet, args[1]);
      break;
    default:
      console.log(Renderer.colorize(`\n❓ 未知命令: ${command}`, 'red'));
      showHelp();
  }

  // 保存状态
  petFile.save(pet);
}

// ─── 创建新宠物 ───
function createNewPet(args) {
  const petFile = new PetFile();

  // 如果已有宠物，确认是否替换
  try {
    const existing = petFile.load();
    console.log(Renderer.colorize(`\n⚠️  你已经有一只宠物 "${existing.name}" 了！`, 'yellow'));
    console.log(Renderer.colorize('  用 termpet release 释放当前宠物后再创建新的\n', 'gray'));
    return;
  } catch (_) {
    // 没有宠物，继续创建
  }

  const typeStr = args[0] || 'cat';
  const name = args[1] || getRandomName();

  // 验证类型
  const validTypes = ['cat', 'dog', 'dragon', 'bunny', 'penguin', 'fox'];
  if (!validTypes.includes(typeStr)) {
    console.log(Renderer.colorize(`\n❌ 未知宠物类型: ${typeStr}`, 'red'));
    console.log(Renderer.colorize(`  可选类型: ${validTypes.join(', ')}\n`, 'cyan'));
    return;
  }

  const pet = Pet.create(typeStr, name);
  petFile.save(pet);

  console.log(Renderer.box([
    '',
    Renderer.colorize('🎉 新宠物诞生了！', 'green'),
    '',
    Renderer.getArt(pet.type, 'happy'),
    '',
    Renderer.colorize(`  ${name} the ${typeStr}`, 'yellow'),
    Renderer.colorize(`  HP: ${pet.health}  😊: ${pet.happiness}  🍖: ${pet.hunger}`, 'cyan'),
    '',
    Renderer.colorize('  用 termpet feed 喂食', 'gray'),
    Renderer.colorize('  用 termpet play 玩耍', 'gray'),
    Renderer.colorize('  用 termpet status 查看状态', 'gray'),
    ''
  ]));
}

// ─── 显示宠物状态 ───
function showStatus(pet) {
  const mood = pet.getMood();
  const artKey = getArtKeyForState(pet);
  const age = pet.getAge();

  const lines = [
    '',
    Renderer.colorize(`  ${pet.name} the ${pet.type}`, 'yellow') + Renderer.colorize(` (${age})`, 'gray'),
    '',
    Renderer.getArt(pet.type, artKey),
    '',
    Renderer.colorize(`  心情: ${mood.emoji} ${mood.text}`, mood.color),
    '',
    Renderer.statBar('HP', pet.health, 100, 'green'),
    Renderer.statBar('快乐', pet.happiness, 100, 'yellow'),
    Renderer.statBar('饱食', pet.hunger, 100, 'cyan'),
    Renderer.statBar('精力', pet.energy, 100, 'magenta'),
    Renderer.statBar('清洁', pet.cleanliness, 100, 'blue'),
    '',
  ];

  // 如果宠物有状态提示
  const warnings = pet.getWarnings();
  if (warnings.length > 0) {
    lines.push(...warnings.map(w => Renderer.colorize(`  ⚠️  ${w}`, 'red')));
    lines.push('');
  }

  // 最后活动
  if (pet.lastAction) {
    const ago = timeAgo(pet.lastActionTime);
    lines.push(Renderer.colorize(`  最后活动: ${ACTIONS[pet.lastAction]?.emoji || '❓'} ${ACTIONS[pet.lastAction]?.name || pet.lastAction} (${ago})`, 'gray'));
    lines.push('');
  }

  console.log(Renderer.box(lines));
}

// ─── 显示日志 ───
function showLog(pet, count) {
  const n = parseInt(count) || 10;
  const logs = pet.getLog(n);

  if (logs.length === 0) {
    console.log(Renderer.colorize('\n📜 暂无活动记录\n', 'gray'));
    return;
  }

  const lines = [''];
  lines.push(Renderer.colorize(`📜 ${pet.name} 的活动记录 (最近 ${logs.length} 条)`, 'yellow'));
  lines.push('');

  for (const entry of logs) {
    const time = new Date(entry.time).toLocaleString('zh-CN');
    const action = ACTIONS[entry.action];
    const emoji = action?.emoji || '•';
    const name = action?.name || entry.action;
    lines.push(Renderer.colorize(`  ${emoji} ${name.padEnd(8)} — ${time}`, 'cyan'));
  }

  lines.push('');
  console.log(Renderer.box(lines));
}

// ─── 释放宠物 ───
function releasePet(petFile) {
  const pet = petFile.load();
  console.log(Renderer.box([
    '',
    Renderer.getArt(pet.type, 'sad'),
    '',
    Renderer.colorize(`  再见了, ${pet.name}... 💔`, 'red'),
    '',
    Renderer.colorize('  宠物已释放。用 termpet new 创建新宠物。', 'gray'),
    ''
  ]));
  petFile.delete();
}

// ─── 辅助函数 ───
function getArtKeyForState(pet) {
  if (pet.health <= 10) return 'sick';
  if (pet.energy <= 10) return 'sleeping';
  if (pet.hunger <= 10) return 'hungry';
  if (pet.lastAction === 'feed') return 'eating';
  if (pet.lastAction === 'play' || pet.lastAction === 'walk') return 'happy';
  if (pet.lastAction === 'sleep') return 'sleeping';
  if (pet.happiness > 70) return 'happy';
  if (pet.happiness < 30) return 'sad';
  return 'idle';
}

function getRandomName() {
  const names = [
    'Mochi', 'Boba', 'Tofu', 'Nori', 'Wasabi',
    'Pixel', 'Byte', 'Neo', 'Echo', 'Luna',
    'Kumo', 'Sora', 'Mango', 'Peach', 'Berry',
    'Noodle', 'Dumpling', 'Sushi', 'Miso', 'Matcha'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

function timeAgo(timestamp) {
  if (!timestamp) return '未知';
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  return `${days}天前`;
}

function showHelp() {
  console.log(Renderer.box([
    '',
    Renderer.colorize('🐾 termpet — 终端虚拟宠物', 'green'),
    '',
    Renderer.colorize('用法:', 'yellow'),
    Renderer.colorize('  termpet new <类型> [名字]    创建新宠物', 'cyan'),
    Renderer.colorize('  termpet status              查看宠物状态', 'cyan'),
    Renderer.colorize('  termpet feed                喂食', 'cyan'),
    Renderer.colorize('  termpet play                玩耍', 'cyan'),
    Renderer.colorize('  termpet sleep               让它睡觉', 'cyan'),
    Renderer.colorize('  termpet pet                 抚摸', 'cyan'),
    Renderer.colorize('  termpet clean               清洁', 'cyan'),
    Renderer.colorize('  termpet walk                散步', 'cyan'),
    Renderer.colorize('  termpet heal                治疗', 'cyan'),
    Renderer.colorize('  termpet rename <名字>       改名', 'cyan'),
    Renderer.colorize('  termpet log [数量]          活动记录', 'cyan'),
    Renderer.colorize('  termpet release             释放宠物', 'cyan'),
    '',
    Renderer.colorize('宠物类型:', 'yellow'),
    Renderer.colorize('  cat 🐱  dog 🐶  dragon 🐲  bunny 🐰  penguin 🐧  fox 🦊', 'cyan'),
    ''
  ]));
}

main();
