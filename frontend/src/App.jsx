import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen, LayoutDashboard, LibraryBig, Search, Plus, LogOut, Menu, X,
  Pencil, Trash2, CircleCheck, CircleX, Sparkles, UserRound, BarChart3,
  ChevronDown, CalendarDays
} from "lucide-react";
import api, { setAuthToken } from "./api";

const initialForm = {
  title: "", author: "", category: "Fiction", isbn: "", description: "",
  coverUrl: "", status: "Available", borrower: "", dueDate: ""
};

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("library_user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("library_token"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = (data) => {
    localStorage.setItem("library_token", data.token);
    localStorage.setItem("library_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("library_token");
    localStorage.removeItem("library_user");
    setToken(null);
    setUser(null);
  };

  if (!token || !user) return <AuthScreen onAuth={login} />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><BookOpen size={21} /></div>
          <div>
            <strong>Verde</strong>
            <span>Library</span>
          </div>
        </div>
        <div className="side-label">Workspace</div>
        <nav>
          <NavLink to="/" onClick={() => setSidebarOpen(false)}><LayoutDashboard size={18}/> Dashboard</NavLink>
          <NavLink to="/books" onClick={() => setSidebarOpen(false)}><LibraryBig size={18}/> Book Collection</NavLink>
        </nav>
        <div className="sidebar-note">
          <Sparkles size={17}/>
          <div><b>Smart library</b><small>Simple, clean & organized.</small></div>
        </div>
        <button className="logout-btn" onClick={logout}><LogOut size={17}/> Sign out</button>
      </aside>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(v => !v)}>
            {sidebarOpen ? <X/> : <Menu/>}
          </button>
          <div className="top-search"><Search size={17}/><span>Manage your collection with ease</span></div>
          <div className="profile">
            <div className="avatar">{user.name?.slice(0,1).toUpperCase()}</div>
            <div className="profile-copy"><b>{user.name}</b><span>{user.role}</span></div>
          </div>
        </header>
        <div className="page">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = mode === "login" ? "/auth/login" : "/auth/signup";
      const { data } = await api.post(url, form);
      onAuth(data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-art">
        <div className="auth-orb orb-one"></div><div className="auth-orb orb-two"></div>
        <div className="auth-brand"><BookOpen size={24}/><b>Verde Library</b></div>
        <div className="auth-quote">
          <span>YOUR SPACE TO</span>
          <h1>Read.<br/>Discover.<br/><em>Remember.</em></h1>
          <p>A refined library workspace for keeping every book within reach.</p>
        </div>
        <div className="mini-shelf"><BookOpen size={20}/><span>Curated collections • Easy search • Simple tracking</span></div>
      </div>
      <div className="auth-card-wrap">
        <form className="auth-card" onSubmit={submit}>
          <div className="eyebrow">WELCOME BACK</div>
          <h2>{mode === "login" ? "Sign in to your library" : "Create your account"}</h2>
          <p className="muted">{mode === "login" ? "Continue managing your collection." : "Start building your personal collection."}</p>
          {mode === "signup" && <Field label="Full name" value={form.name} onChange={v => setForm({...form, name:v})} placeholder="Your name"/>}
          <Field label="Email" type="email" value={form.email} onChange={v => setForm({...form, email:v})} placeholder="you@example.com"/>
          <Field label="Password" type="password" value={form.password} onChange={v => setForm({...form, password:v})} placeholder="••••••••"/>
          {error && <div className="error-box">{error}</div>}
          <button className="primary-btn wide" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}</button>
          <div className="switch-auth">
            {mode === "login" ? "New to Verde?" : "Already have an account?"}
            <button type="button" onClick={() => {setMode(mode === "login" ? "signup" : "login"); setError("");}}>
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({label, value, onChange, placeholder, type="text"}) {
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required /></label>;
}

function Dashboard() {
  const [stats, setStats] = useState({total:0, available:0, issued:0, categories:[]});
  const [books, setBooks] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/dashboard/stats"), api.get("/books")]).then(([s,b]) => {
      setStats(s.data); setBooks(b.data);
    }).catch(() => {});
  }, []);

  const recent = books.slice(0, 5);
  return (
    <>
      <div className="hero-head">
        <div><div className="eyebrow">LIBRARY OVERVIEW</div><h1>Your collection, <em>beautifully organized.</em></h1><p>Track books, availability and your growing reading space from one dashboard.</p></div>
        <NavLink to="/books" className="primary-btn"><Plus size={17}/> Add or manage books</NavLink>
      </div>

      <div className="stat-grid">
        <Stat title="Total books" value={stats.total} icon={<LibraryBig/>} note="In your collection"/>
        <Stat title="Available" value={stats.available} icon={<CircleCheck/>} note="Ready to borrow"/>
        <Stat title="Issued" value={stats.issued} icon={<CircleX/>} note="Currently borrowed"/>
        <Stat title="Categories" value={stats.categories.length} icon={<BarChart3/>} note="Unique genres"/>
      </div>

      <div className="content-grid">
        <section className="panel">
          <div className="panel-head"><div><h3>Recently added</h3><p>Your latest books</p></div><NavLink to="/books">View all</NavLink></div>
          {recent.length ? recent.map(book => <BookRow key={book._id} book={book}/>) : <Empty text="No books yet. Add your first book."/>}
        </section>
        <section className="panel category-panel">
          <div className="panel-head"><div><h3>Collection mix</h3><p>Books by category</p></div></div>
          {stats.categories.length ? stats.categories.slice(0,6).map(c => (
            <div className="category-row" key={c._id}><span>{c._id}</span><div className="bar"><i style={{width:`${Math.max(8, (c.count / stats.total)*100)}%`}}/></div><b>{c.count}</b></div>
          )) : <Empty text="Categories will appear here."/>}
        </section>
      </div>
    </>
  );
}

function Stat({title, value, icon, note}) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div><span>{title}</span><strong>{value}</strong><small>{note}</small></div></div>;
}

function BookRow({book}) {
  return <div className="book-row">
    <div className="book-cover small">{book.coverUrl ? <img src={book.coverUrl} /> : <BookOpen size={22}/>}</div>
    <div className="book-meta"><b>{book.title}</b><span>{book.author} · {book.category}</span></div>
    <span className={`status ${book.status.toLowerCase()}`}>{book.status}</span>
  </div>;
}

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const {data} = await api.get("/books", {params:{search, category, status}});
      setBooks(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, category, status]);
  const categories = useMemo(() => ["All", ...new Set(books.map(b => b.category))], [books]);

  const remove = async (id) => {
    if (!confirm("Delete this book from the collection?")) return;
    await api.delete(`/books/${id}`); load();
  };

  return (
    <>
      <div className="hero-head compact">
        <div><div className="eyebrow">BOOK COLLECTION</div><h1>Every story, <em>in one place.</em></h1><p>Search, edit, issue or remove books from your library.</p></div>
        <button className="primary-btn" onClick={() => setModal({type:"add", book:initialForm})}><Plus size={17}/> Add book</button>
      </div>
      <div className="toolbar">
        <div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, author or ISBN..."/></div>
        <select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select>
        <select value={status} onChange={e=>setStatus(e.target.value)}><option>All</option><option>Available</option><option>Issued</option></select>
      </div>

      <div className="book-grid">
        {loading ? <div className="loading">Loading books...</div> : books.length ? books.map(book =>
          <BookCard key={book._id} book={book} onEdit={() => setModal({type:"edit", book})} onDelete={() => remove(book._id)} onRefresh={load}/>
        ) : <div className="empty-wide"><Empty text="No books match your filters." /></div>}
      </div>

      {modal && <BookModal data={modal} onClose={()=>setModal(null)} onSaved={()=>{setModal(null); load();}}/>}
    </>
  );
}

function BookCard({book, onEdit, onDelete, onRefresh}) {
  const [busy, setBusy] = useState(false);
  const toggleStatus = async () => {
    setBusy(true);
    try {
      await api.patch(`/books/${book._id}/status`, {
        status: book.status === "Available" ? "Issued" : "Available",
        borrower: book.status === "Available" ? "Library member" : "",
        dueDate: book.status === "Available" ? new Date(Date.now()+14*86400000).toISOString() : null
      });
      onRefresh();
    } finally { setBusy(false); }
  };
  return <article className="book-card">
    <div className="cover">
      {book.coverUrl ? <img src={book.coverUrl} alt={book.title}/> : <div className="cover-placeholder"><BookOpen size={38}/><span>VERDE</span></div>}
      <span className={`status cover-status ${book.status.toLowerCase()}`}>{book.status}</span>
    </div>
    <div className="book-card-body">
      <span className="category-pill">{book.category}</span>
      <h3>{book.title}</h3><p className="author">by {book.author}</p>
      {book.description && <p className="description">{book.description}</p>}
      <div className="card-details">
        {book.isbn && <span>ISBN {book.isbn}</span>}
        {book.status === "Issued" && <span><CalendarDays size={13}/> {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : "Due soon"}</span>}
      </div>
      <div className="card-actions">
        <button className="soft-btn" onClick={toggleStatus} disabled={busy}>{book.status === "Available" ? "Mark issued" : "Mark available"}</button>
        <button className="round-btn" onClick={onEdit} title="Edit"><Pencil size={15}/></button>
        <button className="round-btn danger" onClick={onDelete} title="Delete"><Trash2 size={15}/></button>
      </div>
    </div>
  </article>;
}

function BookModal({data, onClose, onSaved}) {
  const [form, setForm] = useState(data.book);
  const [error, setError] = useState("");
  const submit = async e => {
    e.preventDefault(); setError("");
    try {
      if (data.type === "add") await api.post("/books", form);
      else await api.put(`/books/${form._id}`, form);
      onSaved();
    } catch (err) { setError(err.response?.data?.message || "Could not save book"); }
  };
  const update = (k,v) => setForm(f => ({...f,[k]:v}));
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <form className="modal" onSubmit={submit}>
      <div className="modal-head"><div><div className="eyebrow">{data.type === "add" ? "NEW BOOK" : "EDIT BOOK"}</div><h2>{data.type === "add" ? "Add a book" : "Update book details"}</h2></div><button type="button" className="round-btn" onClick={onClose}><X size={18}/></button></div>
      <div className="form-grid">
        <Field label="Title" value={form.title} onChange={v=>update("title",v)} placeholder="The Great Gatsby"/>
        <Field label="Author" value={form.author} onChange={v=>update("author",v)} placeholder="F. Scott Fitzgerald"/>
        <label className="field"><span>Category</span><select value={form.category} onChange={e=>update("category",e.target.value)}>{["Fiction","Non-fiction","Science","Technology","History","Biography","Self-help","Fantasy","Romance","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
        <Field label="ISBN" value={form.isbn || ""} onChange={v=>update("isbn",v)} placeholder="978-..."/>
        <div className="field full"><span>Cover image URL <small>(optional)</small></span><input value={form.coverUrl || ""} onChange={e=>update("coverUrl",e.target.value)} placeholder="https://..."/></div>
        <label className="field full"><span>Description</span><textarea rows="4" value={form.description || ""} onChange={e=>update("description",e.target.value)} placeholder="A short description of the book..."/></label>
      </div>
      {error && <div className="error-box">{error}</div>}
      <div className="modal-actions"><button type="button" className="soft-btn" onClick={onClose}>Cancel</button><button className="primary-btn">{data.type === "add" ? "Add book" : "Save changes"}</button></div>
    </form>
  </div>;
}

function Empty({text}) { return <div className="empty"><BookOpen size={28}/><span>{text}</span></div>; }

export default App;
