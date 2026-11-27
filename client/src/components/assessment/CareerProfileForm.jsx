import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Calendar,
  GraduationCap,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { extractApiError } from '../../api/axiosClient.js';

export const EDUCATION_LEVEL_OPTIONS = [
  'No Formal Education',
  'High School / GED',
  'Vocational / Technical Diploma',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate / PhD',
];

const QUICK_FIELDS = [
  'General / Not Applicable',
  'Computer Science / IT',
  'Business & Management',
  'Engineering',
  'Healthcare / Nursing',
  'Arts, Media & Design',
  'Finance & Accounting',
  'Education',
  'Trades & Technical',
];

export default function CareerProfileForm({
  initialProfile = null,
  isEditing = false,
  onSave,
  onCancel,
}) {
  const [educationLevel, setEducationLevel] = useState(
    initialProfile?.educationLevel || ''
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(initialProfile?.fieldOfStudy || '');
  const [yearsOfExperience, setYearsOfExperience] = useState(
    initialProfile?.yearsOfExperience !== undefined && initialProfile?.yearsOfExperience !== null
      ? String(initialProfile.yearsOfExperience)
      : ''
  );
  const [age, setAge] = useState(
    initialProfile?.age !== undefined && initialProfile?.age !== null
      ? String(initialProfile.age)
      : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEducationChange = (nextEdu) => {
    setEducationLevel(nextEdu);
    if (
      (nextEdu === 'No Formal Education' || nextEdu === 'High School / GED') &&
      !fieldOfStudy.trim()
    ) {
      setFieldOfStudy('General / Not Applicable');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!EDUCATION_LEVEL_OPTIONS.includes(educationLevel)) {
      setErrorMsg('Please select your highest education level.');
      return;
    }

    const trimmedField = fieldOfStudy.trim();
    if (trimmedField.length < 2 || trimmedField.length > 100) {
      setErrorMsg('Please enter your field of study (or select "General / Not Applicable").');
      return;
    }

    const parsedExp = Number(yearsOfExperience);
    if (
      yearsOfExperience === '' ||
      !Number.isInteger(parsedExp) ||
      parsedExp < 0 ||
      parsedExp > 60
    ) {
      setErrorMsg('Years of experience must be a whole number between 0 and 60.');
      return;
    }

    const parsedAge = Number(age);
    if (age === '' || !Number.isInteger(parsedAge) || parsedAge < 14 || parsedAge > 100) {
      setErrorMsg('Please enter a valid age between 14 and 100.');
      return;
    }

    if (parsedExp > Math.max(0, parsedAge - 12)) {
      setErrorMsg('Years of experience seems too high for the entered age.');
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        educationLevel,
        fieldOfStudy: trimmedField,
        yearsOfExperience: parsedExp,
        age: parsedAge,
      });
      toast.success(
        isEditing
          ? 'Background profile updated!'
          : 'Profile saved! Starting your DISC assessment.'
      );
    } catch (err) {
      const msg = extractApiError(err, 'Could not save your background profile.');
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card relative overflow-hidden p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-500/20" />

        {/* Header */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-400/30 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isEditing ? 'Update Background Profile' : 'One-Time Setup Before Your First Test'}</span>
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Tell us about your background
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            We combine your DISC work style with your real qualifications so we only recommend
            careers and jobs you can realistically pursue—never unqualified or mismatched roles.
          </p>
        </div>

        {/* One-time notice */}
        {!isEditing && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-800 dark:text-emerald-200">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="leading-relaxed">
              <strong>Asked once only:</strong> Your background details are saved to your account
              and automatically reused on future assessments.
            </p>
          </div>
        )}

        {errorMsg && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-700 dark:text-rose-200"
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Education Level */}
          <div>
            <label
              htmlFor="profile-education"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Education Level <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <select
                id="profile-education"
                required
                value={educationLevel}
                onChange={(e) => handleEducationChange(e.target.value)}
                className="glass-input cursor-pointer pl-10"
              >
                <option value="" disabled className="bg-white text-slate-500 dark:bg-slate-900">
                  Select your highest education level
                </option>
                {EDUCATION_LEVEL_OPTIONS.map((level) => (
                  <option
                    key={level}
                    value={level}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field of Study */}
          <div>
            <label
              htmlFor="profile-field"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Field of Study <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <BookOpen className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="profile-field"
                type="text"
                required
                maxLength={100}
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="e.g. Computer Science, Business, Nursing, or General / Not Applicable"
                className="glass-input pl-10"
              />
            </div>

            {/* Quick-pick field chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK_FIELDS.map((chip) => {
                const isPicked = fieldOfStudy.trim().toLowerCase() === chip.toLowerCase();
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setFieldOfStudy(chip)}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
                      isPicked
                        ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-700 dark:border-indigo-400/50 dark:text-indigo-200'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:border-white/20 dark:hover:text-slate-200'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Years of Experience & Age */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="profile-experience"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Years of Work Experience <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="profile-experience"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={60}
                  step={1}
                  required
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  placeholder="0"
                  className="glass-input pl-10"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Enter 0 if you are a student or starting out.
              </p>
            </div>

            <div>
              <label
                htmlFor="profile-age"
                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Age <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="profile-age"
                  type="number"
                  inputMode="numeric"
                  min={14}
                  max={100}
                  step={1}
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 24"
                  className="glass-input pl-10"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Must be between 14 and 100.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
            {isEditing && onCancel && (
              <button
                type="button"
                disabled={submitting}
                onClick={onCancel}
                className="btn-ghost"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full px-6 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span>{isEditing ? 'Save & Continue to Test' : 'Save & Start Assessment'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
