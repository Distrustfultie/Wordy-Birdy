import { useState } from "react";
import { LoaderIcon, MapPinIcon, ShuffleIcon } from "lucide-react";
import Avatar from "./Avatar";
import Select from "./ui/Select";
import { BIO_MAX } from "../constants";
import { randomAvatar } from "../lib/utilis";
import { languageOptions } from "../lib/languageOptions";

const LANGUAGE_OPTIONS = languageOptions();

const EMPTY = {
  fullName: "",
  bio: "",
  nativeLanguage: "",
  learningLanguage: "",
  location: "",
  profilePic: "",
};

/** Client-side checks mirroring the server's, so users get instant feedback. */
const validate = (form) => {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Please enter your name";
  if (!form.bio.trim()) errors.bio = "Tell others a little about yourself";
  if (form.bio.length > BIO_MAX) errors.bio = `Keep it under ${BIO_MAX} characters`;
  if (!form.nativeLanguage) errors.nativeLanguage = "Pick your native language";
  if (!form.learningLanguage) errors.learningLanguage = "Pick a language to learn";
  if (form.nativeLanguage && form.nativeLanguage === form.learningLanguage)
    errors.learningLanguage = "Choose a language different from your native one";
  if (!form.location.trim()) errors.location = "Where are you based?";
  return errors;
};

// A <label> forwards clicks to its control, which would re-toggle a custom
// Select when an option is clicked, so selects use a plain <div> wrapper.
const Field = ({ label, error, hint, children, as: Tag = "label" }) => (
  <Tag className="form-control w-full">
    <div className="label">
      <span className="label-text font-medium">{label}</span>
      {hint && <span className="label-text-alt text-base-content/50">{hint}</span>}
    </div>
    {children}
    {error && (
      <div className="label">
        <span className="label-text-alt text-error">{error}</span>
      </div>
    )}
  </Tag>
);

/** Profile fields shared by onboarding and settings. */
const ProfileForm = ({ initialValues, onSubmit, isPending, submitLabel = "Save" }) => {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...Object.fromEntries(Object.entries(initialValues || {}).filter(([k, v]) => k in EMPTY && v != null)),
  }));
  const [errors, setErrors] = useState({});

  const setValue = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };
  const set = (field) => (e) => setValue(field, e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-base-300/40 p-5">
        <Avatar src={form.profilePic} name={form.fullName} size="xl" ring />
        <div className="flex-1 text-center sm:text-left">
          <p className="font-semibold">Profile photo</p>
          <p className="text-sm text-base-content/60 mb-3">Pick a fun random avatar to stand out.</p>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => setForm((prev) => ({ ...prev, profilePic: randomAvatar() }))}
          >
            <ShuffleIcon className="size-4" /> Shuffle avatar
          </button>
        </div>
      </div>

      <Field label="Full name" error={errors.fullName}>
        <input
          type="text"
          className={`input input-bordered w-full ${errors.fullName ? "input-error" : ""}`}
          placeholder="Your full name"
          value={form.fullName}
          onChange={set("fullName")}
          maxLength={60}
        />
      </Field>

      <Field label="Bio" error={errors.bio} hint={`${form.bio.length}/${BIO_MAX}`}>
        <textarea
          className={`textarea textarea-bordered h-28 w-full leading-relaxed ${errors.bio ? "textarea-error" : ""}`}
          placeholder="What do you enjoy talking about? Why are you learning this language?"
          value={form.bio}
          onChange={set("bio")}
          maxLength={BIO_MAX}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Native language" error={errors.nativeLanguage} as="div">
          <Select
            ariaLabel="Native language"
            value={form.nativeLanguage}
            onChange={(v) => setValue("nativeLanguage", v)}
            options={LANGUAGE_OPTIONS}
            placeholder="Select your native language"
            error={Boolean(errors.nativeLanguage)}
            searchable
          />
        </Field>

        <Field label="Learning" error={errors.learningLanguage} as="div">
          <Select
            ariaLabel="Language you're learning"
            value={form.learningLanguage}
            onChange={(v) => setValue("learningLanguage", v)}
            options={LANGUAGE_OPTIONS}
            placeholder="Select a language to learn"
            error={Boolean(errors.learningLanguage)}
            searchable
          />
        </Field>
      </div>

      <Field label="Location" error={errors.location}>
        <div className="relative">
          <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-base-content/50" />
          <input
            type="text"
            className={`input input-bordered w-full pl-10 ${errors.location ? "input-error" : ""}`}
            placeholder="City, Country"
            value={form.location}
            onChange={set("location")}
            maxLength={80}
          />
        </div>
      </Field>

      <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
        {isPending && <LoaderIcon className="size-5 animate-spin" />}
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default ProfileForm;
