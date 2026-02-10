"use client";

import styles from "./NoteCard.module.css";

export type NoteCardProps = {
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  onEdit: () => void;
  onDelete: () => void;
};

export function NoteCard({
  title,
  content,
  tags,
  createdAt,
  onEdit,
  onDelete
}: NoteCardProps) {
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>{title || "Untitled note"}</h2>
          <time className={styles.timestamp}>{formattedDate}</time>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={onEdit} className={styles.actionBtn}>
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={`${styles.actionBtn} ${styles.delete}`}
          >
            Delete
          </button>
        </div>
      </header>
      <p className={styles.content}>{content}</p>
      {!!tags.length && (
        <footer className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
