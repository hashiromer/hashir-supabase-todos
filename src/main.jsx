import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import "./styles.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Loading todos...");
  const [isSaving, setIsSaving] = useState(false);

  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);

  async function loadTodos() {
    if (!supabase) {
      setStatus("Supabase environment variables are not configured.");
      return;
    }

    const { data, error } = await supabase
      .from("todos")
      .select("id,title,is_complete,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    setTodos(data ?? []);
    setStatus((data ?? []).length ? "Synced with Supabase." : "No todos yet.");
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTodo(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || !supabase) {
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from("todos").insert({ title: cleanTitle });
    setIsSaving(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setTitle("");
    await loadTodos();
  }

  async function toggleTodo(todo) {
    if (!supabase) {
      return;
    }

    const { error } = await supabase
      .from("todos")
      .update({ is_complete: !todo.is_complete })
      .eq("id", todo.id);

    if (error) {
      setStatus(error.message);
      return;
    }

    await loadTodos();
  }

  async function deleteTodo(id) {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      setStatus(error.message);
      return;
    }

    await loadTodos();
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="header">
          <div>
            <p className="eyebrow">Supabase + Vercel test</p>
            <h1>Hashir Todos</h1>
          </div>
          <span className="sync-pill">{status}</span>
        </header>

        <form className="todo-form" onSubmit={addTodo}>
          <input
            aria-label="Todo title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add something to save..."
          />
          <button type="submit" disabled={isSaving || !title.trim()}>
            {isSaving ? "Saving" : "Add"}
          </button>
        </form>

        <ul className="todo-list" aria-label="Todos">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.is_complete ? "done" : ""}>
              <button
                className="check"
                type="button"
                aria-label={todo.is_complete ? "Mark incomplete" : "Mark complete"}
                onClick={() => toggleTodo(todo)}
              >
                {todo.is_complete ? "✓" : ""}
              </button>
              <span>{todo.title}</span>
              <button className="delete" type="button" onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
