import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Filter = "all" | "questions" | "resources" | "mine";

interface Post {
  id: string;
  author: string;
  role: string;
  type: "question" | "resource" | "discussion";
  title: string;
  content: string;
  tags: string[];
  likes: number;
  replies: number;
  createdAt: string;
  isMine?: boolean;
}

const initialPosts: Post[] = [
  {
    id: "1",
    author: "Ananya Gupta",
    role: "CS Undergrad",
    type: "question",
    title: "Struggling with Dynamic Programming 🤯",
    content:
      "Any good resources or intuition for understanding DP? I keep mixing up overlapping subproblems and recursion tree.",
    tags: ["algorithms", "dynamic-programming"],
    likes: 8,
    replies: 5,
    createdAt: "2h ago",
  },
  {
    id: "2",
    author: "Rohit Sharma",
    role: "ML Enthusiast",
    type: "resource",
    title: "Free course for Linear Algebra (super clear!)",
    content:
      "Sharing this playlist that finally made eigenvalues & eigenvectors click for me.",
    tags: ["linear-algebra", "maths"],
    likes: 15,
    replies: 3,
    createdAt: "5h ago",
  },
  {
    id: "3",
    author: "You",
    role: "Student",
    type: "discussion",
    title: "Looking for a virtual study buddy for DSA",
    content:
      "Planning to practice DSA 1–2 hours daily. Anyone interested in doing leetcode / notes together?",
    tags: ["study-buddy", "dsa"],
    likes: 4,
    replies: 2,
    createdAt: "1d ago",
    isMine: true,
  },
];

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState<Filter>("all");

  const [newType, setNewType] = useState<"question" | "resource" | "discussion">(
    "question"
  );
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");

  const filteredPosts = posts.filter((p) => {
    if (filter === "mine") return p.isMine;
    if (filter === "questions") return p.type === "question";
    if (filter === "resources") return p.type === "resource";
    return true;
  });

  const createPost = () => {
    if (!newTitle.trim() && !newContent.trim()) return;

    const tags =
      newTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean) || [];

    const post: Post = {
      id: Math.random().toString(36).slice(2),
      author: "You",
      role: "Student",
      type: newType,
      title: newTitle.trim() || "(No title)",
      content: newContent.trim(),
      tags,
      likes: 0,
      replies: 0,
      createdAt: "Just now",
      isMine: true,
    };

    setPosts((prev) => [post, ...prev]);
    setNewTitle("");
    setNewContent("");
    setNewTags("");
    setNewType("question");
  };

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-sm text-muted-foreground">
            Connect with other learners, ask questions, share resources, and find study buddies.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Create Post */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Start a discussion</h2>
              <select
                value={newType}
                onChange={(e) =>
                  setNewType(e.target.value as "question" | "resource" | "discussion")
                }
                className="rounded-md border px-2 py-1 text-xs bg-background"
              >
                <option value="question">Question</option>
                <option value="discussion">Discussion</option>
                <option value="resource">Share a resource</option>
              </select>
            </div>

            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder='Title (e.g., "Help with DP" or "Great SQL cheatsheet")'
              className="w-full rounded-md border px-3 py-2 text-sm bg-white text-black"
            />


            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your question, idea, or resource details…"
              className="min-h-[80px] w-full rounded-md border px-3 py-2 text-sm bg-white text-black"
            />

            <input
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Tags (comma separated, e.g., dsa, recursion)"
              className="w-full rounded-md border px-3 py-2 text-xs bg-white text-black"
            />

            <div className="flex items-center justify-between">
              <div className="flex gap-2 text-[11px] text-muted-foreground">
                <span>Tip: Be specific & clear.</span>
              </div>
              <Button size="sm" onClick={createPost}>
                Post
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 text-xs">
            {(
              [
                ["all", "All"],
                ["questions", "Questions"],
                ["resources", "Resources"],
                ["mine", "My posts"],
              ] as [Filter, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-3 py-1 border ${filter === key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Feed */}
          {filteredPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-2">
              No posts yet in this view. Be the first to post!
            </p>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl border bg-card p-4 flex gap-3"
                >
                  {/* Avatar circle */}
                  <div className="mt-1 h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                    {post.author
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {post.author}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {post.role}
                          </span>
                          {post.type === "question" && (
                            <span className="rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-[2px]">
                              Question
                            </span>
                          )}
                          {post.type === "resource" && (
                            <span className="rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-[2px]">
                              Resource
                            </span>
                          )}
                          {post.type === "discussion" && (
                            <span className="rounded-full bg-blue-500/10 text-blue-500 text-[10px] px-2 py-[2px]">
                              Discussion
                            </span>
                          )}
                          {post.isMine && (
                            <span className="rounded-full bg-primary/10 text-primary text-[10px] px-2 py-[2px]">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {post.createdAt}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-accent px-2 py-[2px] text-[11px]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs mt-1">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <span>👍</span>
                        <span>{post.likes} likes</span>
                      </button>
                      <div className="inline-flex items-center gap-1 text-muted-foreground">
                        💬 <span>{post.replies} replies</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="space-y-4 rounded-xl border bg-card p-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Study groups</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">DSA – Beginner to LeetCode</div>
                  <div className="text-xs text-muted-foreground">
                    5 members • Daily 9–10 PM
                  </div>
                </div>
                <Button size="xs" variant="outline">
                  Join
                </Button>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Machine Learning Sundays</div>
                  <div className="text-xs text-muted-foreground">
                    8 members • Weekly
                  </div>
                </div>
                <Button size="xs" variant="outline">
                  Join
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Trending tags</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {["dsa", "system-design", "sql", "ml-roadmap", "gate2026"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent px-3 py-1 cursor-default"
                  >
                    #{tag}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            This is a simple prototype. In a real app, posts, groups, and likes
            would be synced with your backend.
          </div>
        </aside>
      </div>
    </div>
  );
}
