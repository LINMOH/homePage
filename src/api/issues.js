import { ref, computed } from 'vue';
import { currentLanguage } from '../locales/index.js';

// 缓存GitHub Issues数据
const issuesCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

/**
 * 格式化日期为本地时间
 * @param {string} dateStr - ISO格式的日期字符串
 * @returns {string} - 格式化后的本地时间
 */
export function formatLocalDate(dateStr) {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
}

/**
 * 获取GitHub Issues
 * @param {string} apiUrl - GitHub Issues API URL
 * @returns {Promise<Array>} - Issues数组
 */
export async function fetchGitHubIssues(apiUrl) {
  if (!apiUrl) {
    throw new Error('API URL is required');
  }
  
  // 检查缓存
  const cacheKey = apiUrl;
  const cached = issuesCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const issues = await response.json();
    
    // 处理数据
    const processedIssues = issues.map(issue => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body || '',
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      html_url: issue.html_url,
      user: {
        login: issue.user?.login,
        avatar_url: issue.user?.avatar_url
      },
      state: issue.state,
      comments: issue.comments,
      labels: issue.labels || []
    }));
    
    // 按创建时间倒序排序
    processedIssues.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // 更新缓存
    issuesCache.set(cacheKey, {
      data: processedIssues,
      timestamp: Date.now()
    });
    
    return processedIssues;
  } catch (error) {
    console.error('Error fetching GitHub issues:', error);
    throw error;
  }
}

/**
 * 计算时间差并返回友好的格式（支持多语言）
 * @param {string} dateStr - ISO格式的日期字符串
 * @returns {string} - 友好的时间差描述
 */
function getTimeAgo(dateStr) {
  if (!dateStr) {
    return getTimeAgoText('unknown');
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
    return getTimeAgoText('just_now');
  } else if (diffMins < 60) {
    return getTimeAgoText('minutes_ago', diffMins);
  } else if (diffHours < 24) {
    return getTimeAgoText('hours_ago', diffHours);
  } else if (diffDays < 30) {
    return getTimeAgoText('days_ago', diffDays);
  } else if (diffMonths < 12) {
    return getTimeAgoText('months_ago', diffMonths);
  } else {
    return getTimeAgoText('years_ago', diffYears);
  }
}

/**
 * 根据当前语言获取时间描述文本
 * @param {string} key - 时间描述键名
 * @param {number} value - 时间值
 * @returns {string} - 对应语言的文本
 */
function getTimeAgoText(key, value = null) {
  const lang = currentLanguage.value;
  
  // 默认英文文本
  const defaultTexts = {
    just_now: 'just now',
    minutes_ago: (v) => `${v} minute${v > 1 ? 's' : ''} ago`,
    hours_ago: (v) => `${v} hour${v > 1 ? 's' : ''} ago`,
    days_ago: (v) => `${v} day${v > 1 ? 's' : ''} ago`,
    months_ago: (v) => `${v} month${v > 1 ? 's' : ''} ago`,
    years_ago: (v) => `${v} year${v > 1 ? 's' : ''} ago`,
    unknown: 'unknown time'
  };
  
  // 中文文本
  const zhTexts = {
    just_now: '刚刚',
    minutes_ago: (v) => `${v}分钟前`,
    hours_ago: (v) => `${v}小时前`,
    days_ago: (v) => `${v}天前`,
    months_ago: (v) => `${v}个月前`,
    years_ago: (v) => `${v}年前`,
    unknown: '未知时间'
  };
  
  // 日文文本
  const jpTexts = {
    just_now: 'たった今',
    minutes_ago: (v) => `${v}分前`,
    hours_ago: (v) => `${v}時間前`,
    days_ago: (v) => `${v}日前`,
    months_ago: (v) => `${v}ヶ月前`,
    years_ago: (v) => `${v}年前`,
    unknown: '不明な時間'
  };
  
  // 根据语言选择文本
  let texts;
  if (lang === 'zh') {
    texts = zhTexts;
  } else if (lang === 'jp') {
    texts = jpTexts;
  } else {
    texts = defaultTexts;
  }
  
  const text = texts[key];
  if (typeof text === 'function') {
    return text(value);
  }
  return text;
}

/**
 * 可复用的组合式函数 - 获取GitHub Issues
 * @param {string} apiUrl - GitHub Issues API URL
 * @param {number} refreshInterval - 刷新间隔(毫秒),默认10分钟
 * @returns {Object} - 包含issues信息的响应式对象
 */
export function useGitHubIssues(apiUrl, refreshInterval = 10 * 60 * 1000) {
  const issues = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // 获取issues
  const fetchIssues = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await fetchGitHubIssues(apiUrl);
      issues.value = data;
    } catch (err) {
      error.value = err.message;
      issues.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  // 计算属性 - 格式化后的issues
  const formattedIssues = computed(() => {
    return issues.value.map(issue => ({
      ...issue,
      formatted_date: formatLocalDate(issue.created_at),
      time_ago: getTimeAgo(issue.created_at)
    }));
  });
  
  // 计算属性 - 是否有issues
  const hasIssues = computed(() => issues.value.length > 0);
  
  return {
    // 状态
    issues: formattedIssues,
    loading,
    error,
    hasIssues,
    
    // 工具方法
    refresh: fetchIssues,
    
    // 原始数据（如果需要）
    rawIssues: issues
  };
}
