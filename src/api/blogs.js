import { ref, computed, watch } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// --- 简单的 Frontmatter 解析器 (替代 gray-matter) ---
function parseMarkdown(rawContent) {
  const pattern = /^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(pattern);

  if (!match) {
    return { data: {}, content: rawContent };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data = {};

  // 将 YAML 键值对转为对象
  yamlBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // 去除引号
      value = value.replace(/^['"]|['"]$/g, '');
      // 处理数组格式 [a, b]
      if (value.startsWith('[') && value.endsWith(']')) {
        data[key] = value.slice(1, -1).split(',').map(s => s.trim());
      } else {
        data[key] = value;
      }
    }
  });

  return { data, content };
}

// --- 配置 Markdown-it ---
const md = new MarkdownIt({
  html: true,
  linkify: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return '';
  }
});

// --- 添加数学公式支持 ---
// 更健壮的数学公式处理
const originalRender = md.renderer.render;

// 重写render方法，在渲染后处理数学公式
md.renderer.render = function(tokens, options, env) {
  let result = originalRender.call(this, tokens, options, env);
  
  // 处理行内数学公式：$...$
  result = result.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
    // 转义特殊字符
    math = math.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/\"/g, '&quot;');
    return `<span class="math-inline">\\(${math}\\)</span>`;
  });
  
  // 处理块级数学公式：$$...$$
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    // 转义特殊字符
    math = math.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/\"/g, '&quot;');
    return `<div class="math-block">\\[${math}\\]</div>`;
  });
  
  return result;
};

// --- 获取所有 Markdown 文件 ---
// 注意：路径必须以 /src 开头，不能使用别名 @
const blogModules = import.meta.glob('/src/data/blogs/*.md', { query: '?raw', import: 'default' });

// 辅助函数：将标签字符串转换为数组
function normalizeTags(tags) {
  if (!tags) return [];
  
  if (Array.isArray(tags)) {
    return tags;
  }
  
  // 如果是字符串，按逗号分割
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  
  return [];
}

/**
 * API: 获取博客列表
 */
export async function fetchBlogPosts() {
  const posts = [];
  const paths = Object.keys(blogModules);

  if (paths.length === 0) {
    console.warn('未在 /src/data/blogs/ 目录下找到 .md 文件');
  }

  for (const path of paths) {
    try {
      const rawContent = await blogModules[path]();
      const { data, content } = parseMarkdown(rawContent);
      const id = path.split('/').pop().replace('.md', '');

      posts.push({
        id,
        title: data.title || 'Untitled',
        date: data.date || '2024-01-01',
        excerpt: data.excerpt || content.slice(0, 100).replace(/[#*`\n]/g, '') + '...',
        tags: normalizeTags(data.tags || data.categories), // 使用 normalizeTags 函数
        readTime: data.readTime || '5 min read',
        content: content // 原始内容供详情页使用
      });
    } catch (e) {
      console.error(`解析失败: ${path}`, e);
    }
  }

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * API: 获取单篇博客内容
 */
export async function fetchBlogPost(postId) {
  const path = `/src/data/blogs/${postId}.md`;
  const loader = blogModules[path];

  if (!loader) return null;

  const rawContent = await loader();
  const { data, content } = parseMarkdown(rawContent);
  
  return {
    id: postId,
    ...data,
    tags: normalizeTags(data.tags || data.categories), // 使用 normalizeTags 函数
    content
  };
}

/**
 * Composition API Hook
 */
export function useBlogPosts(postIdRef = null) {
  const posts = ref([]);
  const post = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
      // 兼容 ref 或普通字符串
      const id = (postIdRef && postIdRef.value) ? postIdRef.value : postIdRef;

      if (id && typeof id === 'string') {
        const data = await fetchBlogPost(id);
        post.value = data;
      } else {
        const data = await fetchBlogPosts();
        posts.value = data;
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // 监听 ID 变化（用于详情页切换）
  if (postIdRef && typeof postIdRef !== 'string') {
    watch(() => postIdRef.value, fetchData, { immediate: true });
  } else {
    fetchData();
  }

  // 辅助计算属性
  const formattedPosts = computed(() => posts.value);
  const formattedPost = computed(() => {
    if (!post.value) return null;
    return {
      ...post.value,
      htmlContent: md.render(post.value.content)
    };
  });

  return {
    posts: formattedPosts,
    post: formattedPost,
    loading,
    error,
    hasPosts: computed(() => posts.value.length > 0),
    refresh: fetchData
  };
}