/**
 * Storage — 宠物数据持久化
 * 存储在 ~/.termpet/pet.json
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { Pet } = require('./pet');

class PetFile {
  constructor() {
    this.dir = path.join(os.homedir(), '.termpet');
    this.file = path.join(this.dir, 'pet.json');
  }

  /**
   * 确保目录存在
   */
  ensureDir() {
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir, { recursive: true });
    }
  }

  /**
   * 加载宠物
   */
  load() {
    if (!fs.existsSync(this.file)) {
      throw new Error('No pet found');
    }
    const raw = fs.readFileSync(this.file, 'utf-8');
    const data = JSON.parse(raw);
    return new Pet(data);
  }

  /**
   * 保存宠物
   */
  save(pet) {
    this.ensureDir();
    const data = pet.toJSON ? pet.toJSON() : pet;
    fs.writeFileSync(this.file, JSON.stringify(data, null, 2), 'utf-8');
  }

  /**
   * 删除宠物
   */
  delete() {
    if (fs.existsSync(this.file)) {
      fs.unlinkSync(this.file);
    }
  }

  /**
   * 检查是否有宠物
   */
  exists() {
    return fs.existsSync(this.file);
  }
}

module.exports = { PetFile };
