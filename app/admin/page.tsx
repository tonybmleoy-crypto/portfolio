"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProjectForm {
  slug: string;
  title: string;
  available: boolean;
  image: string;
  tag: string;
  timeline: string;
  users: string;
  description: { ru: string; en: string };
}

interface CaseForm {
  slug: string;
  title: string;
  coverImage: string;
  coverWidth: number | null;
  coverHeight: number | null;
  subtitle: { ru: string; en: string };
}

interface FormState {
  projects: ProjectForm[];
  cases: CaseForm[];
  home: { bio: { ru: string; en: string }; aboutBio: { ru: string; en: string } };
  social: { telegram: string; behance: string; linkedin: string; email: string; phone: string; cv: { ru: string; en: string } };
  musicLinks: { label: string; href: string }[];
}

type SaveStatus = { kind: "idle" } | { kind: "saving" } | { kind: "ok"; redeploying: boolean } | { kind: "error"; message: string };

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent-blue";
const labelClass = "block text-xs font-medium text-muted mb-1";
const fieldGroupClass = "flex flex-col gap-1";
const sectionClass = "rounded-2xl bg-surface p-6 shadow-card";

export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<FormState | null>(null);
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then(setState);
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function uploadImage(file: File, onDone: (path: string) => void, key: string) {
    setUploading(key);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(null);
    if (!res.ok) {
      setStatus({ kind: "error", message: data.error ?? "Upload failed." });
      return;
    }
    onDone(data.path);
  }

  async function save() {
    if (!state) return;
    setStatus({ kind: "saving" });

    const overrides = {
      projects: Object.fromEntries(
        state.projects.map((p) => [
          p.slug,
          {
            available: p.available,
            image: p.image,
            tag: p.tag,
            timeline: p.timeline,
            users: p.users,
            description: p.description,
          },
        ]),
      ),
      cases: Object.fromEntries(
        state.cases.map((c) => [
          c.slug,
          {
            title: c.title,
            coverImage: c.coverImage,
            coverWidth: c.coverWidth ?? undefined,
            coverHeight: c.coverHeight ?? undefined,
            subtitle: c.subtitle,
          },
        ]),
      ),
      home: state.home,
      social: state.social,
      musicLinks: state.musicLinks,
    };

    const res = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(overrides),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus({ kind: "error", message: data.error ?? "Save failed." });
      return;
    }
    setStatus({ kind: "ok", redeploying: data.redeploying });
  }

  if (!state) {
    return <div className="p-10 text-muted">Loading…</div>;
  }

  function updateProject(slug: string, patch: Partial<ProjectForm>) {
    setState((s) => s && { ...s, projects: s.projects.map((p) => (p.slug === slug ? { ...p, ...patch } : p)) });
  }

  function updateCase(slug: string, patch: Partial<CaseForm>) {
    setState((s) => s && { ...s, cases: s.cases.map((c) => (c.slug === slug ? { ...c, ...patch } : c)) });
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Управление сайтом</h1>
        <button onClick={logout} className="text-sm text-muted hover:text-foreground">
          Выйти
        </button>
      </div>
      <p className="mt-1 text-sm text-muted">
        Правки, которых здесь нет (текст внутри самих кейсов), по-прежнему меняются через Claude Code.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {/* Projects on the homepage */}
        <section className={sectionClass}>
          <h2 className="text-lg font-medium">Проекты на главной</h2>
          <div className="mt-4 flex flex-col gap-6">
            {state.projects.map((p) => (
              <div key={p.slug} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{p.title}</h3>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={p.available}
                      onChange={(e) => updateProject(p.slug, { available: e.target.checked })}
                    />
                    Показывать на сайте
                  </label>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className={fieldGroupClass}>
                    <label className={labelClass}>Тег</label>
                    <input
                      className={inputClass}
                      value={p.tag}
                      onChange={(e) => updateProject(p.slug, { tag: e.target.value })}
                    />
                  </div>
                  <div className={fieldGroupClass}>
                    <label className={labelClass}>Год (timeline)</label>
                    <input
                      className={inputClass}
                      value={p.timeline}
                      onChange={(e) => updateProject(p.slug, { timeline: e.target.value })}
                    />
                  </div>
                  <div className={fieldGroupClass}>
                    <label className={labelClass}>Пользователи</label>
                    <input
                      className={inputClass}
                      value={p.users}
                      onChange={(e) => updateProject(p.slug, { users: e.target.value })}
                    />
                  </div>
                  <div className={fieldGroupClass}>
                    <label className={labelClass}>Картинка карточки</label>
                    <div className="flex items-center gap-2">
                      {p.image && (
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-black/5">
                          <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="text-xs"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(file, (path) => updateProject(p.slug, { image: path }), `project-${p.slug}`);
                        }}
                      />
                    </div>
                    {uploading === `project-${p.slug}` && <p className="text-xs text-muted">Загрузка…</p>}
                  </div>
                  <div className={fieldGroupClass}>
                    <label className={labelClass}>Описание (RU)</label>
                    <textarea
                      className={inputClass}
                      rows={2}
                      value={p.description.ru}
                      onChange={(e) => updateProject(p.slug, { description: { ...p.description, ru: e.target.value } })}
                    />
                  </div>
                  <div className={fieldGroupClass}>
                    <label className={labelClass}>Описание (EN)</label>
                    <textarea
                      className={inputClass}
                      rows={2}
                      value={p.description.en}
                      onChange={(e) => updateProject(p.slug, { description: { ...p.description, en: e.target.value } })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Case study headers */}
        <section className={sectionClass}>
          <h2 className="text-lg font-medium">Кейсы</h2>
          <div className="mt-4 flex flex-col gap-6">
            {state.cases.map((c) => (
              <div key={c.slug} className="rounded-xl border border-border p-4">
                <h3 className="font-medium">{c.title}</h3>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className={fieldGroupClass}>
                    <label className={labelClass}>Заголовок</label>
                    <input className={inputClass} value={c.title} onChange={(e) => updateCase(c.slug, { title: e.target.value })} />
                  </div>
                  <div className={fieldGroupClass}>
                    <label className={labelClass}>Обложка</label>
                    <div className="flex items-center gap-2">
                      {c.coverImage && (
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-black/5">
                          <Image src={c.coverImage} alt="" fill sizes="40px" className="object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="text-xs"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            uploadImage(
                              file,
                              (path) => updateCase(c.slug, { coverImage: path }),
                              `case-${c.slug}`,
                            );
                        }}
                      />
                    </div>
                    {uploading === `case-${c.slug}` && <p className="text-xs text-muted">Загрузка…</p>}
                  </div>
                  <div className={fieldGroupClass}>
                    <label className={labelClass}>Подзаголовок (RU)</label>
                    <textarea
                      className={inputClass}
                      rows={2}
                      value={c.subtitle.ru}
                      onChange={(e) => updateCase(c.slug, { subtitle: { ...c.subtitle, ru: e.target.value } })}
                    />
                  </div>
                  <div className={fieldGroupClass}>
                    <label className={labelClass}>Подзаголовок (EN)</label>
                    <textarea
                      className={inputClass}
                      rows={2}
                      value={c.subtitle.en}
                      onChange={(e) => updateCase(c.slug, { subtitle: { ...c.subtitle, en: e.target.value } })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className={sectionClass}>
          <h2 className="text-lg font-medium">Ссылки</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["telegram", "behance", "linkedin", "email", "phone"] as const).map((key) => (
              <div key={key} className={fieldGroupClass}>
                <label className={labelClass}>{key}</label>
                <input
                  className={inputClass}
                  value={state.social[key]}
                  onChange={(e) => setState((s) => s && { ...s, social: { ...s.social, [key]: e.target.value } })}
                />
              </div>
            ))}
            <div className={fieldGroupClass}>
              <label className={labelClass}>CV (RU)</label>
              <input
                className={inputClass}
                value={state.social.cv.ru}
                onChange={(e) => setState((s) => s && { ...s, social: { ...s.social, cv: { ...s.social.cv, ru: e.target.value } } })}
              />
            </div>
            <div className={fieldGroupClass}>
              <label className={labelClass}>CV (EN)</label>
              <input
                className={inputClass}
                value={state.social.cv.en}
                onChange={(e) => setState((s) => s && { ...s, social: { ...s.social, cv: { ...s.social.cv, en: e.target.value } } })}
              />
            </div>
          </div>

          <h3 className="mt-5 text-sm font-medium">Ссылки под плеером</h3>
          <div className="mt-2 flex flex-col gap-2">
            {state.musicLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder="Название"
                  value={link.label}
                  onChange={(e) =>
                    setState((s) => s && { ...s, musicLinks: s.musicLinks.map((l, li) => (li === i ? { ...l, label: e.target.value } : l)) })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Ссылка"
                  value={link.href}
                  onChange={(e) =>
                    setState((s) => s && { ...s, musicLinks: s.musicLinks.map((l, li) => (li === i ? { ...l, href: e.target.value } : l)) })
                  }
                />
                <button
                  onClick={() => setState((s) => s && { ...s, musicLinks: s.musicLinks.filter((_, li) => li !== i) })}
                  className="shrink-0 rounded-lg px-3 text-sm text-muted hover:bg-black/5"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => setState((s) => s && { ...s, musicLinks: [...s.musicLinks, { label: "", href: "" }] })}
              className="w-fit text-sm text-accent-blue"
            >
              + добавить ссылку
            </button>
          </div>
        </section>

        {/* Home page text */}
        <section className={sectionClass}>
          <h2 className="text-lg font-medium">Главная страница</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className={fieldGroupClass}>
              <label className={labelClass}>Био в шапке (RU)</label>
              <textarea
                className={inputClass}
                rows={3}
                value={state.home.bio.ru}
                onChange={(e) => setState((s) => s && { ...s, home: { ...s.home, bio: { ...s.home.bio, ru: e.target.value } } })}
              />
            </div>
            <div className={fieldGroupClass}>
              <label className={labelClass}>Био в шапке (EN)</label>
              <textarea
                className={inputClass}
                rows={3}
                value={state.home.bio.en}
                onChange={(e) => setState((s) => s && { ...s, home: { ...s.home, bio: { ...s.home.bio, en: e.target.value } } })}
              />
            </div>
            <div className={fieldGroupClass}>
              <label className={labelClass}>«Обо мне», абзацы (RU) — пустая строка между абзацами</label>
              <textarea
                className={inputClass}
                rows={6}
                value={state.home.aboutBio.ru}
                onChange={(e) => setState((s) => s && { ...s, home: { ...s.home, aboutBio: { ...s.home.aboutBio, ru: e.target.value } } })}
              />
            </div>
            <div className={fieldGroupClass}>
              <label className={labelClass}>«Обо мне», абзацы (EN) — пустая строка между абзацами</label>
              <textarea
                className={inputClass}
                rows={6}
                value={state.home.aboutBio.en}
                onChange={(e) => setState((s) => s && { ...s, home: { ...s.home, aboutBio: { ...s.home.aboutBio, en: e.target.value } } })}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="sticky bottom-6 mt-8 flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-card">
        <button
          onClick={save}
          disabled={status.kind === "saving"}
          className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:opacity-50"
        >
          {status.kind === "saving" ? "Сохраняю…" : "Сохранить всё"}
        </button>
        {status.kind === "ok" && (
          <p className="text-sm text-accent-green">
            {status.redeploying ? "Сохранено. Сайт пересобирается, изменения появятся через 1–2 минуты." : "Сохранено."}
          </p>
        )}
        {status.kind === "error" && <p className="text-sm text-red-500">{status.message}</p>}
      </div>
    </main>
  );
}
