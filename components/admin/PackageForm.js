"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { hotelCategories } from "@/lib/data";
import {
  Plus,
  X,
  Images,
  ImagePlus,
  Loader2,
} from "lucide-react";

const fields = [
  ["title", "Package title"],
  ["destination", "Location"],
  ["country", "Country"],
  ["category", "Category"],
  ["duration", "Duration"],
  ["days", "Number of days (including arrival & departure)", "number"],
  ["nights", "Number of nights", "number"],
  ["price", "Starting price (₹)", "number"],
  ["originalPrice", "Original price", "number"],
  ["seoTitle", "SEO title"],
  ["seoDescription", "SEO description"],
];

export default function PackageForm({ pkg }) {
  const router = useRouter();

  const galleryInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
const [galleryFiles, setGalleryFiles] = useState(() => (pkg?.images || []).map(image => ({ id: "existing-"+image.id, url: image.image, preview: image.image, file: null })));
const galleryFilesRef = useRef(galleryFiles);
galleryFilesRef.current = galleryFiles;
const [mainImageFile, setMainImageFile] = useState(null);

  // ---------------------------------------
  // ADD GALLERY IMAGES
  // ---------------------------------------

  function handleGalleryChange(e) {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    if (!selectedFiles.length) {
      return;
    }

    const imageFiles = selectedFiles.filter(
      (file) =>
        file.type.startsWith("image/")
    );

    const newFiles = imageFiles.map(
      (file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        preview:
          URL.createObjectURL(file),
      })
    );

    setGalleryFiles((prev) => [
      ...prev,
      ...newFiles,
    ]);

    // Allows selecting the same file again
    e.target.value = "";
  }

  // ---------------------------------------
  // REMOVE GALLERY IMAGE
  // ---------------------------------------

  function removeGalleryImage(id) {
    setGalleryFiles((prev) => {
      const item = prev.find(
        (image) => image.id === id
      );

      if (item?.file) {
        URL.revokeObjectURL(
          item.preview
        );
      }

      return prev.filter(
        (image) => image.id !== id
      );
    });
  }

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      galleryFilesRef.current.forEach(
        (item) => {
          if (item.file) URL.revokeObjectURL(item.preview);
        }
      );
    };
  }, []);

  // ---------------------------------------
  // SUBMIT
  // ---------------------------------------
  async function uploadImageToCloudinary(file) {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary configuration is missing."
    );
  }

  const uploadData = new FormData();

  uploadData.append("file", file);
  uploadData.append(
    "upload_preset",
    uploadPreset
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error(
      "Cloudinary upload error:",
      result
    );

    throw new Error(
      result?.error?.message ||
        "Image upload failed."
    );
  }

  return result.secure_url;
}

  async function submit(e) {
  e.preventDefault();

  const formElement = e.currentTarget;

  setLoading(true);

  try {
    const form =
      new FormData(formElement);

    // ---------------------------------------
    // REMOVE ACTUAL IMAGE FILE
    // ---------------------------------------

    form.delete("mainImage");
    form.delete("gallery");

    // ---------------------------------------
    // MAIN IMAGE
    // ---------------------------------------

    let mainImageUrl =
      pkg?.image || "";

    if (mainImageFile) {
      mainImageUrl =
        await uploadImageToCloudinary(
          mainImageFile
        );
    }

    // User may also manually provide URL
    const manualImageUrl = String(
      form.get("imageUrl") || ""
    ).trim();

    if (
      !mainImageFile &&
      manualImageUrl
    ) {
      mainImageUrl =
        manualImageUrl;
    }

    if (!mainImageUrl) {
      throw new Error(
        "Please select a main package image."
      );
    }

    form.set(
      "imageUrl",
      mainImageUrl
    );

    // ---------------------------------------
    // GALLERY IMAGES
    // ---------------------------------------

    const galleryUrls = [];

    for (const item of galleryFiles) {
      const uploadedUrl =
        item.url || await uploadImageToCloudinary(item.file);

      galleryUrls.push(
        uploadedUrl
      );
    }

    form.set(
      "galleryUrls",
      JSON.stringify(galleryUrls)
    );

    // ---------------------------------------
    // SAVE PACKAGE
    // ---------------------------------------

    const url = pkg
      ? `/api/admin/packages/${pkg.id}`
      : "/api/admin/packages";

    const res = await fetch(url, {
      method: pkg ? "PUT" : "POST",
      body: form,
    });

    let data = {};

    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      throw new Error(
        data.message ||
          "Could not save package."
      );
    }

    router.push(
      "/admin/packages"
    );

    router.refresh();
  } catch (error) {
    console.error(
      "Package save error:",
      error
    );

    alert(
      error.message ||
        "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <form
      onSubmit={submit}
      className="grid gap-6"
    >
      {/* -------------------------------- */}
      {/* HIDDEN SLUG                     */}
      {/* -------------------------------- */}

      {pkg?.slug && (
        <input
          type="hidden"
          name="slug"
          value={pkg.slug}
        />
      )}

      {/* -------------------------------- */}
      {/* PACKAGE DETAILS                  */}
      {/* -------------------------------- */}

      <section className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm md:p-7">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c89a40]">
            Basic Information
          </p>

          <h2 className="mt-2 text-xl font-black text-[#20211f]">
            Package Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter the main details
            guests will see on the
            website.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map(
            ([
              name,
              label,
              type = "text",
            ]) => (
              <label
                key={name}
                className="text-sm font-bold text-slate-700"
              >
                {label}

                {name === "category" ? (
                  <select name={name} defaultValue={pkg?.category || "Stay Packages"} required className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal">
                    {hotelCategories.map(category => <option key={category}>{category}</option>)}
                  </select>
                ) : (
                  <input name={name} type={type}
                    step={type === "number" ? (["days","nights"].includes(name) ? "1" : "0.01") : undefined}
                    min={type === "number" ? (name === "days" ? 1 : 0) : undefined}
                    required={!["originalPrice","seoTitle","seoDescription"].includes(name)}
                    defaultValue={pkg?.[name]?.toString?.() || ({destination:"Kochi",country:"India",duration:"1 Night",days:2,nights:1}[name] ?? "")}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#8a621b]"
                  />
                )}
              </label>
            )
          )}
        </div>
      </section>

      {/* -------------------------------- */}
      {/* PACKAGE INFORMATION              */}
      {/* -------------------------------- */}

      <section className="grid gap-5 rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm md:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c89a40]">
            Guest Information
          </p>

          <h2 className="mt-2 text-xl font-black text-[#20211f]">
            Package Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Explain what guests can
            expect from this package.
          </p>
        </div>

        {[
          [
            "shortDescription",
            "Short description",
            3,
          ],

          [
            "description",
            "Full description",
            6,
          ],

          [
            "highlights",
            "Package highlights (one per line)",
            5,
          ],

          [
            "inclusions",
            "What's included (one per line)",
            5,
          ],

          [
            "exclusions",
            "What's not included (one per line)",
            5,
          ],

          [
            "hotelDetails",
            "Hotel information",
            4,
          ],

          [
            "transportation",
            "Transportation",
            4,
          ],

          [
            "terms",
            "Terms & conditions",
            4,
          ],
        ].map(
          ([
            name,
            label,
            rows,
          ]) => (
            <label
              key={name}
              className="text-sm font-bold text-slate-700"
            >
              {label}

              <textarea
                name={name}
                rows={rows}
                required={
                  ![
                    "hotelDetails",
                    "transportation",
                    "terms",
                  ].includes(
                    name
                  )
                }
                defaultValue={
                  pkg?.[name] ||
                  ""
                }
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal leading-6 outline-none transition focus:border-[#20211f] focus:ring-2 focus:ring-[#20211f]/5"
              />
            </label>
          )
        )}
      </section>

      {/* -------------------------------- */}
      {/* IMAGES                           */}
      {/* -------------------------------- */}

      <section className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm md:p-7">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c89a40]">
            Visuals
          </p>

          <h2 className="mt-2 text-xl font-black text-[#20211f]">
            Package Images
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add an attractive cover image
            and multiple gallery photos.
          </p>
        </div>

        {/* MAIN IMAGE */}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">
            Main package image

            <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file =
      e.target.files?.[0];

    setMainImageFile(
      file || null
    );
  }}
  className="mt-2 block w-full rounded-xl border border-slate-200 p-3 font-normal"
/>

            <span className="mt-2 block text-xs font-normal text-slate-400">
              Recommended: landscape
              image with good quality.
            </span>
          </label>

          <label className="text-sm font-bold text-slate-700">
            Or main image URL

            <input
              name="imageUrl"
              defaultValue={
                pkg?.image ||
                ""
              }
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-[#20211f]"
            />
          </label>
        </div>

        {/* GALLERY */}

        <div className="mt-8 border-t border-slate-100 pt-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f5f0e7] text-[#20211f]">
                <Images
                  size={19}
                />
              </span>

              <div>
                <h3 className="text-sm font-black text-[#20211f]">
                  Gallery Images
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Upload several photos
                  showing the destination,
                  hotel and experiences.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                galleryInputRef.current?.click()
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#20211f] px-4 py-2.5 text-sm font-bold !text-white transition hover:bg-[#34352f]"
            >
              <Plus size={17} />

              Add Images
            </button>

            <input
              ref={
                galleryInputRef
              }
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleGalleryChange
              }
              className="hidden"
            />
          </div>

          {/* NO IMAGES */}

          {galleryFiles.length ===
            0 && (
            <button
              type="button"
              onClick={() =>
                galleryInputRef.current?.click()
              }
              className="mt-5 flex min-h-[180px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 transition hover:border-[#20211f]/40 hover:bg-[#f8f5ef]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#20211f] text-white">
                <ImagePlus
                  size={21}
                />
              </span>

              <span className="mt-3 text-sm font-bold text-[#20211f]">
                Add gallery photos
              </span>

              <span className="mt-1 text-xs text-slate-400">
                You can select
                multiple images at once
              </span>
            </button>
          )}

          {/* IMAGE PREVIEWS */}

          {galleryFiles.length >
            0 && (
            <>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  {
                    galleryFiles.length
                  }{" "}
                  image
                  {galleryFiles.length >
                  1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>

                <button
                  type="button"
                  onClick={() =>
                    galleryInputRef.current?.click()
                  }
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#20211f]"
                >
                  <Plus
                    size={16}
                  />

                  Add more
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {galleryFiles.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.id
                      }
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={
                            item.preview
                          }
                          alt={`Gallery image ${
                            index +
                            1
                          }`}
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

                        <span className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold text-white">
                          #
                          {index +
                            1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeGalleryImage(
                              item.id
                            )
                          }
                          aria-label="Remove image"
                          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white shadow-sm transition hover:bg-red-600"
                        >
                          <X
                            size={
                              15
                            }
                          />
                        </button>
                      </div>

                      <div className="px-3 py-2.5">
                        <p className="truncate text-xs font-medium text-slate-500">
                          {
                            item.file?.name || "Saved gallery photo"
                          }
                        </p>
                      </div>
                    </div>
                  )
                )}

                {/* ADD MORE TILE */}

                <button
                  type="button"
                  onClick={() =>
                    galleryInputRef.current?.click()
                  }
                  className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-[#20211f]/40 hover:bg-[#f8f5ef]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#20211f] text-white">
                    <Plus
                      size={18}
                    />
                  </span>

                  <span className="mt-2 text-xs font-bold text-[#20211f]">
                    Add more
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* STATUS */}

        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={
                pkg?.featured
              }
              className="h-4 w-4 accent-[#20211f]"
            />

            Featured package
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              name="active"
              type="checkbox"
              defaultChecked={
                pkg
                  ? pkg.active
                  : true
              }
              className="h-4 w-4 accent-[#20211f]"
            />

            Show on website
          </label>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* ITINERARY                        */}
      {/* -------------------------------- */}

      <section className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm md:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c89a40]">
          Stay & Tour Plan
        </p>

        <h2 className="mt-2 text-xl font-black text-[#20211f]">
          Itinerary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Optional: enter one day per line in
          this format:
        </p>

        <div className="mt-3 inline-block rounded-lg bg-[#f8f4e9] px-3 py-2 text-xs font-semibold text-[#20211f]">
          Day title | Description
        </div>

        <textarea
          name="itinerary"
          rows="8"
          defaultValue={(
            pkg?.itineraries ||
            []
          )
            .map(
              (item) =>
                `${item.title} | ${item.description}`
            )
            .join("\n")}
          className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 leading-6 outline-none transition focus:border-[#20211f]"
          placeholder={
            "Arrival | Check in at Stayvo Kochi from 12 PM\nExplore Kochi | Add your tour details\nDeparture | Check out by 11 AM"
          }
        />
      </section>

      {/* -------------------------------- */}
      {/* SUBMIT                           */}
      {/* -------------------------------- */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-[#20211f] px-7 py-3.5 font-bold !text-white transition hover:bg-[#34352f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <Loader2
              size={17}
              className="animate-spin"
            />
          )}

          {loading
            ? "Saving..."
            : pkg
              ? "Update Package"
              : "Create Package"}
        </button>
      </div>
    </form>
  );
}