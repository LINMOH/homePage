import { ref, computed, onMounted, onUnmounted } from 'vue';

// 缓存仓库信息
const repoCache = new Map();

/**
 * 从GitHub链接中提取owner和repo
 * @param {string} githubUrl - GitHub仓库链接
 * @returns {Object|null} - {owner, repo} 或 null
 */
export function extractRepoInfo(githubUrl) {
  if (!githubUrl || !githubUrl.includes('github.com')) {
    return null;
  }
  try {
    const url = new URL(githubUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      return {
        owner: pathParts[0],
        repo: pathParts[1]
      };
    }
    return null;
  } catch (error) {
    console.error('Error parsing GitHub URL:', error);
    return null;
  }
}

/**
 * 获取仓库的完整信息
 * @param {string} owner - 仓库所有者
 * @param {string} repo - 仓库名称
 * @returns {Promise<Object|null>} - 仓库信息或null
 */
export async function fetchRepoInfo(owner, repo) {
  if (!owner || !repo) {
    return null;
  }
  const cacheKey = `${owner}/${repo}`;
  // 检查缓存
  if (repoCache.has(cacheKey)) {
    return repoCache.get(cacheKey);
  }
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    const data = await response.json();
    // 提取并格式化仓库信息
    const repoInfo = {
      owner: data.owner?.login || null,
      ownerAvatar: data.owner?.avatar_url || null,
      repoName: data.name || null,
      description: data.description || null,
      pushedAt: data.pushed_at || null,
      updatedAt: data.updated_at || null,
      createdAt: data.created_at || null,
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      language: data.language || null,
      openIssues: data.open_issues_count || 0,
      homepage: data.homepage || null,
      topics: data.topics || [],
      size: data.size || 0,
      watchers: data.watchers_count || 0,
      license: data.license?.name || null,
      defaultBranch: data.default_branch || null,
      isPrivate: data.private || false,
      hasWiki: data.has_wiki || false,
      hasPages: data.has_pages || false
    };
    // 缓存结果
    repoCache.set(cacheKey, repoInfo);
    return repoInfo;
  } catch (error) {
    console.error('Error fetching repo info:', error);
    return null;
  }
}

/**
 * 计算时间差并返回友好的格式
 * @param {string} dateStr - ISO格式的日期字符串
 * @returns {string} - 友好的时间差描述
 */
export function getTimeAgo(dateStr) {
  if (!dateStr) {
    return 'Unknown';
  }
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else {
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }
}

/**
 * 可复用的组合式函数 - 获取GitHub仓库的完整信息
 * @param {string} githubUrl - GitHub仓库链接
 * @param {number} refreshInterval - 刷新间隔(毫秒),默认5分钟
 * @returns {Object} - 包含仓库所有信息的响应式对象
 */
export function useGithubRepo(githubUrl, refreshInterval = 5 * 60 * 1000) {
  const repoInfo = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // 计算属性 - 仓库信息
  const owner = computed(() => repoInfo.value?.owner || null);
  const ownerAvatar = computed(() => repoInfo.value?.ownerAvatar || null);
  const repoName = computed(() => repoInfo.value?.repoName || null);
  const description = computed(() => repoInfo.value?.description || null);
  const pushedAt = computed(() => repoInfo.value?.pushedAt || null);
  const updatedAt = computed(() => repoInfo.value?.updatedAt || null);
  const createdAt = computed(() => repoInfo.value?.createdAt || null);
  const stars = computed(() => repoInfo.value?.stars || 0);
  const forks = computed(() => repoInfo.value?.forks || 0);
  const language = computed(() => repoInfo.value?.language || null);
  const openIssues = computed(() => repoInfo.value?.openIssues || 0);
  const homepage = computed(() => repoInfo.value?.homepage || null);
  const topics = computed(() => repoInfo.value?.topics || []);
  const size = computed(() => repoInfo.value?.size || 0);
  const watchers = computed(() => repoInfo.value?.watchers || 0);
  const license = computed(() => repoInfo.value?.license || null);
  const defaultBranch = computed(() => repoInfo.value?.defaultBranch || null);
  const isPrivate = computed(() => repoInfo.value?.isPrivate || false);
  const hasWiki = computed(() => repoInfo.value?.hasWiki || false);
  const hasPages = computed(() => repoInfo.value?.hasPages || false);

  // 显示的时间
  const displayTime = computed(() => {
    if (pushedAt.value) {
      return getTimeAgo(pushedAt.value);
    }
    return 'Unknown';
  });

  // 获取仓库信息
  const fetchInfo = async () => {
    const repoData = extractRepoInfo(githubUrl);
    if (!repoData) {
      error.value = 'Invalid GitHub URL';
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const info = await fetchRepoInfo(repoData.owner, repoData.repo);
      repoInfo.value = info;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchInfo();
    // 设置定时更新
    if (refreshInterval > 0) {
      updateInterval = setInterval(fetchInfo, refreshInterval);
    }
  });

  let updateInterval = null;
  onUnmounted(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

  return {
    // 状态
    loading,
    error,
    // 仓库信息
    repoInfo,
    owner,
    ownerAvatar,
    repoName,
    description,
    pushedAt,
    updatedAt,
    createdAt,
    stars,
    forks,
    language,
    openIssues,
    homepage,
    topics,
    size,
    watchers,
    license,
    defaultBranch,
    isPrivate,
    hasWiki,
    hasPages,
    // 时间显示
    displayTime,
    // 工具方法
    refresh: fetchInfo
  };
}
