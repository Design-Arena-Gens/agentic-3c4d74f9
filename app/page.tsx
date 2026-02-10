"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Note, loadNotes, saveNotes } from "@/lib/storage";
import { TagInput } from "@/components/TagInput";
import { NoteCard } from "@/components/NoteCard";
import styles from "./page.module.css";

type Draft = {
  id?: string;
  title: string;
  content: string;
  tags: string[];
};

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState<Draft>({
    title: "",
    content: "",
    tags: []
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilters, setTagFilters] = useState<string[]>([]);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const allTags = useMemo(() => {
    const unique = new Set<string>();
    notes.forEach((note) => note.tags.forEach((tag) => unique.add(tag)));
    return Array.from(unique).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesTerm =
        !term ||
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term);
      const matchesTags =
        tagFilters.length === 0 ||
        tagFilters.every((tag) => note.tags.includes(tag));
      return matchesTerm && matchesTags;
    });
  }, [notes, searchTerm, tagFilters]);

  const resetDraft = () =>
    setDraft({
      title: "",
      content: "",
      tags: []
    });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim() && !draft.content.trim()) {
      return;
    }

    if (draft.id) {
      setNotes((current) =>
        current.map((note) =>
          note.id === draft.id
            ? {
                ...note,
                title: draft.title.trim(),
                content: draft.content.trim(),
                tags: draft.tags,
                updatedAt: new Date().toISOString()
              }
            : note
        )
      );
    } else {
      const now = new Date().toISOString();
      setNotes((current) => [
        {
          id: crypto.randomUUID(),
          title: draft.title.trim(),
          content: draft.content.trim(),
          tags: draft.tags,
          createdAt: now,
          updatedAt: now
        },
        ...current
      ]);
    }

    resetDraft();
  };

  const handleEdit = (note: Note) => {
    setDraft({
      id: note.id,
      title: note.title,
      content: note.content,
      tags: note.tags
    });
  };

  const handleDelete = (id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id));
    if (draft.id === id) {
      resetDraft();
    }
  };

  const toggleTagFilter = (tag: string) => {
    setTagFilters((current) =>
      current.includes(tag)
        ? current.filter((existing) => existing !== tag)
        : [...current, tag]
    );
  };

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>Pocket Notes</h1>
        <p>Capture thoughts fast. Organize with tags and find anything instantly.</p>
      </header>

      <section className={styles.panel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <h2>{draft.id ? "Edit note" : "New note"}</h2>
            {draft.id && (
              <button
                type="button"
                className={styles.resetBtn}
                onClick={resetDraft}
              >
                Cancel edit
              </button>
            )}
          </div>
          <label className={styles.field}>
            <span>Title</span>
            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Quick reminder..."
              maxLength={120}
            />
          </label>

          <label className={styles.field}>
            <span>Details</span>
            <textarea
              value={draft.content}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, content: event.target.value }))
              }
              placeholder="Jot down the context, checklist, or draft..."
              rows={5}
            />
          </label>

          <TagInput
            label="Tags"
            tags={draft.tags}
            onChange={(tags) => setDraft((prev) => ({ ...prev, tags }))}
          />

          <button type="submit" className={styles.submitBtn}>
            {draft.id ? "Update note" : "Save note"}
          </button>
        </form>
      </section>

      <section className={styles.filters}>
        <div className={styles.search}>
          <label>
            <span className={styles.searchLabel}>Search</span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title or content"
            />
          </label>
        </div>
        {allTags.length > 0 && (
          <div className={styles.tagFilters}>
            <span className={styles.tagFiltersLabel}>Filter by tags</span>
            <div className={styles.tagList}>
              {allTags.map((tag) => {
                const active = tagFilters.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    className={`${styles.tagButton} ${
                      active ? styles.tagButtonActive : ""
                    }`}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className={styles.results}>
        {filteredNotes.length === 0 ? (
          <div className={styles.empty}>
            <h3>No notes yet</h3>
            <p>
              Create your first note or adjust your search and tag filters to see
              saved ideas.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                title={note.title}
                content={note.content}
                tags={note.tags}
                createdAt={note.createdAt}
                onEdit={() => handleEdit(note)}
                onDelete={() => handleDelete(note.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
