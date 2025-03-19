"use strict";
const REGIONAL_DEVELOPMENT = {
  title: "区域发展",
  skills: [
    {
      "name": "高效采集",
      "maxLevel": 10,
      "currentLevel": 0,
      "dependencies": [],
      "level": 1,
      "unlockNextLevelAt": 10,
      "resourcesPerLevel": [70, 70, 90, 110, 130, 170, 230, 350, 530, 790]
    },
    {
      "name": "额外收获",
      "maxLevel": 10,
      "currentLevel": 0,
      "dependencies": [],
      "level": 1,
      "unlockNextLevelAt": 10,
      "resourcesPerLevel": [70, 70, 90, 110, 130, 170, 230, 350, 530, 790]
    },
    {
      "name": "中级奖励",
      "maxLevel": 1,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "高效采集",
          "level": 1,
          "requiredLevel": 10
        },
        {
          "name": "额外收获",
          "level": 1,
          "requiredLevel": 10
        }
      ],
      "level": 2,
      "unlockNextLevelAt": 1,
      "resourcesPerLevel": [1190]
    },
    {
      "name": "积分提升I",
      "maxLevel": 10,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "中级奖励",
          "level": 2,
          "requiredLevel": 1
        }
      ],
      "level": 3,
      "unlockNextLevelAt": 10,
      "resourcesPerLevel": [90, 100, 120, 140, 170, 220, 310, 470, 700, 1060]
    },
    {
      "name": "快速行军",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "积分提升I",
          "level": 3,
          "requiredLevel": 10
        }
      ],
      "level": 4,
      "unlockNextLevelAt": 5,
      "resourcesPerLevel": [160, 160, 170, 180, 200, 220, 240, 290, 350, 420, 540, 700, 920, 1280, 1790]
    },
    {
      "name": "快速孵化",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "积分提升I",
          "level": 3,
          "requiredLevel": 10
        }
      ],
      "level": 4,
      "unlockNextLevelAt": 5,
      "resourcesPerLevel": [160, 160, 170, 180, 200, 220, 240, 290, 350, 420, 540, 700, 920, 1280, 1790]
    },
    {
      "name": "负重提升",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "快速行军",
          "level": 4,
          "requiredLevel": 5
        }
      ],
      "level": 5,
      "unlockNextLevelAt": 15,
      "resourcesPerLevel": [160, 160, 170, 180, 200, 220, 240, 290, 350, 420, 540, 700, 920, 1280, 1790]
    },
    {
      "name": "混合介质",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "快速孵化",
          "level": 4,
          "requiredLevel": 5
        }
      ],
      "level": 5,
      "unlockNextLevelAt": 15,
      "resourcesPerLevel": [160, 160, 170, 180, 200, 220, 240, 290, 350, 420, 540, 700, 920, 1280, 1790]
    },
    {
      "name": "高级奖励",
      "maxLevel": 1,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "负重提升",
          "level": 5,
          "requiredLevel": 15
        },
        {
          "name": "混合介质",
          "level": 5,
          "requiredLevel": 15
        }
      ],
      "level": 6,
      "unlockNextLevelAt": 1,
      "resourcesPerLevel": [1350]
    },
    {
      "name": "采集积分",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "高级奖励",
          "level": 6,
          "requiredLevel": 1
        }
      ],
      "level": 7,
      "unlockNextLevelAt": 5,
      "resourcesPerLevel": [100, 110, 110, 120, 130, 150, 160, 190, 230, 280, 360, 470, 610, 850, 1200]
    },
    {
      "name": "狩猎积分",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "高级奖励",
          "level": 6,
          "requiredLevel": 1
        }
      ],
      "level": 7,
      "unlockNextLevelAt": 5,
      "resourcesPerLevel": [100, 110, 110, 120, 130, 150, 160, 190, 230, 280, 360, 470, 610, 850, 1200]
    },
    {
      "name": "建造积分",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "采集积分",
          "level": 7,
          "requiredLevel": 5
        }
      ],
      "level": 8,
      "unlockNextLevelAt": 5,
      "resourcesPerLevel": [100, 110, 110, 120, 130, 150, 160, 190, 230, 280, 360, 470, 610, 850, 1200]
    },
    {
      "name": "变异包子积分",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "狩猎积分",
          "level": 7,
          "requiredLevel": 5
        }
      ],
      "level": 8,
      "unlockNextLevelAt": 5,
      "resourcesPerLevel": [100, 110, 110, 120, 130, 150, 160, 190, 230, 280, 360, 470, 610, 850, 1200]
    },
    {
      "name": "进化积分",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "建造积分",
          "level": 8,
          "requiredLevel": 5
        }
      ],
      "level": 9,
      "unlockNextLevelAt": 5,
      "resourcesPerLevel": [100, 110, 110, 120, 130, 150, 160, 190, 230, 280, 360, 470, 610, 850, 1200]
    },
    {
      "name": "升级积分",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "变异包子积分",
          "level": 8,
          "requiredLevel": 5
        }
      ],
      "level": 9,
      "unlockNextLevelAt": 5,
      "resourcesPerLevel": [40, 40, 40, 50, 60, 70, 100, 130, 180, 250, 340, 520, 770, 1080, 1410]
    },
    {
      "name": "击败积分",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "进化积分",
          "level": 9,
          "requiredLevel": 5
        }
      ],
      "level": 10,
      "unlockNextLevelAt": 10,
      "resourcesPerLevel": [100, 110, 110, 120, 130, 150, 160, 190, 230, 280, 360, 470, 610, 850, 1200]
    },
    {
      "name": "孵化积分",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "升级积分",
          "level": 9,
          "requiredLevel": 5
        }
      ],
      "level": 10,
      "unlockNextLevelAt": 10,
      "resourcesPerLevel": [100, 110, 110, 120, 130, 150, 160, 190, 230, 280, 360, 470, 610, 850, 1200]
    },
    {
      "name": "积分提升II",
      "maxLevel": 20,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "击败积分",
          "level": 10,
          "requiredLevel": 10
        },
        {
          "name": "孵化积分",
          "level": 10,
          "requiredLevel": 10
        }
      ],
      "level": 11,
      "unlockNextLevelAt": 20,
      "resourcesPerLevel": [260, 270, 290, 300, 320, 350, 380, 420, 460, 510, 560, 670, 810, 970, 1160, 1390, 1810, 2350, 3060, 3980]
    },
    {
      "name": "双倍奖励",
      "maxLevel": 1,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "积分提升II",
          "level": 11,
          "requiredLevel": 20
        }
      ],
      "level": 12,
      "unlockNextLevelAt": 1,
      "resourcesPerLevel": [2540]
    }
  ]
};
const ARCHER_ANT_HATCHING = {
  title: "射手蚁孵化",
  skills: [
    {
      "name": "特定产卵",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [],
      "level": 1,
      "unlockNextLevelAt": 10,
      "resourcesPerLevel": [180, 190, 200, 210, 230, 250, 280, 330, 400, 480, 620, 810, 1050, 1470, 2060]
    },
    {
      "name": "精准异变",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [],
      "level": 1,
      "unlockNextLevelAt": 10,
      "resourcesPerLevel": [180, 190, 200, 210, 230, 250, 280, 330, 400, 480, 620, 810, 1050, 1470, 2060]
    },
    {
      "name": "稳定瞄准",
      "maxLevel": 10,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "特定产卵",
          "level": 1,
          "requiredLevel": 10
        },
        {
          "name": "精准异变",
          "level": 1,
          "requiredLevel": 10
        }
      ],
      "level": 2,
      "unlockNextLevelAt": 3,
      "resourcesPerLevel": [180, 220, 260, 340, 450, 640, 940, 1500, 2550, 4590]
    },
    {
      "name": "射手蚁异变II",
      "maxLevel": 1,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "稳定瞄准",
          "level": 2,
          "requiredLevel": 3
        }
      ],
      "level": 3,
      "unlockNextLevelAt": 1,
      "resourcesPerLevel": [0]
    },
    {
      "name": "攻坚战练习",
      "maxLevel": 20,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "射手蚁异变II",
          "level": 3,
          "requiredLevel": 1
        }
      ],
      "level": 4,
      "unlockNextLevelAt": 20,
      "resourcesPerLevel": [600, 630, 660, 690, 730, 800, 880, 970, 1060, 1170, 1290, 1540, 1850, 2200, 2670, 3200, 4160, 5410, 7030, 9140]
    },
    {
      "name": "剧毒咬酸",
      "maxLevel": 20,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "射手蚁异变II",
          "level": 3,
          "requiredLevel": 1
        }
      ],
      "level": 4,
      "unlockNextLevelAt": 20,
      "resourcesPerLevel": [600, 630, 660, 690, 730, 800, 880, 970, 1060, 1170, 1290, 1540, 1850, 2200, 2670, 3200, 4160, 5410, 7030, 9140]
    },
    {
      "name": "解锁9级射手蚁",
      "maxLevel": 1,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "攻坚战练习",
          "level": 4,
          "requiredLevel": 20
        },
        {
          "name": "剧毒咬酸",
          "level": 4,
          "requiredLevel": 20
        }
      ],
      "level": 5,
      "unlockNextLevelAt": 1,
      "resourcesPerLevel": [17500]
    }
  ]
};
const GUARD_ANT_HATCHING = {
  title: "近卫蚁孵化",
  skills: [
    {
      "name": "特定产卵",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [],
      "level": 1,
      "unlockNextLevelAt": 10,
      "resourcesPerLevel": [180, 190, 200, 210, 230, 250, 280, 330, 400, 480, 620, 810, 1050, 1470, 2060]
    },
    {
      "name": "精准异变",
      "maxLevel": 15,
      "currentLevel": 0,
      "dependencies": [],
      "level": 1,
      "unlockNextLevelAt": 10,
      "resourcesPerLevel": [180, 190, 200, 210, 230, 250, 280, 330, 400, 480, 620, 810, 1050, 1470, 2060]
    },
    {
      "name": "酸蚀免疫",
      "maxLevel": 10,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "特定产卵",
          "level": 1,
          "requiredLevel": 10
        },
        {
          "name": "精准异变",
          "level": 1,
          "requiredLevel": 10
        }
      ],
      "level": 2,
      "unlockNextLevelAt": 3,
      "resourcesPerLevel": [180, 220, 260, 340, 450, 640, 940, 1500, 2550, 4590]
    },
    {
      "name": "近卫蚁异变II",
      "maxLevel": 1,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "酸蚀免疫",
          "level": 2,
          "requiredLevel": 3
        }
      ],
      "level": 3,
      "unlockNextLevelAt": 1,
      "resourcesPerLevel": [0]
    },
    {
      "name": "守巢决心",
      "maxLevel": 20,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "近卫蚁异变II",
          "level": 3,
          "requiredLevel": 1
        }
      ],
      "level": 4,
      "unlockNextLevelAt": 20,
      "resourcesPerLevel": [600, 630, 660, 690, 730, 800, 880, 970, 1060, 1170, 1290, 1540, 1850, 2200, 2670, 3200, 4160, 5410, 7030, 9140]
    },
    {
      "name": "尖刺甲壳",
      "maxLevel": 20,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "近卫蚁异变II",
          "level": 3,
          "requiredLevel": 1
        }
      ],
      "level": 4,
      "unlockNextLevelAt": 20,
      "resourcesPerLevel": [600, 630, 660, 690, 730, 800, 880, 970, 1060, 1170, 1290, 1540, 1850, 2200, 2670, 3200, 4160, 5410, 7030, 9140]
    },
    {
      "name": "解锁9级近卫蚁",
      "maxLevel": 1,
      "currentLevel": 0,
      "dependencies": [
        {
          "name": "守巢决心",
          "level": 4,
          "requiredLevel": 20
        },
        {
          "name": "尖刺甲壳",
          "level": 4,
          "requiredLevel": 20
        }
      ],
      "level": 5,
      "unlockNextLevelAt": 1,
      "resourcesPerLevel": [17500]
    }
  ]
};
exports.ARCHER_ANT_HATCHING = ARCHER_ANT_HATCHING;
exports.GUARD_ANT_HATCHING = GUARD_ANT_HATCHING;
exports.REGIONAL_DEVELOPMENT = REGIONAL_DEVELOPMENT;
