// Bilibili粉丝数数据缓存
const followerCache = {};

/**
 * 获取Bilibili用户粉丝数
 * @param {number} vmid - 视频主ID
 * @returns {Promise<number>} 粉丝数
 */
export const getFollowerCount = async (vmid) => {
  // 检查缓存
  if (followerCache[vmid]) {
    return followerCache[vmid];
  }
  try {
    // 使用Vite代理URL（开发环境）或直接使用API（生产环境）
    const apiUrl =
      import.meta.env.DEV
        ? `/api/bilibili/x/relation/stat?vmid=${vmid}&web_location=333.1387`
        : `https://api.bilibili.com/x/relation/stat?vmid=${vmid}&web_location=333.1387`;
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://space.bilibili.com/' + vmid,
        'Origin': 'https://space.bilibili.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'DNT': '1'
      }
    });
    const data = await response.json();
    if (data.code === 0 && data.data) {
      // 缓存结果
      followerCache[vmid] = data.data.follower;
      return data.data.follower;
    }
  } catch (error) {
    console.error('获取Bilibili粉丝数失败:', error);
  }
  return 0;
};

/**
 * 批量获取Bilibili粉丝数
 * @param {Array} items - 包含isFollowerCard和vmid的项目数组
 * @returns {Promise<Object>} vmid到粉丝数的映射对象
 */
export const fetchBilibiliFollowers = async (items) => {
  const result = {};
  const bilibiliCards = items.filter((item) => item.isFollowerCard);
  for (const card of bilibiliCards) {
    result[card.vmid] = await getFollowerCount(card.vmid);
  }
  return result;
};
