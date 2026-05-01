import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Heart, MessageCircle, Send } from 'lucide-react';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [commentText, setCommentText] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await api.get('/api/posts/');
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!content.trim()) return;

    try {
      await api.post('/api/posts/', { content });
      setContent('');
      fetchPosts();
    } catch {
      alert('Failed to create post');
    }
  };

  const toggleLike = async (postId) => {
    try {
      await api.post(`/api/posts/${postId}/like`);
      fetchPosts();
    } catch {
      alert('Failed to like post');
    }
  };

  const addComment = async (postId) => {
    const text = commentText[postId];

    if (!text?.trim()) return;

    try {
      await api.post(`/api/posts/${postId}/comments`, {
        content: text,
      });

      setCommentText({ ...commentText, [postId]: '' });
      fetchPosts();
    } catch {
      alert('Failed to comment');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-2">Community Feed</h1>
      <p className="text-slate-400 mb-6">
        Share volunteering experiences, updates, and social impact stories.
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
        <textarea
          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none"
          rows="3"
          placeholder="Share something with the Rootify community..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={createPost}
            className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Send size={16} /> Post
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {posts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            No posts yet. Be the first to share.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center font-bold">
                  {post.author_name?.[0] || 'U'}
                </div>

                <div>
                  <h3 className="font-semibold">{post.author_name}</h3>
                  <p className="text-xs text-slate-500">
                    {post.author_type || 'user'} •{' '}
                    {post.timestamp
                      ? new Date(post.timestamp).toLocaleString()
                      : ''}
                  </p>
                </div>
              </div>

              <p className="text-slate-200 mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              <div className="flex items-center gap-5 border-t border-slate-800 pt-3">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 text-sm ${post.liked_by_me ? 'text-red-400' : 'text-slate-400'
                    } hover:text-red-400`}
                >
                  <Heart
                    size={18}
                    className={post.liked_by_me ? 'fill-red-400' : ''}
                  />
                  {post.likes_count || 0} Likes
                </button>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MessageCircle size={18} />
                  {post.comments?.length || 0} Comments
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {post.comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3"
                  >
                    <p className="text-sm font-medium">{comment.user_name}</p>
                    <p className="text-sm text-slate-300">{comment.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <input
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none"
                  placeholder="Write a comment..."
                  value={commentText[post.id] || ''}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [post.id]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() => addComment(post.id)}
                  className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm"
                >
                  Comment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}