"use client";

import { useState } from "react";
import styles from "./TagInput.module.css";

export type TagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
};

export function TagInput({
  tags,
  onChange,
  placeholder = "Add a tag and press enter",
  label
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const addTag = (raw: string) => {
    const value = raw.trim().toLowerCase();
    if (!value) return;
    if (tags.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...tags, value]);
    setDraft("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
    } else if (event.key === "Backspace" && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (draft.trim()) {
      addTag(draft);
    }
  };

  return (
    <label className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.container}>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={styles.tag}
              onClick={() =>
                onChange(tags.filter((existingTag) => existingTag !== tag))
              }
            >
              <span>#{tag}</span>
              <span aria-hidden="true">×</span>
            </button>
          ))}
          <input
            className={styles.input}
            placeholder={placeholder}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            aria-label={placeholder}
          />
        </div>
      </div>
    </label>
  );
}
