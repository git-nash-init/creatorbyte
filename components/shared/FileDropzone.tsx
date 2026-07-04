"use client";

import { useRef, useState } from "react";
import type { UploadedFile } from "@/lib/types";
import { formatBytes, uid } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { MdIcon, MdIconButton } from "@/components/md";

function kindFromType(type: string): UploadedFile["kind"] {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  return "file";
}

export function FileDropzone({
  files,
  onChange,
  accept,
  hint = "Unlimited files, 100MB total limit",
  compact = false,
}: {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  accept?: string;
  hint?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const added: UploadedFile[] = Array.from(list).map((f) => ({
      id: uid("f"),
      name: f.name,
      size: f.size,
      kind: kindFromType(f.type),
      url:
        f.type.startsWith("image/") || f.type.startsWith("video/")
          ? URL.createObjectURL(f)
          : undefined,
    }));
    onChange([...files, ...added]);
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-colors duration-200",
          compact ? "px-4 py-6" : "px-6 py-10",
          dragging
            ? "border-primary bg-primary-container/40"
            : "border-outline-variant bg-surface-low hover:border-primary/60"
        )}
      >
        <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-tertiary-container text-on-primary-container">
          <MdIcon>upload</MdIcon>
        </span>
        <p className="text-sm font-semibold text-on-surface">
          <span className="text-primary">Upload</span> or drag &amp; drop
        </p>
        <p className="text-xs text-on-surface-variant">{hint}</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 rounded-2xl border border-outline-variant bg-surface-lowest px-3 py-2.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-high text-on-surface-variant">
                <MdIcon style={{ fontSize: 20 }}>
                  {f.kind === "image"
                    ? "image"
                    : f.kind === "video"
                      ? "movie"
                      : "description"}
                </MdIcon>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-on-surface">
                  {f.name}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {formatBytes(f.size)}
                </p>
              </div>
              <MdIconButton
                aria-label={`Remove ${f.name}`}
                onClick={() => onChange(files.filter((x) => x.id !== f.id))}
              >
                <MdIcon>delete</MdIcon>
              </MdIconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
