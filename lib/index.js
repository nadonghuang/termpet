/**
 * termpet — 终端虚拟宠物
 * 导出核心模块
 */

'use strict';

const { Pet, PetState, PetType } = require('./pet');
const { Renderer } = require('./renderer');
const { PetFile } = require('./storage');
const { ACTIONS } = require('./actions');

module.exports = {
  Pet,
  PetState,
  PetType,
  Renderer,
  PetFile,
  ACTIONS
};
