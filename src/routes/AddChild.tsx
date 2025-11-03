// src/routes/AddChild.tsx
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AddChild() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // локальный стейт — пока без стора детей
  const [name, setName] = useState("");
  const [, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // пока просто переходим на экран шкалы
    navigate("/trust");
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold mb-4">{t("addChild.title")}</h1>

      <form
        onSubmit={onSubmit}
        className="space-y-4"
        aria-labelledby="add-child-form"
      >
        {/* Имя */}
        <label className="block">
          <span className="block mb-1">{t("addChild.name")}</span>
          <input
            id="child-name"
            type="text"
            className="input w-full"
            placeholder="Anna"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        {/* Фото */}
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

        {/* Превью */}
        <div className="mt-2">
          {preview ? (
            <img
              src={preview}
              alt="Selected photo preview"
              className="h-24 w-24 rounded-xl object-cover border border-token"
            />
          ) : (
            <div className="h-24 w-24 rounded-xl border border-dashed grid place-items-center text-sm opacity-60">
              Preview
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-2">
          <Link
            to="/"
            className="btn focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {t("addChild.cancel")}
          </Link>

          <button
            type="submit"
            className="btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {t("addChild.save")}
          </button>
        </div>
      </form>
    </main>
  );
}
