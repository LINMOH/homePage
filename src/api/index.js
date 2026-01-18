/**
 * API 统一管理
 * 集中管理所有 API 调用
 */

import { getFollowerCount } from '../utils/bilibili.js';

/**
 * 获取哔哩哔哩粉丝数
 * @param {number} vmid - 用户ID
 * @returns {Promise<number>} 粉丝数
 */
export const fetchBilibiliFollowers = async (vmid) => {
  return await getFollowerCount(vmid);
};

/**
 * 获取知乎粉丝数
 * @param {Array} items - 包含知乎卡片的项目数组
 * @returns {Promise<Object>} 用户slug到粉丝数的映射对象
 */
export const fetchZhihuFollowers = async (items) => {
  const { fetchZhihuFollowers: fetchZhihu } = await import('../utils/zhihu.js');
  return await fetchZhihu(items);
};

/**
 * 获取GitHub仓库信息
 * @param {string} repoUrl - 仓库URL
 * @returns {Promise<Object>} 仓库信息
 */
export const fetchGithubRepoInfo = async (repoUrl) => {
  const { useGithubRepo } = await import('../utils/githubApi.js');
  return useGithubRepo(repoUrl);
};

/**
 * 获取所有社交媒体粉丝数
 * @param {Array} items - 所有项目数组
 * @returns {Promise<Object>} 所有粉丝数的映射对象
 */
export const fetchAllFollowers = async (items) => {
  const result = {};

  // 获取哔哩哔哩粉丝数
  const vmid = 2126856300;
  result[vmid] = await fetchBilibiliFollowers(vmid);

  // 获取知乎粉丝数
  const zhihuFollowers = await fetchZhihuFollowers(items);
  Object.assign(result, zhihuFollowers);

  return result;
};
