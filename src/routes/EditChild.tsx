import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useChildrenStore } from "../stores/useChildrenStore";

function fileToDataURL(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

export default function EditChild() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const children = useChildrenStore((s) => s.children);
  const renameChild = useChildrenStore((s) => s.renameChild);
  const setPhoto = useChildrenStore((s) => s.setPhoto);
  const setActiveChild = useChildrenStore((s) => s.setActiveChild);

  const child = children.find((c) => c.id === id) ?? null;

  const [name, setName] = useState(child?.name ?? "");
  const [preview, setPreview] = useState<string | null>(
    child?.photoUrl ?? null,
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!child) {
      navigate("/trust", { replace: true });
    }
  }, [child, navigate]);

  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setPreview(child?.photoUrl ?? null);
      setFileName(null);
      return;
    }

    const data = await fileToDataURL(f);
    setPreview(data);
    setFileName(f.name);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!child || pending) return;
    setPending(true);
    try {
      renameChild(child.id, name);
      setPhoto(child.id, preview ?? null);
      setActiveChild(child.id);
      navigate("/trust");
    } finally {
      setPending(false);
    }
  }

  if (!child) {
    return null;
  }

  return (
    <main className="min-h-full bg-bg flex justify-center px-4 py-6">
      <section className="card w-full max-w-xl px-6 py-6">
        <h1 className="mb-4 text-2xl font-semibold text-fg">
          {t("editChild.title")}
        </h1>

        <form
          onSubmit={onSubmit}
          className="space-y-4"
          aria-labelledby="edit-child-form"
        >
          <label className="block" htmlFor="child-name">
            <span className="mb-1 block text-sm text-fg">
              {t("addChild.name")}
            </span>
            <input
              id="child-name"
              type="text"
              className="input w-full"
              placeholder={t("addChild.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <div className="block">
            <span className="mb-1 block text-sm text-fg">
              {t("addChild.photo")}
            </span>

            <input
              id="child-photo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileChange}
            />

            <div className="flex justify-center">
              <label
                htmlFor="child-photo"
                className="btn btn-ghost px-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                {t("addChild.chooseFile")}
              </label>
            </div>

            <p className="mt-1 text-center text-xs text-muted">
              {fileName ?? t("addChild.noFileSelected")}
            </p>
          </div>

          <div className="mt-2 flex justify-center">
            {preview ? (
              <img
                src={preview}
                alt={t("addChild.photoPreviewAlt")}
                className="h-24 w-24 rounded-2xl border border-token object-cover"
              />
            ) : (
              <div className="grid h-24 w-24 place-items-center rounded-2xl border border-dashed border-token text-sm text-muted">
                {t("addChild.previewPlaceholder")}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              to="/trust"
              className="btn btn-ghost focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t("addChild.cancel")}
            </Link>

            <button
              type="submit"
              className="btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
              disabled={pending}
            >
              {t("addChild.save")}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
