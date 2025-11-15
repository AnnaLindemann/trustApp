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
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setPreview(null);
      setFileName(null);
      return;
    }

    const data = await fileToDataURL(f);
    setPreview(data);
    setFileName(f.name);
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
    <main className="min-h-full bg-bg flex justify-center px-4 py-6">
      <section className="card w-full max-w-xl px-6 py-6">
        <h1 className="mb-4 text-2xl font-semibold text-fg">
          {t("addChild.title")}
        </h1>

        <form
          onSubmit={onSubmit}
          className="space-y-4"
          aria-labelledby="add-child-form"
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
              to="/"
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
