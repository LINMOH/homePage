// 知乎粉丝数数据缓存
const followerCache = {};

/**
 * 获取知乎用户粉丝数
 * @param {string} userSlug - 知乎用户slug (如: lin-56-61-20)
 * @returns {Promise<number>} 粉丝数
 */
/**
 * 获取知乎用户粉丝数
 * @param {string} userSlug - 知乎用户slug (如: lin-56-61-20)
 * @returns {Promise<number|string>} 粉丝数或提示
 */
export const getZhihuFollowerCount = async (userSlug) => {
  // 检查缓存
  if (followerCache[userSlug]) {
    return followerCache[userSlug];
  }

  // 知乎API要求严格认证，前端无法直接获取
  // 返回特殊标记表示需要查看原站
  console.info('知乎API需要后端支持，建议访问原站查看粉丝数');
  followerCache[userSlug] = 'view-on-site';
  return 'view-on-site';
};

/**
 * 批量获取知乎粉丝数
 * @param {Array} items - 包含isZhihuCard和userSlug的项目数组
 * @returns {Promise<Object>} userSlug到粉丝数的映射对象
 */
export const fetchZhihuFollowers = async (items) => {
  const result = {};
  const zhihuCards = items.filter((item) => item.isZhihuCard);

  for (const card of zhihuCards) {
    result[card.userSlug] = await getZhihuFollowerCount(card.userSlug);
  }

  return result;
};
