<template>
	<view class="tech-tree-container">
	  <!-- 顶部导航 -->
	  <view class="header">
		<view class="back-button" @tap="goBack">
		  <view class="back-icon"></view>
		</view>
		<view class="title">{{ currentTree.title }}</view>
		<view class="close-button" @tap="close">×</view>
	  </view>
  
	  <!-- 科技树切换 -->
	  <view class="tree-selector">
		<view 
		  v-for="(tree, key) in trees" 
		  :key="key"
		  class="tree-option"
		  :class="{ active: currentTreeKey === key }"
		  @tap="switchTree(key)"
		>
		  {{ tree.title }}
		</view>
	  </view>
  
	  <!-- 资源显示和控制按钮 -->
	  <view class="resource-controls">
		<view class="resource-display">
		  <image class="resource-icon" src="@/static/None.png"></image>
		  <input type="text" v-model="treeResources[currentTreeKey]" />
		</view>
		<view class="control-buttons">
		  <button 
			class="control-button" 
			:class="{ 'active-mode': editMode }" 
			@tap="toggleEditMode"
		  >
			{{ editMode ? '编辑模式' : '正常模式' }}
		  </button>
		  <button 
			v-if="editMode" 
			class="control-button save-button" 
			@tap="saveChanges"
		  >
			保存设置
		  </button>
		  <button class="control-button reset-button" @tap="showResetConfirm">
			重置
		  </button>
		</view>
	  </view>
  
	  <!-- 编辑模式提示 -->
	  <view v-if="editMode" class="edit-mode-tip">
		编辑模式：设置初始技能等级不消耗资源，点击保存后生效
	  </view>
  
	  <!-- 科技树内容 -->
	  <scroll-view scroll-y class="tech-tree-content">
		<view v-for="level in getMaxTreeLevel()" :key="level" class="level-container">
		  <view class="level-label">层级 {{ level }}</view>
		  
		  <view class="skills-row" :class="{ 'center-skill': getSkillsByLevel(level).length === 1 }">
			<template v-for="(skill, index) in getSkillsByLevel(level)" :key="skill.name">
			  <view 
				class="skill-item"
				:class="{ 
				  'skill-maxed': skill.currentLevel === skill.maxLevel,
				  'skill-unlocked': skill.currentLevel > 0,
				  'skill-locked': !isSkillUnlockable(skill) && !editMode,
				  'skill-left': getSkillsByLevel(level).length > 1 && index % 2 === 0,
				  'skill-right': getSkillsByLevel(level).length > 1 && index % 2 === 1,
				  'skill-center': getSkillsByLevel(level).length === 1
				}"
				@tap="selectSkill(skill)"
			  >
				<view class="skill-icon-container">
				  <image class="skill-icon" src="@/static/None.png"></image>
				  <view v-if="skill.currentLevel === skill.maxLevel" class="max-badge">MAX</view>
				</view>
				<view class="skill-name">{{ skill.name }}</view>
				<view class="skill-level">{{ skill.currentLevel }}/{{ skill.maxLevel }}</view>
				
				<view class="skill-controls">
				  <button 
					class="btn-decrease" 
					@tap.stop="decreaseLevel(skill)"
					:disabled="skill.currentLevel <= 0"
				  >-</button>
				  
				  <button 
					class="btn-increase" 
					@tap.stop="increaseLevel(skill)"
					:disabled="skill.currentLevel >= skill.maxLevel || (!isSkillUnlockable(skill) && !editMode)"
				  >+</button>
				  
				  <button 
					class="btn-max" 
					@tap.stop="maxLevel(skill)"
					:disabled="skill.currentLevel >= skill.maxLevel || (!isSkillUnlockable(skill) && !editMode)"
				  >MAX</button>
				</view>
  
				<view v-if="skill.dependencies.length > 0" class="skill-dependencies">
				  <view v-for="dep in skill.dependencies" :key="dep.name" class="dependency-item">
					<text>需要: {{ dep.name }} ({{ getSkillCurrentLevel(dep.name, dep.level) }}/{{ dep.requiredLevel }})</text>
				  </view>
				</view>
  
				<view class="skill-cost">
				  <view v-if="skill.currentLevel < skill.maxLevel">
					下一级: {{ getNextLevelCost(skill) }} 鱼骨头
				  </view>
				  <view v-else>已达最大等级</view>
				</view>
				
				<view v-if="skill.unlockNextLevelAt" class="unlock-next-level">
				  解锁下一层需要: {{ skill.currentLevel }}/{{ skill.unlockNextLevelAt }}
				</view>
			  </view>
			</template>
		  </view>
  
		  <!-- 连接线 -->
		  <view v-if="level < getMaxTreeLevel()" class="connection-line"></view>
		</view>
  
		<!-- 计算资源按钮 -->
		<view class="action-buttons">
		  <button class="action-button calculate-button" @tap="calculateResources">
			<image class="button-icon" src="@/static/None.png"></image>
			<text>计算所需鱼骨头</text>
		  </button>
		  <button class="action-button progress-button" @tap="calculateProgress">
			<image class="button-icon" src="@/static/None.png"></image>
			<text>查看可升级进度</text>
		  </button>
		</view>
  
		<!-- 资源计算结果 -->
		<view class="resource-result" v-if="showResourceResult">
		  <view class="result-title">未点亮科技所需资源</view>
		  <view class="result-content">
			<view class="resource-item">
			  <image class="resource-icon" src="@/static/None.png"></image>
			  <view class="resource-value">{{ totalFishBones }} 鱼骨头</view>
			</view>
		  </view>
		  <view v-if="remainingBones > 0" class="remaining-resources">
			还差 {{ remainingBones }} 鱼骨头才能点亮所有科技
		  </view>
		  <view v-else-if="remainingBones < 0" class="remaining-resources positive">
			当前资源充足，剩余 {{ Math.abs(remainingBones) }} 鱼骨头
		  </view>
		</view>
  
		<!-- 进度计算结果 -->
		<view class="resource-result" v-if="showProgressResult">
		  <view class="result-title">当前资源可升级进度</view>
		  <view class="progress-content">
			<view v-for="(skill, index) in progressPlan" :key="index" class="progress-item">
			  <view class="progress-skill-name">{{ skill.name }}</view>
			  <view class="progress-detail">
				可从 {{ skill.from }} 级升至 {{ skill.to }} 级
			  </view>
			</view>
		  </view>
		  <view v-if="progressPlan.length === 0" class="no-progress">
			当前资源不足以升级任何科技
		  </view>
		</view>
	  </scroll-view>
	</view>
  </template>
  
  <script setup>
  import { ref, computed, reactive, onMounted } from 'vue';
  import { REGIONAL_DEVELOPMENT, ARCHER_ANT_HATCHING, GUARD_ANT_HATCHING } from './config.js';
  
  // 树数据 - 深拷贝以避免修改原始数据
  const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));
  
  // 初始化树数据
  const trees = reactive({
	regional: cloneDeep(REGIONAL_DEVELOPMENT),
	archer: cloneDeep(ARCHER_ANT_HATCHING),
	guard: cloneDeep(GUARD_ANT_HATCHING)
  });
  
  // 保存初始状态用于编辑模式和重置
  const initialTrees = reactive({
	regional: cloneDeep(REGIONAL_DEVELOPMENT),
	archer: cloneDeep(ARCHER_ANT_HATCHING),
	guard: cloneDeep(GUARD_ANT_HATCHING)
  });
  
  // 保存原始状态用于编辑模式
  const originalTrees = reactive({
	regional: cloneDeep(REGIONAL_DEVELOPMENT),
	archer: cloneDeep(ARCHER_ANT_HATCHING),
	guard: cloneDeep(GUARD_ANT_HATCHING)
  });
  
  // 当前选中的树
  const currentTreeKey = ref('regional');
  const currentTree = computed(() => trees[currentTreeKey.value]);
  
  // 每个树的资源数量
  const treeResources = reactive({
	regional: 0,
	archer: 0,
	guard: 0
  });
  
  // 编辑模式状态
  const editMode = ref(false);
  const pendingChanges = reactive({
	regional: [],
	archer: [],
	guard: []
  });
  
  // 结果显示状态
  const showResourceResult = ref(false);
  const showProgressResult = ref(false);
  const totalFishBones = ref(0);
  const remainingBones = ref(0);
  const selectedSkill = ref(null);
  const progressPlan = ref([]);
  
  // 切换科技树
  const switchTree = (key) => {
	// 如果在编辑模式，询问是否保存更改
	if (editMode.value) {
	  uni.showModal({
		title: '保存更改',
		content: '切换科技树前是否保存当前更改？',
		success: (res) => {
		  if (res.confirm) {
			saveChanges();
		  } else {
			// 放弃更改，恢复原始状态
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
  
  // 切换编辑模式
  const toggleEditMode = () => {
	if (editMode.value) {
	  // 从编辑模式切换到正常模式，询问是否保存更改
	  uni.showModal({
		title: '保存更改',
		content: '退出编辑模式前是否保存当前更改？',
		success: (res) => {
		  if (res.confirm) {
			saveChanges();
		  } else {
			// 放弃更改，恢复原始状态
			trees[currentTreeKey.value].skills = cloneDeep(originalTrees[currentTreeKey.value].skills);
			pendingChanges[currentTreeKey.value] = [];
		  }
		  editMode.value = false;
		}
	  });
	} else {
	  // 进入编辑模式，保存当前状态
	  originalTrees[currentTreeKey.value].skills = cloneDeep(trees[currentTreeKey.value].skills);
	  pendingChanges[currentTreeKey.value] = [];
	  editMode.value = true;
	}
  };
  
  // 保存编辑模式的更改
  const saveChanges = () => {
	if (!editMode.value) return;
	
	// 计算需要消耗的资源
	let totalCost = 0;
	
	currentTree.value.skills.forEach(skill => {
	  const originalSkill = originalTrees[currentTreeKey.value].skills.find(s => s.name === skill.name && s.level === skill.level);
	  if (originalSkill && skill.currentLevel > originalSkill.currentLevel) {
		for (let i = originalSkill.currentLevel; i < skill.currentLevel; i++) {
		  totalCost += skill.resourcesPerLevel[i];
		}
	  }
	});
	
	// 检查资源是否足够
	if (totalCost > treeResources[currentTreeKey.value]) {
	  uni.showModal({
		title: '资源不足',
		content: `需要 ${totalCost} 鱼骨头，当前只有 ${treeResources[currentTreeKey.value]} 鱼骨头。是否继续保存？`,
		success: (res) => {
		  if (res.confirm) {
			// 用户确认，扣除资源并保存
			treeResources[currentTreeKey.value] -= totalCost;
			// 更新初始状态
			initialTrees[currentTreeKey.value].skills = cloneDeep(trees[currentTreeKey.value].skills);
			// 更新原始状态
			originalTrees[currentTreeKey.value].skills = cloneDeep(trees[currentTreeKey.value].skills);
			pendingChanges[currentTreeKey.value] = [];
			editMode.value = false;
			
			uni.showToast({
			  title: `保存成功，消耗 ${totalCost} 鱼骨头`,
			  icon: 'none',
			  duration: 2000
			});
		  }
		}
	  });
	} else {
	  // 资源足够，直接保存
	  treeResources[currentTreeKey.value] -= totalCost;
	  // 更新初始状态
	  initialTrees[currentTreeKey.value].skills = cloneDeep(trees[currentTreeKey.value].skills);
	  // 更新原始状态
	  originalTrees[currentTreeKey.value].skills = cloneDeep(trees[currentTreeKey.value].skills);
	  pendingChanges[currentTreeKey.value] = [];
	  editMode.value = false;
	  
	  uni.showToast({
		title: `保存成功，消耗 ${totalCost} 鱼骨头`,
		icon: 'none',
		duration: 2000
	  });
	}
  };
  
  // 获取最大层级
  const getMaxTreeLevel = () => {
	let maxLevel = 0;
	currentTree.value.skills.forEach(skill => {
	  if (skill.level > maxLevel) {
		maxLevel = skill.level;
	  }
	});
	return maxLevel;
  };
  
  // 按层级获取技能
  const getSkillsByLevel = (level) => {
	return currentTree.value.skills.filter(skill => skill.level === level);
  };
  
  // 获取技能当前等级
  const getSkillCurrentLevel = (name, level) => {
	const skill = currentTree.value.skills.find(s => s.name === name && s.level === level);
	return skill ? skill.currentLevel : 0;
  };
  
  // 检查技能是否可解锁
  const isSkillUnlockable = (skill) => {
	if (skill.dependencies.length === 0) return true;
	
	return skill.dependencies.every(dep => {
	  const depSkill = currentTree.value.skills.find(s => s.name === dep.name && s.level === dep.level);
	  return depSkill && depSkill.currentLevel >= dep.requiredLevel;
	});
  };
  
  // 获取下一级所需资源
  const getNextLevelCost = (skill) => {
	if (skill.currentLevel >= skill.maxLevel) return 0;
	return skill.resourcesPerLevel[skill.currentLevel] || 0;
  };
  
  // 自动补全前置技能到解锁下一层所需的等级
  const autoCompletePrerequisites = (skill) => {
	if (!editMode.value) return;
	
	const currentLevel = skill.level;
	
	// 处理所有低于当前层级的技能
	for (let i = 1; i < currentLevel; i++) {
	  const lowerLevelSkills = getSkillsByLevel(i);
	  
	  lowerLevelSkills.forEach(lowerSkill => {
		// 如果技能有解锁下一层的要求，并且当前等级低于要求
		if (lowerSkill.unlockNextLevelAt && lowerSkill.currentLevel < lowerSkill.unlockNextLevelAt) {
		  // 提升到解锁下一层所需等级
		  lowerSkill.currentLevel = lowerSkill.unlockNextLevelAt;
		  
		  // 记录更改
		  pendingChanges[currentTreeKey.value].push({
			name: lowerSkill.name,
			level: lowerSkill.level,
			action: 'auto-complete-unlock',
			newLevel: lowerSkill.unlockNextLevelAt
		  });
		}
	  });
	}
	
	// 递归处理所有依赖
	const processPrerequisites = (currentSkill, visited = new Set()) => {
	  if (visited.has(`${currentSkill.name}-${currentSkill.level}`)) return;
	  visited.add(`${currentSkill.name}-${currentSkill.level}`);
	  
	  // 处理当前技能的所有依赖
	  currentSkill.dependencies.forEach(dep => {
		const depSkill = currentTree.value.skills.find(s => s.name === dep.name && s.level === dep.level);
		
		if (depSkill) {
		  // 如果依赖技能等级低于所需等级，提升到所需等级
		  if (depSkill.currentLevel < dep.requiredLevel) {
			depSkill.currentLevel = dep.requiredLevel;
			
			// 记录更改
			pendingChanges[currentTreeKey.value].push({
			  name: depSkill.name,
			  level: depSkill.level,
			  action: 'auto-complete-dependency',
			  newLevel: dep.requiredLevel
			});
		  }
		  
		  // 递归处理这个依赖的依赖
		  processPrerequisites(depSkill, visited);
		}
	  });
	};
	
	// 处理当前技能的依赖
	processPrerequisites(skill);
  };
  
  // 增加技能等级
  const increaseLevel = (skill) => {
	if (skill.currentLevel < skill.maxLevel) {
	  if (editMode.value) {
		// 编辑模式下直接增加等级，不消耗资源
		skill.currentLevel++;
		
		// 记录更改
		pendingChanges[currentTreeKey.value].push({
		  name: skill.name,
		  level: skill.level,
		  action: 'increase'
		});
		
		// 自动补全前置技能
		autoCompletePrerequisites(skill);
	  } else if (isSkillUnlockable(skill)) {
		// 正常模式下检查依赖和资源
		const cost = getNextLevelCost(skill);
		if (treeResources[currentTreeKey.value] >= cost) {
		  treeResources[currentTreeKey.value] -= cost;
		  skill.currentLevel++;
		} else {
		  uni.showToast({
			title: '资源不足',
			icon: 'none'
		  });
		}
	  }
	}
  };
  
  // 减少技能等级
  const decreaseLevel = (skill) => {
	if (skill.currentLevel > 0) {
	  if (editMode.value) {
		// 编辑模式下直接减少等级，不返还资源
		skill.currentLevel--;
		// 记录更改
		pendingChanges[currentTreeKey.value].push({
		  name: skill.name,
		  level: skill.level,
		  action: 'decrease'
		});
	  } else {
		// 正常模式下检查依赖
		const hasDependents = currentTree.value.skills.some(s => 
		  s.dependencies.some(dep => 
			dep.name === skill.name && 
			dep.level === skill.level && 
			getSkillCurrentLevel(s.name, s.level) > 0 && 
			skill.currentLevel <= dep.requiredLevel
		  )
		);
		
		// 检查是否有高层级技能依赖于此技能的解锁下一层等级
		const isRequiredForNextLevel = skill.unlockNextLevelAt && 
		  currentTree.value.skills.some(s => 
			s.level > skill.level && 
			s.currentLevel > 0 && 
			skill.currentLevel <= skill.unlockNextLevelAt
		  );
		
		if (hasDependents || isRequiredForNextLevel) {
		  uni.showToast({
			title: '其他技能依赖于此技能',
			icon: 'none'
		  });
		  return;
		}
		
		// 返还资源
		if (skill.currentLevel > 0 && skill.resourcesPerLevel[skill.currentLevel - 1]) {
		  const refundAmount = skill.resourcesPerLevel[skill.currentLevel - 1];
		  treeResources[currentTreeKey.value] += refundAmount;
		}
		skill.currentLevel--;
	  }
	}
  };
  
  // 最大化技能等级
  const maxLevel = (skill) => {
	if (editMode.value) {
	  // 编辑模式下直接设置为最大等级
	  skill.currentLevel = skill.maxLevel;
	  // 记录更改
	  pendingChanges[currentTreeKey.value].push({
		name: skill.name,
		level: skill.level,
		action: 'max'
	  });
	  
	  // 自动补全前置技能
	  autoCompletePrerequisites(skill);
	} else if (isSkillUnlockable(skill)) {
	  // 正常模式下检查资源
	  let totalCost = 0;
	  for (let i = skill.currentLevel; i < skill.maxLevel; i++) {
		totalCost += skill.resourcesPerLevel[i] || 0;
	  }
	  
	  if (treeResources[currentTreeKey.value] >= totalCost) {
		treeResources[currentTreeKey.value] -= totalCost;
		skill.currentLevel = skill.maxLevel;
	  } else {
		// 资源不足，升级到能升级的最高等级
		while (skill.currentLevel < skill.maxLevel) {
		  const cost = getNextLevelCost(skill);
		  if (treeResources[currentTreeKey.value] >= cost) {
			treeResources[currentTreeKey.value] -= cost;
			skill.currentLevel++;
		  } else {
			break;
		  }
		}
		
		uni.showToast({
		  title: '资源不足，已升级到可能的最高等级',
		  icon: 'none'
		});
	  }
	}
  };
  
  // 选择技能
  const selectSkill = (skill) => {
	selectedSkill.value = skill;
	
	// 如果在编辑模式，自动补全前置技能
	if (editMode.value) {
	  autoCompletePrerequisites(skill);
	  return;
	}
	
	// 如果技能有依赖且当前不可解锁，尝试自动升级依赖
	if (skill.dependencies.length > 0 && !isSkillUnlockable(skill)) {
	  // 显示确认对话框
	  uni.showModal({
		title: '自动升级依赖',
		content: '是否自动升级所有依赖技能到所需等级？',
		success: (res) => {
		  if (res.confirm) {
			autoUpgradeDependencies(skill);
		  }
		}
	  });
	}
  };
  
  // 自动升级依赖
  const autoUpgradeDependencies = (skill) => {
	let totalCost = 0;
	const upgradePlan = [];
	
	// 递归函数来处理依赖
	const processDependencies = (skill, visited = new Set()) => {
	  if (visited.has(`${skill.name}-${skill.level}`)) return;
	  visited.add(`${skill.name}-${skill.level}`);
	  
	  skill.dependencies.forEach(dep => {
		const depSkill = currentTree.value.skills.find(s => s.name === dep.name && s.level === dep.level);
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
			
			// 递归处理依赖的依赖
			if (depSkill.dependencies.length > 0) {
			  processDependencies(depSkill, visited);
			}
		  }
		}
	  });
	};
	
	processDependencies(skill);
	
	// 检查资源是否足够
	if (totalCost > treeResources[currentTreeKey.value]) {
	  uni.showToast({
		title: `资源不足，需要 ${totalCost} 鱼骨头`,
		icon: 'none',
		duration: 2000
	  });
	  return;
	}
	
	// 执行升级计划
	upgradePlan.forEach(plan => {
	  plan.skill.currentLevel = plan.to;
	});
	
	treeResources[currentTreeKey.value] -= totalCost;
	
	uni.showToast({
	  title: `成功升级依赖技能，消耗 ${totalCost} 鱼骨头`,
	  icon: 'none',
	  duration: 2000
	});
  };
  
  // 计算所需资源
  const calculateResources = () => {
	let total = 0;
	
	// 计算所有未点亮科技所需的鱼骨头总和
	currentTree.value.skills.forEach(skill => {
	  if (skill.currentLevel < skill.maxLevel) {
		for (let i = skill.currentLevel; i < skill.maxLevel; i++) {
		  total += skill.resourcesPerLevel[i] || 0;
		}
	  }
	});
	
	totalFishBones.value = total;
	// 计算差额：所需总资源 - 当前资源
	remainingBones.value = total - treeResources[currentTreeKey.value];
	showResourceResult.value = true;
	showProgressResult.value = false;
  };
  
  // 计算当前资源可以升级到的进度
  const calculateProgress = () => {
	const currentResources = treeResources[currentTreeKey.value];
	const plan = [];
	let remainingResources = currentResources;
	
	// 按层级和依赖顺序排序技能
	const sortedSkills = [...currentTree.value.skills].sort((a, b) => {
	  if (a.level !== b.level) return a.level - b.level;
	  return a.dependencies.length - b.dependencies.length;
	});
	
	// 模拟升级过程
	for (const skill of sortedSkills) {
	  if (skill.currentLevel < skill.maxLevel && isSkillUnlockable(skill)) {
		let from = skill.currentLevel;
		let to = from;
		
		// 尝试升级到可能的最高等级
		while (to < skill.maxLevel) {
		  const cost = skill.resourcesPerLevel[to] || 0;
		  if (remainingResources >= cost) {
			remainingResources -= cost;
			to++;
		  } else {
			break;
		  }
		}
		
		// 如果可以升级，添加到计划中
		if (to > from) {
		  plan.push({
			name: skill.name,
			from: from,
			to: to
		  });
		}
	  }
	}
	
	progressPlan.value = plan;
	showProgressResult.value = true;
	showResourceResult.value = false;
  };
  
  // 显示重置确认
  const showResetConfirm = () => {
	uni.showModal({
	  title: '重置确认',
	  content: `确定要重置当前科技树(${currentTree.value.title})的所有技能等级吗？`,
	  success: (res) => {
		if (res.confirm) {
		  resetCurrentTree();
		}
	  }
	});
  };
  
  // 重置当前科技树
  const resetCurrentTree = () => {
	// 计算返还的资源
	let refundAmount = 0;
	
	// 计算当前与初始状态的差异，返还所有消耗的资源
	currentTree.value.skills.forEach(skill => {
	  const initialSkill = initialTrees[currentTreeKey.value].skills.find(s => s.name === skill.name && s.level === skill.level);
	  
	  if (initialSkill && skill.currentLevel > initialSkill.currentLevel) {
		// 返还从初始等级到当前等级所消耗的所有资源
		for (let i = initialSkill.currentLevel; i < skill.currentLevel; i++) {
		  refundAmount += skill.resourcesPerLevel[i] || 0;
		}
	  }
	});
	
	// 重置为初始状态
	trees[currentTreeKey.value].skills = cloneDeep(initialTrees[currentTreeKey.value].skills);
	
	// 返还资源
	treeResources[currentTreeKey.value] += refundAmount;
	
	// 更新原始状态
	if (editMode.value) {
	  originalTrees[currentTreeKey.value].skills = cloneDeep(trees[currentTreeKey.value].skills);
	  pendingChanges[currentTreeKey.value] = [];
	}
	
	uni.showToast({
	  title: `重置成功，返还 ${refundAmount} 鱼骨头`,
	  icon: 'none',
	  duration: 2000
	});
	
	showResourceResult.value = false;
	showProgressResult.value = false;
  };
  
  // 导航方法
  const goBack = () => {
	uni.navigateBack();
  };
  
  const close = () => {
	uni.navigateBack();
  };
  </script>
  
  <style>
  .tech-tree-container {
	width: 100%;
	height: 100vh;
	background-color: #0a2a33;
	background-image: radial-gradient(circle, rgba(0, 150, 180, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%);
	color: #ffffff;
	position: relative;
  }
  
  .header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 30rpx;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .back-button {
	width: 60rpx;
	height: 60rpx;
	background-color: #333;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 8rpx;
  }
  
  .back-icon {
	width: 20rpx;
	height: 20rpx;
	border-top: 4rpx solid #fff;
	border-left: 4rpx solid #fff;
	transform: rotate(-45deg);
  }
  
  .title {
	font-size: 36rpx;
	font-weight: bold;
  }
  
  .close-button {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 40rpx;
  }
  
  .tree-selector {
	display: flex;
	padding: 20rpx;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	overflow-x: auto;
  }
  
  .tree-option {
	padding: 10rpx 20rpx;
	margin-right: 20rpx;
	border-radius: 10rpx;
	background-color: rgba(0, 0, 0, 0.3);
	font-size: 28rpx;
	white-space: nowrap;
  }
  
  .tree-option.active {
	background-color: rgba(0, 150, 180, 0.5);
  }
  
  .resource-controls {
	padding: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	flex-wrap: wrap;
  }
  
  .resource-display {
	display: flex;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.5);
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	margin-bottom: 10rpx;
  }
  
  .control-buttons {
	display: flex;
	gap: 10rpx;
	flex-wrap: wrap;
  }
  
  .control-button {
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	font-size: 24rpx;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
	border: 1px solid rgba(255, 255, 255, 0.3);
	line-height: 1.5;
	margin: 0;
  }
  
  .active-mode {
	background-color: #2196f3;
  }
  
  .save-button {
	background-color: #4caf50;
  }
  
  .reset-button {
	background-color: #d32f2f;
  }
  
  .edit-mode-tip {
	background-color: rgba(33, 150, 243, 0.2);
	padding: 10rpx 20rpx;
	font-size: 24rpx;
	text-align: center;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .resource-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
  }
  
  .tech-tree-content {
	height: calc(100vh - 320rpx);
	padding: 20rpx;
  }
  
  .level-container {
	margin-bottom: 40rpx;
  }
  
  .level-label {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.7);
	margin-bottom: 20rpx;
	text-align: center;
  }
  
  .skills-row {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 20rpx;
	margin-bottom: 20rpx;
  }
  
  .skills-row.center-skill {
	justify-content: center;
  }
  
  .skill-item {
	width: 320rpx;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 20rpx;
	padding: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	border: 2rpx solid rgba(255, 255, 255, 0.2);
	position: relative;
  }
  
  .skill-left {
	margin-right: auto;
  }
  
  .skill-right {
	margin-left: auto;
  }
  
  .skill-center {
	margin: 0 auto;
  }
  
  .skill-locked {
	opacity: 0.7;
	border: 2rpx solid rgba(255, 0, 0, 0.3);
  }
  
  .skill-unlocked {
	border: 2rpx solid rgba(255, 255, 0, 0.5);
  }
  
  .skill-maxed {
	border: 2rpx solid #4caf50;
	background-color: rgba(0, 50, 0, 0.5);
  }
  
  .skill-icon-container {
	position: relative;
  }
  
  .skill-icon {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	margin-bottom: 10rpx;
	background-color: #333;
  }
  
  .max-badge {
	position: absolute;
	top: -10rpx;
	right: -10rpx;
	background-color: #4caf50;
	color: white;
	font-size: 20rpx;
	padding: 4rpx 8rpx;
	border-radius: 10rpx;
  }
  
  .skill-name {
	font-size: 28rpx;
	margin-bottom: 10rpx;
	text-align: center;
	font-weight: bold;
  }
  
  .skill-level {
	font-size: 24rpx;
	margin-bottom: 10rpx;
	color: rgba(255, 255, 255, 0.8);
  }
  
  .skill-controls {
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 15rpx;
  }
  
  .btn-decrease, .btn-increase {
	width: 60rpx;
	height: 60rpx;
	font-size: 32rpx;
	line-height: 56rpx;
	text-align: center;
	background-color: rgba(0, 0, 0, 0.5);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 30rpx;
	color: white;
	padding: 0;
  }
  
  .btn-max {
	width: 100rpx;
	height: 60rpx;
	font-size: 24rpx;
	line-height: 56rpx;
	text-align: center;
	background-color: rgba(0, 100, 0, 0.5);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 30rpx;
	color: white;
	padding: 0;
  }
  
  button[disabled] {
	opacity: 0.5;
	background-color: #333;
  }
  
  .skill-dependencies {
	width: 100%;
	margin-top: 10rpx;
	margin-bottom: 10rpx;
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.7);
  }
  
  .dependency-item {
	margin-bottom: 5rpx;
  }
  
  .skill-cost {
	width: 100%;
	font-size: 24rpx;
	color: #ff9800;
	text-align: center;
	margin-top: 10rpx;
  }
  
  .unlock-next-level {
	width: 100%;
	font-size: 22rpx;
	color: #64b5f6;
	text-align: center;
	margin-top: 10rpx;
  }
  
  .connection-line {
	width: 2rpx;
	height: 60rpx;
	background-color: rgba(255, 255, 255, 0.3);
	margin: 0 auto;
	margin-bottom: 20rpx;
  }
  
  .action-buttons {
	margin-top: 60rpx;
	display: flex;
	justify-content: center;
	gap: 20rpx;
	flex-wrap: wrap;
  }
  
  .action-button {
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	border-radius: 50rpx;
	padding: 20rpx 40rpx;
	font-size: 28rpx;
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.3);
  }
  
  .button-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
  }
  
  .calculate-button {
	background: linear-gradient(135deg, #00796b, #004d40);
	color: white;
  }
  
  .progress-button {
	background: linear-gradient(135deg, #1976d2, #0d47a1);
	color: white;
  }
  
  .resource-result, .progress-result {
	margin-top: 40rpx;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.5);
  }
  
  .result-title {
	font-size: 32rpx;
	text-align: center;
	margin-bottom: 20rpx;
	color: #4caf50;
  }
  
  .result-content {
	display: flex;
	justify-content: center;
	margin-bottom: 20rpx;
  }
  
  .resource-value {
	font-size: 36rpx;
	color: #ff9800;
  }
  
  .remaining-resources {
	text-align: center;
	font-size: 28rpx;
	color: #f44336;
	margin-top: 20rpx;
  }
  
  .remaining-resources.positive {
	color: #4caf50;
  }
  
  .progress-content {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
  }
  
  .progress-item {
	background-color: rgba(0, 0, 0, 0.3);
	padding: 10rpx 20rpx;
	border-radius: 10rpx;
  }
  
  .progress-skill-name {
	font-weight: bold;
	font-size: 28rpx;
	margin-bottom: 5rpx;
  }
  
  .progress-detail {
	font-size: 24rpx;
	color: #8bc34a;
  }
  
  .no-progress {
	text-align: center;
	font-size: 28rpx;
	color: #f44336;
  }
  </style>
  
  