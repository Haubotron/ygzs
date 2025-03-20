"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const packageEvolve_pages_evolveIndex_config = require("./config.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));
    const trees = common_vendor.reactive({
      regional: cloneDeep(packageEvolve_pages_evolveIndex_config.REGIONAL_DEVELOPMENT),
      archer: cloneDeep(packageEvolve_pages_evolveIndex_config.ARCHER_ANT_HATCHING),
      guard: cloneDeep(packageEvolve_pages_evolveIndex_config.GUARD_ANT_HATCHING)
    });
    const initialTrees = common_vendor.reactive({
      regional: cloneDeep(packageEvolve_pages_evolveIndex_config.REGIONAL_DEVELOPMENT),
      archer: cloneDeep(packageEvolve_pages_evolveIndex_config.ARCHER_ANT_HATCHING),
      guard: cloneDeep(packageEvolve_pages_evolveIndex_config.GUARD_ANT_HATCHING)
    });
    const originalTrees = common_vendor.reactive({
      regional: cloneDeep(packageEvolve_pages_evolveIndex_config.REGIONAL_DEVELOPMENT),
      archer: cloneDeep(packageEvolve_pages_evolveIndex_config.ARCHER_ANT_HATCHING),
      guard: cloneDeep(packageEvolve_pages_evolveIndex_config.GUARD_ANT_HATCHING)
    });
    const currentTreeKey = common_vendor.ref("regional");
    const currentTree = common_vendor.computed(() => trees[currentTreeKey.value]);
    const treeResources = common_vendor.reactive({
      regional: 0,
      archer: 0,
      guard: 0
    });
    const editMode = common_vendor.ref(false);
    const pendingChanges = common_vendor.reactive({
      regional: [],
      archer: [],
      guard: []
    });
    const showResourceResult = common_vendor.ref(false);
    const showProgressResult = common_vendor.ref(false);
    const totalFishBones = common_vendor.ref(0);
    const remainingBones = common_vendor.ref(0);
    const selectedSkill = common_vendor.ref(null);
    const progressPlan = common_vendor.ref([]);
    const switchTree = (key) => {
      if (editMode.value) {
        common_vendor.index.showModal({
          title: "保存更改",
          content: "切换科技树前是否保存当前更改？",
          success: (res) => {
            if (res.confirm) {
              saveChanges();
            } else {
              trees[currentTreeKey.value].skills = cloneDeep(originalTrees[currentTreeKey.value].skills);
              pendingChanges[currentTreeKey.value] = [];
            }
            currentTreeKey.value = key;
            showResourceResult.value = false;
            showProgressResult.value = false;
          }
        });
      } else {
        currentTreeKey.value = key;
        showResourceResult.value = false;
        showProgressResult.value = false;
      }
    };
    const toggleEditMode = () => {
      if (editMode.value) {
        common_vendor.index.showModal({
          title: "保存更改",
          content: "退出编辑模式前是否保存当前更改？",
          success: (res) => {
            if (res.confirm) {
              saveChanges();
            } else {
              trees[currentTreeKey.value].skills = cloneDeep(originalTrees[currentTreeKey.value].skills);
              pendingChanges[currentTreeKey.value] = [];
            }
            editMode.value = false;
          }
        });
      } else {
        originalTrees[currentTreeKey.value].skills = cloneDeep(trees[currentTreeKey.value].skills);
        pendingChanges[currentTreeKey.value] = [];
        editMode.value = true;
      }
    };
    const saveChanges = () => {
      if (!editMode.value)
        return;
      initialTrees[currentTreeKey.value].skills = cloneDeep(trees[currentTreeKey.value].skills);
      originalTrees[currentTreeKey.value].skills = cloneDeep(trees[currentTreeKey.value].skills);
      pendingChanges[currentTreeKey.value] = [];
      editMode.value = false;
      common_vendor.index.showToast({
        title: "保存成功，初始设置不消耗鱼骨头",
        icon: "none",
        duration: 2e3
      });
    };
    const getMaxTreeLevel = () => {
      let maxLevel2 = 0;
      currentTree.value.skills.forEach((skill) => {
        if (skill.level > maxLevel2) {
          maxLevel2 = skill.level;
        }
      });
      return maxLevel2;
    };
    const getSkillsByLevel = (level) => {
      return currentTree.value.skills.filter((skill) => skill.level === level);
    };
    const getSkillCurrentLevel = (name, level) => {
      const skill = currentTree.value.skills.find((s) => s.name === name && s.level === level);
      return skill ? skill.currentLevel : 0;
    };
    const isSkillUnlockable = (skill) => {
      if (skill.dependencies.length === 0)
        return true;
      return skill.dependencies.every((dep) => {
        const depSkill = currentTree.value.skills.find((s) => s.name === dep.name && s.level === dep.level);
        return depSkill && depSkill.currentLevel >= dep.requiredLevel;
      });
    };
    const getNextLevelCost = (skill) => {
      if (skill.currentLevel >= skill.maxLevel)
        return 0;
      return skill.resourcesPerLevel[skill.currentLevel] || 0;
    };
    const autoCompletePrerequisites = (skill) => {
      if (!editMode.value)
        return;
      const currentLevel = skill.level;
      for (let i = 1; i < currentLevel; i++) {
        const lowerLevelSkills = getSkillsByLevel(i);
        lowerLevelSkills.forEach((lowerSkill) => {
          if (lowerSkill.unlockNextLevelAt && lowerSkill.currentLevel < lowerSkill.unlockNextLevelAt) {
            lowerSkill.currentLevel = lowerSkill.unlockNextLevelAt;
            pendingChanges[currentTreeKey.value].push({
              name: lowerSkill.name,
              level: lowerSkill.level,
              action: "auto-complete-unlock",
              newLevel: lowerSkill.unlockNextLevelAt
            });
          }
        });
      }
      const processPrerequisites = (currentSkill, visited = /* @__PURE__ */ new Set()) => {
        if (visited.has(`${currentSkill.name}-${currentSkill.level}`))
          return;
        visited.add(`${currentSkill.name}-${currentSkill.level}`);
        currentSkill.dependencies.forEach((dep) => {
          const depSkill = currentTree.value.skills.find((s) => s.name === dep.name && s.level === dep.level);
          if (depSkill) {
            if (depSkill.currentLevel < dep.requiredLevel) {
              depSkill.currentLevel = dep.requiredLevel;
              pendingChanges[currentTreeKey.value].push({
                name: depSkill.name,
                level: depSkill.level,
                action: "auto-complete-dependency",
                newLevel: dep.requiredLevel
              });
            }
            processPrerequisites(depSkill, visited);
          }
        });
      };
      processPrerequisites(skill);
    };
    const increaseLevel = (skill) => {
      if (skill.currentLevel < skill.maxLevel) {
        if (editMode.value) {
          skill.currentLevel++;
          pendingChanges[currentTreeKey.value].push({
            name: skill.name,
            level: skill.level,
            action: "increase"
          });
          autoCompletePrerequisites(skill);
        } else if (isSkillUnlockable(skill)) {
          const cost = getNextLevelCost(skill);
          if (treeResources[currentTreeKey.value] >= cost) {
            treeResources[currentTreeKey.value] -= cost;
            skill.currentLevel++;
          } else {
            common_vendor.index.showToast({
              title: "资源不足",
              icon: "none"
            });
          }
        }
      }
    };
    const decreaseLevel = (skill) => {
      if (skill.currentLevel > 0) {
        if (editMode.value) {
          skill.currentLevel--;
          pendingChanges[currentTreeKey.value].push({
            name: skill.name,
            level: skill.level,
            action: "decrease"
          });
        } else {
          const hasDependents = currentTree.value.skills.some(
            (s) => s.dependencies.some(
              (dep) => dep.name === skill.name && dep.level === skill.level && getSkillCurrentLevel(s.name, s.level) > 0 && skill.currentLevel <= dep.requiredLevel
            )
          );
          const isRequiredForNextLevel = skill.unlockNextLevelAt && currentTree.value.skills.some(
            (s) => s.level > skill.level && s.currentLevel > 0 && skill.currentLevel <= skill.unlockNextLevelAt
          );
          if (hasDependents || isRequiredForNextLevel) {
            common_vendor.index.showToast({
              title: "其他技能依赖于此技能",
              icon: "none"
            });
            return;
          }
          if (skill.currentLevel > 0 && skill.resourcesPerLevel[skill.currentLevel - 1]) {
            const refundAmount = skill.resourcesPerLevel[skill.currentLevel - 1];
            treeResources[currentTreeKey.value] += refundAmount;
          }
          skill.currentLevel--;
        }
      }
    };
    const maxLevel = (skill) => {
      if (editMode.value) {
        skill.currentLevel = skill.maxLevel;
        pendingChanges[currentTreeKey.value].push({
          name: skill.name,
          level: skill.level,
          action: "max"
        });
        autoCompletePrerequisites(skill);
      } else if (isSkillUnlockable(skill)) {
        let totalCost = 0;
        for (let i = skill.currentLevel; i < skill.maxLevel; i++) {
          totalCost += skill.resourcesPerLevel[i] || 0;
        }
        if (treeResources[currentTreeKey.value] >= totalCost) {
          treeResources[currentTreeKey.value] -= totalCost;
          skill.currentLevel = skill.maxLevel;
        } else {
          while (skill.currentLevel < skill.maxLevel) {
            const cost = getNextLevelCost(skill);
            if (treeResources[currentTreeKey.value] >= cost) {
              treeResources[currentTreeKey.value] -= cost;
              skill.currentLevel++;
            } else {
              break;
            }
          }
          common_vendor.index.showToast({
            title: "资源不足，已升级到可能的最高等级",
            icon: "none"
          });
        }
      }
    };
    const selectSkill = (skill) => {
      selectedSkill.value = skill;
      if (editMode.value) {
        autoCompletePrerequisites(skill);
        return;
      }
      if (skill.dependencies.length > 0 && !isSkillUnlockable(skill)) {
        common_vendor.index.showModal({
          title: "自动升级依赖",
          content: "是否自动升级所有依赖技能到所需等级？",
          success: (res) => {
            if (res.confirm) {
              autoUpgradeDependencies(skill);
            }
          }
        });
      }
    };
    const autoUpgradeDependencies = (skill) => {
      let totalCost = 0;
      const upgradePlan = [];
      const processDependencies = (skill2, visited = /* @__PURE__ */ new Set()) => {
        if (visited.has(`${skill2.name}-${skill2.level}`))
          return;
        visited.add(`${skill2.name}-${skill2.level}`);
        skill2.dependencies.forEach((dep) => {
          const depSkill = currentTree.value.skills.find((s) => s.name === dep.name && s.level === dep.level);
          if (depSkill) {
            const currentLevel = depSkill.currentLevel;
            const targetLevel = dep.requiredLevel;
            if (currentLevel < targetLevel) {
              let levelCost = 0;
              for (let i = currentLevel; i < targetLevel; i++) {
                levelCost += depSkill.resourcesPerLevel[i] || 0;
              }
              totalCost += levelCost;
              upgradePlan.push({
                skill: depSkill,
                from: currentLevel,
                to: targetLevel,
                cost: levelCost
              });
              if (depSkill.dependencies.length > 0) {
                processDependencies(depSkill, visited);
              }
            }
          }
        });
      };
      processDependencies(skill);
      if (totalCost > treeResources[currentTreeKey.value]) {
        common_vendor.index.showToast({
          title: `资源不足，需要 ${totalCost} 鱼骨头`,
          icon: "none",
          duration: 2e3
        });
        return;
      }
      upgradePlan.forEach((plan) => {
        plan.skill.currentLevel = plan.to;
      });
      treeResources[currentTreeKey.value] -= totalCost;
      common_vendor.index.showToast({
        title: `成功升级依赖技能，消耗 ${totalCost} 鱼骨头`,
        icon: "none",
        duration: 2e3
      });
    };
    const calculateResources = () => {
      let total = 0;
      const maxLevel2 = getMaxTreeLevel();
      const requiredLevels = /* @__PURE__ */ new Map();
      for (let level = maxLevel2; level >= 1; level--) {
        const skillsInLevel = getSkillsByLevel(level);
        if (level === maxLevel2) {
          skillsInLevel.forEach((skill) => {
            if (skill.currentLevel >= 1) {
              requiredLevels.set(`${skill.name}-${skill.level}`, skill.currentLevel);
            } else {
              requiredLevels.set(`${skill.name}-${skill.level}`, 1);
            }
          });
        }
        skillsInLevel.forEach((skill) => {
          const skillKey = `${skill.name}-${skill.level}`;
          const requiredLevel = requiredLevels.get(skillKey) || 0;
          if (skill.unlockNextLevelAt && level < maxLevel2) {
            const hasHigherLevelDependents = currentTree.value.skills.some(
              (s) => s.level > skill.level && requiredLevels.get(`${s.name}-${s.level}`) > 0 && s.dependencies.some((dep) => dep.name === skill.name && dep.level === skill.level)
            );
            if (hasHigherLevelDependents) {
              const newRequiredLevel = Math.max(requiredLevel, skill.unlockNextLevelAt);
              requiredLevels.set(skillKey, newRequiredLevel);
            }
          }
          skill.dependencies.forEach((dep) => {
            const depKey = `${dep.name}-${dep.level}`;
            const currentDepRequiredLevel = requiredLevels.get(depKey) || 0;
            if (requiredLevel > 0) {
              const newDepRequiredLevel = Math.max(currentDepRequiredLevel, dep.requiredLevel);
              requiredLevels.set(depKey, newDepRequiredLevel);
            }
          });
        });
      }
      currentTree.value.skills.forEach((skill) => {
        const skillKey = `${skill.name}-${skill.level}`;
        const requiredLevel = requiredLevels.get(skillKey) || 0;
        if (requiredLevel > skill.currentLevel) {
          for (let i = skill.currentLevel; i < requiredLevel; i++) {
            total += skill.resourcesPerLevel[i] || 0;
          }
        }
      });
      totalFishBones.value = total;
      remainingBones.value = total - treeResources[currentTreeKey.value];
      showResourceResult.value = true;
      showProgressResult.value = false;
    };
    const calculateProgress = () => {
      const currentResources = treeResources[currentTreeKey.value];
      const plan = [];
      let remainingResources = currentResources;
      const sortedSkills = [...currentTree.value.skills].sort((a, b) => {
        if (a.level !== b.level)
          return a.level - b.level;
        return a.dependencies.length - b.dependencies.length;
      });
      for (const skill of sortedSkills) {
        if (skill.currentLevel < skill.maxLevel && isSkillUnlockable(skill)) {
          let from = skill.currentLevel;
          let to = from;
          while (to < skill.maxLevel) {
            const cost = skill.resourcesPerLevel[to] || 0;
            if (remainingResources >= cost) {
              remainingResources -= cost;
              to++;
            } else {
              break;
            }
          }
          if (to > from) {
            plan.push({
              name: skill.name,
              from,
              to
            });
          }
        }
      }
      progressPlan.value = plan;
      showProgressResult.value = true;
      showResourceResult.value = false;
    };
    const showResetConfirm = () => {
      common_vendor.index.showModal({
        title: "重置确认",
        content: `确定要重置当前科技树(${currentTree.value.title})的所有技能等级吗？`,
        success: (res) => {
          if (res.confirm) {
            resetCurrentTree();
          }
        }
      });
    };
    const resetCurrentTree = () => {
      let refundAmount = 0;
      currentTree.value.skills.forEach((skill) => {
        const initialSkill = initialTrees[currentTreeKey.value].skills.find((s) => s.name === skill.name && s.level === skill.level);
        if (initialSkill && skill.currentLevel > initialSkill.currentLevel) {
          for (let i = initialSkill.currentLevel; i < skill.currentLevel; i++) {
            refundAmount += skill.resourcesPerLevel[i] || 0;
          }
        }
      });
      trees[currentTreeKey.value].skills = cloneDeep(initialTrees[currentTreeKey.value].skills);
      treeResources[currentTreeKey.value] += refundAmount;
      if (editMode.value) {
        originalTrees[currentTreeKey.value].skills = cloneDeep(trees[currentTreeKey.value].skills);
        pendingChanges[currentTreeKey.value] = [];
      }
      common_vendor.index.showToast({
        title: `重置成功，返还 ${refundAmount} 鱼骨头`,
        icon: "none",
        duration: 2e3
      });
      showResourceResult.value = false;
      showProgressResult.value = false;
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const close = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.t(currentTree.value.title),
        c: common_vendor.o(close),
        d: common_vendor.f(trees, (tree, key, i0) => {
          return {
            a: common_vendor.t(tree.title),
            b: key,
            c: currentTreeKey.value === key ? 1 : "",
            d: common_vendor.o(($event) => switchTree(key), key)
          };
        }),
        e: common_assets._imports_0$1,
        f: treeResources[currentTreeKey.value],
        g: common_vendor.o(($event) => treeResources[currentTreeKey.value] = $event.detail.value),
        h: common_vendor.t(editMode.value ? "编辑模式" : "正常模式"),
        i: editMode.value ? 1 : "",
        j: common_vendor.o(toggleEditMode),
        k: editMode.value
      }, editMode.value ? {
        l: common_vendor.o(saveChanges)
      } : {}, {
        m: common_vendor.o(showResetConfirm),
        n: editMode.value
      }, editMode.value ? {} : {}, {
        o: common_vendor.f(getMaxTreeLevel(), (level, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(level),
            b: common_vendor.f(getSkillsByLevel(level), (skill, index, i1) => {
              return common_vendor.e({
                a: skill.currentLevel === skill.maxLevel
              }, skill.currentLevel === skill.maxLevel ? {} : {}, {
                b: common_vendor.t(skill.name),
                c: common_vendor.t(skill.currentLevel),
                d: common_vendor.t(skill.maxLevel),
                e: common_vendor.o(($event) => decreaseLevel(skill), skill.name),
                f: skill.currentLevel <= 0,
                g: common_vendor.o(($event) => increaseLevel(skill), skill.name),
                h: skill.currentLevel >= skill.maxLevel || !isSkillUnlockable(skill) && !editMode.value,
                i: common_vendor.o(($event) => maxLevel(skill), skill.name),
                j: skill.currentLevel >= skill.maxLevel || !isSkillUnlockable(skill) && !editMode.value,
                k: skill.dependencies.length > 0
              }, skill.dependencies.length > 0 ? {
                l: common_vendor.f(skill.dependencies, (dep, k2, i2) => {
                  return {
                    a: common_vendor.t(dep.name),
                    b: common_vendor.t(getSkillCurrentLevel(dep.name, dep.level)),
                    c: common_vendor.t(dep.requiredLevel),
                    d: dep.name
                  };
                })
              } : {}, {
                m: skill.currentLevel < skill.maxLevel
              }, skill.currentLevel < skill.maxLevel ? {
                n: common_vendor.t(getNextLevelCost(skill))
              } : {}, {
                o: skill.unlockNextLevelAt
              }, skill.unlockNextLevelAt ? {
                p: common_vendor.t(skill.currentLevel),
                q: common_vendor.t(skill.unlockNextLevelAt)
              } : {}, {
                r: skill.currentLevel === skill.maxLevel ? 1 : "",
                s: skill.currentLevel > 0 ? 1 : "",
                t: !isSkillUnlockable(skill) && !editMode.value ? 1 : "",
                v: getSkillsByLevel(level).length > 1 && index % 2 === 0 ? 1 : "",
                w: getSkillsByLevel(level).length > 1 && index % 2 === 1 ? 1 : "",
                x: common_vendor.o(($event) => selectSkill(skill), skill.name),
                y: skill.name
              });
            }),
            c: getSkillsByLevel(level).length === 1 ? 1 : "",
            d: getSkillsByLevel(level).length === 1 ? 1 : "",
            e: level < getMaxTreeLevel()
          }, level < getMaxTreeLevel() ? {} : {}, {
            f: level
          });
        }),
        p: common_assets._imports_1$1,
        q: common_assets._imports_2$1,
        r: common_vendor.o(calculateResources),
        s: common_assets._imports_3$1,
        t: common_vendor.o(calculateProgress),
        v: showResourceResult.value
      }, showResourceResult.value ? common_vendor.e({
        w: common_assets._imports_0$1,
        x: common_vendor.t(totalFishBones.value),
        y: remainingBones.value > 0
      }, remainingBones.value > 0 ? {
        z: common_vendor.t(remainingBones.value)
      } : remainingBones.value < 0 ? {
        B: common_vendor.t(Math.abs(remainingBones.value))
      } : {}, {
        A: remainingBones.value < 0
      }) : {}, {
        C: showProgressResult.value
      }, showProgressResult.value ? common_vendor.e({
        D: common_vendor.f(progressPlan.value, (skill, index, i0) => {
          return {
            a: common_vendor.t(skill.name),
            b: common_vendor.t(skill.from),
            c: common_vendor.t(skill.to),
            d: index
          };
        }),
        E: progressPlan.value.length === 0
      }, progressPlan.value.length === 0 ? {} : {}) : {});
    };
  }
};
wx.createPage(_sfc_main);
