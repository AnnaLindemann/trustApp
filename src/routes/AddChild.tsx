// src/routes/AddChild.tsx
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
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

export default function AddChild() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const addChild = useChildrenStore((s) => s.addChild);
  const setActiveChild = useChildrenStore((s) => s.setActiveChild);

  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string | null>(null); // data URL
  const [pending, setPending] = useState(false);

  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setPreview(null);
      return;
    }
    // сохраняем устойчиво — как data URL
    const data = await fileToDataURL(f);
    setPreview(data);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      const id = addChild({ name, photoUrl: preview ?? null });
      setActiveChild(id);
      navigate("/trust");
    } finally {
      setPending(false);
    }
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold mb-4">{t("addChild.title")}</h1>

      <form onSubmit={onSubmit} className="space-y-4" aria-labelledby="add-child-form">
        <label className="block">
          <span className="block mb-1">{t("addChild.name")}</span>
          <input
            id="child-name"
            type="text"
            className="input w-full"
            placeholder="Anna"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="block mb-1">{t("addChild.photo")}</span>
          <input
            id="child-photo"
            type="file"
            accept="image/*"
            className="input w-full"
            onChange={onFileChange}
          />
        </label>

        <div className="mt-2">
          {preview ? (
            <img
              src={preview}
              alt="Selected photo preview"
              className="h-24 w-24 rounded-2xl object-cover border border-token"
            />
          ) : (
            <div className="h-24 w-24 rounded-2xl border border-dashed grid place-items-center text-sm opacity-60">
              Preview
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            to="/"
            className="btn focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
    </main>
  );
}
