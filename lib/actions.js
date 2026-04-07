/**
 * Actions — 定义所有可用动作
 */

const ACTIONS = {
  feed: {
    name: '喂食',
    emoji: '🍖',
    desc: '喂宠物食物，恢复饱食度'
  },
  play: {
    name: '玩耍',
    emoji: '🎾',
    desc: '和宠物玩耍，提升快乐度'
  },
  sleep: {
    name: '睡觉',
    emoji: '💤',
    desc: '让宠物休息，恢复精力'
  },
  pet: {
    name: '抚摸',
    emoji: '🤗',
    desc: '抚摸宠物，增加亲密度'
  },
  clean: {
    name: '清洁',
    emoji: '🛁',
    desc: '给宠物洗澡，提升清洁度'
  },
  walk: {
    name: '散步',
    emoji: '🚶',
    desc: '带宠物散步，全面提升'
  },
  heal: {
    name: '治疗',
    emoji: '💊',
    desc: '治疗宠物，恢复健康'
  }
};

module.exports = { ACTIONS };
