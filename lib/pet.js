/**
 * Pet 类 — 宠物核心逻辑
 * 管理宠物状态、属性变化、行为响应
 */

'use strict';

const PetType = {
  CAT: 'cat',
  DOG: 'dog',
  DRAGON: 'dragon',
  BUNNY: 'bunny',
  PENGUIN: 'penguin',
  FOX: 'fox'
};

const PetState = {
  IDLE: 'idle',
  HAPPY: 'happy',
  SAD: 'sad',
  EATING: 'eating',
  SLEEPING: 'sleeping',
  SICK: 'sick',
  HUNGRY: 'hungry',
  DEAD: 'dead'
};

class Pet {
  constructor(data = {}) {
    this.name = data.name || 'Unnamed';
    this.type = data.type || PetType.CAT;
    this.health = clamp(data.health ?? 100, 0, 100);
    this.happiness = clamp(data.happiness ?? 80, 0, 100);
    this.hunger = clamp(data.hunger ?? 80, 0, 100);
    this.energy = clamp(data.energy ?? 100, 0, 100);
    this.cleanliness = clamp(data.cleanliness ?? 100, 0, 100);
    this.createdAt = data.createdAt || Date.now();
    this.lastTick = data.lastTick || Date.now();
    this.lastAction = data.lastAction || null;
    this.lastActionTime = data.lastActionTime || null;
    this.log = data.log || [];
    this.totalActions = data.totalActions || 0;
    this.level = data.level || 1;
    this.xp = data.xp || 0;
  }

  /**
   * 创建新宠物
   */
  static create(type, name) {
    return new Pet({
      name,
      type,
      health: 100,
      happiness: 80,
      hunger: 80,
      energy: 100,
      cleanliness: 100,
      createdAt: Date.now(),
      lastTick: Date.now()
    });
  }

  /**
   * 基于时间流逝更新状态
   * 每分钟：饥饿 +2, 快乐 -1, 精力 +1, 清洁 -0.5
   */
  tick() {
    const now = Date.now();
    const elapsed = now - this.lastTick;
    const minutes = elapsed / 60000;

    if (minutes < 1) return; // 不到1分钟不更新

    // 属性衰减
    this.hunger = clamp(this.hunger - minutes * 2, 0, 100);
    this.happiness = clamp(this.happiness - minutes * 1, 0, 100);
    this.cleanliness = clamp(this.cleanliness - minutes * 0.5, 0, 100);
    this.energy = clamp(this.energy + minutes * 0.5, 0, 100);

    // 饥饿过度会影响健康
    if (this.hunger < 10) {
      this.health = clamp(this.health - minutes * 1, 0, 100);
    }

    // 极度不开心也会影响健康
    if (this.happiness < 5) {
      this.health = clamp(this.health - minutes * 0.5, 0, 100);
    }

    this.lastTick = now;
  }

  /**
   * 执行动作
   */
  performAction(action) {
    switch (action) {
      case 'feed':
        this.hunger = clamp(this.hunger + 30, 0, 100);
        this.happiness = clamp(this.happiness + 5, 0, 100);
        this.energy = clamp(this.energy + 5, 0, 100);
        this.addXP(5);
        break;
      case 'play':
        this.happiness = clamp(this.happiness + 20, 0, 100);
        this.energy = clamp(this.energy - 15, 0, 100);
        this.hunger = clamp(this.hunger - 5, 0, 100);
        this.cleanliness = clamp(this.cleanliness - 5, 0, 100);
        this.addXP(8);
        break;
      case 'sleep':
        this.energy = clamp(this.energy + 40, 0, 100);
        this.health = clamp(this.health + 5, 0, 100);
        this.hunger = clamp(this.hunger - 10, 0, 100);
        this.addXP(3);
        break;
      case 'pet':
        this.happiness = clamp(this.happiness + 10, 0, 100);
        this.energy = clamp(this.energy - 3, 0, 100);
        this.addXP(4);
        break;
      case 'clean':
        this.cleanliness = clamp(this.cleanliness + 40, 0, 100);
        this.happiness = clamp(this.happiness + 5, 0, 100);
        this.addXP(4);
        break;
      case 'walk':
        this.happiness = clamp(this.happiness + 15, 0, 100);
        this.energy = clamp(this.energy - 20, 0, 100);
        this.hunger = clamp(this.hunger - 8, 0, 100);
        this.cleanliness = clamp(this.cleanliness - 8, 0, 100);
        this.health = clamp(this.health + 3, 0, 100);
        this.addXP(10);
        break;
      case 'heal':
        this.health = clamp(this.health + 25, 0, 100);
        this.energy = clamp(this.energy - 10, 0, 100);
        this.addXP(3);
        break;
    }

    this.lastAction = action;
    this.lastActionTime = Date.now();
    this.totalActions++;

    // 添加日志
    this.log.push({
      action,
      time: Date.now(),
      stats: {
        hp: Math.round(this.health),
        happy: Math.round(this.happiness),
        hunger: Math.round(this.hunger),
        energy: Math.round(this.energy),
        clean: Math.round(this.cleanliness)
      }
    });

    // 限制日志数量
    if (this.log.length > 200) {
      this.log = this.log.slice(-100);
    }
  }

  /**
   * 添加经验值，检查升级
   */
  addXP(amount) {
    this.xp += amount;
    const xpNeeded = this.level * 20;
    if (this.xp >= xpNeeded) {
      this.xp -= xpNeeded;
      this.level++;
      // 升级恢复一些属性
      this.health = clamp(this.health + 10, 0, 100);
      this.happiness = clamp(this.happiness + 10, 0, 100);
    }
  }

  /**
   * 改名
   */
  rename(newName) {
    if (!newName) {
      console.log('\n  ❌ 请提供新名字: termpet rename <名字>\n');
      return;
    }
    const oldName = this.name;
    this.name = newName;
    console.log(`\n  ✏️  ${oldName} 现在叫 ${newName} 了！\n`);
  }

  /**
   * 获取心情
   */
  getMood() {
    const avg = (this.health + this.happiness + this.hunger + this.energy + this.cleanliness) / 5;

    if (this.health <= 0) return { emoji: '💀', text: '已经去了另一个世界...', color: 'red' };
    if (avg > 80) return { emoji: '😊', text: '非常开心！', color: 'green' };
    if (avg > 60) return { emoji: '🙂', text: '还不错', color: 'cyan' };
    if (avg > 40) return { emoji: '😐', text: '一般般', color: 'yellow' };
    if (avg > 20) return { emoji: '😟', text: '不太开心', color: 'yellow' };
    return { emoji: '😢', text: '很难过...', color: 'red' };
  }

  /**
   * 获取警告信息
   */
  getWarnings() {
    const warnings = [];
    if (this.hunger < 15) warnings.push(`${this.name} 快饿坏了！赶紧喂食！`);
    if (this.health < 20) warnings.push(`${this.name} 健康状况很差，需要治疗！`);
    if (this.energy < 10) warnings.push(`${this.name} 累坏了，让它休息一下吧`);
    if (this.happiness < 15) warnings.push(`${this.name} 很不开心，陪它玩一玩吧`);
    if (this.cleanliness < 15) warnings.push(`${this.name} 需要洗澡了！`);
    return warnings;
  }

  /**
   * 获取年龄描述
   */
  getAge() {
    const diff = Date.now() - this.createdAt;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚出生';
    if (mins < 60) return `${mins}分钟`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}小时`;
    const days = Math.floor(hours / 24);
    return `${days}天`;
  }

  /**
   * 获取日志
   */
  getLog(count = 10) {
    return this.log.slice(-count);
  }

  /**
   * 序列化为 JSON
   */
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      health: Math.round(this.health * 100) / 100,
      happiness: Math.round(this.happiness * 100) / 100,
      hunger: Math.round(this.hunger * 100) / 100,
      energy: Math.round(this.energy * 100) / 100,
      cleanliness: Math.round(this.cleanliness * 100) / 100,
      createdAt: this.createdAt,
      lastTick: this.lastTick,
      lastAction: this.lastAction,
      lastActionTime: this.lastActionTime,
      log: this.log,
      totalActions: this.totalActions,
      level: this.level,
      xp: this.xp
    };
  }
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

module.exports = { Pet, PetState, PetType };
