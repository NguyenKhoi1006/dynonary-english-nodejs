import api from 'services/api';

const blogApi = {
  getBlogList: async () => {
    try {
      const res = await api.get('/apis/blog/');
      const blogList = (res.data.blogList || []).map((post) => ({
        _id: post.id,
        id: post.id,
        ...post,
      }));
      return { status: 200, data: { blogList } };
    } catch {
      return { status: 200, data: { blogList: [] } };
    }
  },

  getBlogHtml: async (_id) => {
    try {
      if (!_id) return { status: 200, data: { blogHtml: '' } };
      const res = await api.get(`/apis/blog/${_id}`);
      return { status: 200, data: { blogHtml: res.data.content || '' } };
    } catch {
      return { status: 200, data: { blogHtml: '' } };
    }
  },
};

export default blogApi;
