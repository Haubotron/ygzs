<template>
	<view class="content">
		<!-- 轮播图 -->
		<swiper :circular="true" :autoplay="true" :interval="3000">
			<swiper-item>
				<image src="@/static/images/banner/banner1.png" mode="widthFix" class="banner-image"></image>
			</swiper-item>
			<swiper-item>
				<image src="@/static/images/banner/banner2.png" mode="widthFix" class="banner-image"></image>
			</swiper-item>
		</swiper>

		<view class="top-card">
			<view class="top-card-item">
				<image src="@/static/images/home/ant.png" mode="widthFix" class="card-image"></image>
				<text class="card-text">特化蚁</text>
			</view>
			<view class="dotted-line"></view>
			<view class="top-card-item">
				<image src="@/static/images/home/wild-monster.png" mode="widthFix" class="card-image"></image>
			<text class="card-text">野怪</text>
			</view>
		</view>
 
		<!-- 功能卡片 -->
		<view class="menu-card">
			<view class="menu-card-item" v-for="item in menuCard" :key="item.id" @click="handleClick(item.path)">
				<image :src="`/static/images/home/${item.image}`" mode="widthFix" class="card-image"></image>
				<text class="menu-card-text">{{ item.title }}</text>
			</view>
		</view>

		<!-- 最强区域站 -->
		<view class="strongest-area-station">
			<view class="strongest-area-station-item">
				<image src="@/static/images/home/regional-warfare.png" mode="widthFix" class="card-image"></image>
				<text class="card-text">最强区域站</text>
			</view>
		</view>
		<!-- 测试工作流新特性 -->

	</view>
</template>

<script setup>
import { menuCard } from './config.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = (path) => {
	uni.navigateTo({
		url: path
	})
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>