"use client";
import AppShell from "@/components/AppShell";
import { currentAdminUser, mockFeed } from "@/lib/mock-data";
import { Bell, Plus, X } from "lucide-react";
import { useState } from "react";

export default function AdminFeed() {
  const user = currentAdminUser;
  const [posts, setPosts] = useState(mockFeed);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (editingPost) {
      const updatedPosts: any = posts.map(p => p.id === editingPost.id ? {
        ...p,
        title: fd.get("title") as string,
        content: fd.get("content") as string,
        type: fd.get("type")
      } : p);
      setPosts(updatedPosts);
    } else {
      const newPost: any = {
        id: "post-" + Date.now(),
        author_id: user.id,
        title: fd.get("title") as string,
        content: fd.get("content") as string,
        type: fd.get("type"),
        created_at: new Date().toISOString()
      };
      setPosts([newPost, ...posts]);
    }
    setShowModal(false);
    setEditingPost(null);
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <AppShell role="admin" userName={user.full_name} userEmail={user.email}
      userInitials={user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Campus Feed Management</h1>
          <p className="text-text-muted text-sm mt-0.5">Create and manage announcements for the campus</p>
        </div>
        <button onClick={() => { setEditingPost(null); setShowModal(true); }} className="btn-primary btn-sm"><Plus className="w-3.5 h-3.5" />New Post</button>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="card p-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-accent">{post.type}</span>
              </div>
              <h3 className="font-heading font-bold text-text-primary">{post.title}</h3>
              <p className="text-text-muted text-sm mt-1 line-clamp-2">{post.content}</p>
              <div className="text-xs text-text-muted mt-2">{new Date(post.created_at).toLocaleDateString("en-IN")}</div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => { setEditingPost(post); setShowModal(true); }} className="btn-ghost btn-sm text-xs">Edit</button>
              <button onClick={() => handleDelete(post.id)} className="btn-danger btn-sm text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card w-full max-w-[600px] shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-5 border-b border-surface-border">
              <h2 className="font-heading font-bold text-text-primary">{editingPost ? "Edit Post" : "Create New Post"}</h2>
              <button onClick={() => { setShowModal(false); setEditingPost(null); }} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="label">Title</label>
                <input type="text" name="title" required defaultValue={editingPost?.title} className="input" placeholder="Announcement title..." />
              </div>
              <div>
                <label className="label">Category</label>
                <select name="type" required defaultValue={editingPost?.type || "General"} className="input bg-surface border-surface-border text-text-primary h-[42px] px-3 rounded-input outline-none focus:border-accent">
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Event">Event</option>
                  <option value="Alert">Alert</option>
                </select>
              </div>
              <div>
                <label className="label">Content</label>
                <textarea name="content" required rows={5} defaultValue={editingPost?.content} className="input resize-none py-3" placeholder="Write the announcement content here..."></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingPost(null); }} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary">{editingPost ? "Save Changes" : "Post Announcement"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
