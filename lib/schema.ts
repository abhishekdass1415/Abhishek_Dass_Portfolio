/**
 * Single source of truth for every editable content type.
 * - The API uses it to validate + whitelist incoming data.
 * - The admin panel uses it to render the edit forms.
 * Keep this file free of server-only imports.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'email'
  | 'month'
  | 'bool'
  | 'select'
  | 'select_custom'
  | 'tags'
  | 'lines'
  | 'image'
  | 'image_list'
  | 'article'
  | 'file';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  max?: number;
  options?: string[];
  suggestions?: string[];
  placeholder?: string;
  help?: string;
  half?: boolean;
  accept?: string;
}

export interface CollectionDef {
  name: string;
  label: string;
  singular: string;
  fields: FieldDef[];
  /** When true, items are sorted by their `order` field (manual ordering). */
  manualOrder: boolean;
}

export const CATEGORIES = ['Motorsport', 'AI / Data Science', 'Software', 'Aerospace', 'Startup', 'Marketing', 'Research'];
export const BLOG_TOPICS = ['Motorsport & F1', 'AI / Data Science', 'Software', 'Aerospace', 'Startup & Business', 'Books & Learning', 'Thoughts'];
export const SKILL_LEVELS = ['Learning', 'Working', 'Strong', 'Expert'];

export const PROFILE_FIELDS: FieldDef[] = [
  { key: 'name', label: 'Full name', type: 'text', required: true, max: 80, half: true },
  { key: 'location', label: 'Location', type: 'text', max: 120, half: true, placeholder: 'City, Country' },
  { key: 'title', label: 'Headline (hero title)', type: 'text', required: true, max: 200, help: 'Shown as the big title under your name.' },
  { key: 'tagline', label: 'Tagline', type: 'text', required: true, max: 240 },
  { key: 'roles', label: 'Rotating roles', type: 'lines', max: 80, help: 'One per line. They cycle in the hero.' },
  { key: 'availability', label: 'Availability badge', type: 'text', max: 120, placeholder: 'Open to F1 & motorsport data roles' },
  { key: 'photo', label: 'Profile photo', type: 'image' },
  { key: 'photoAlt', label: 'Photo description (alt text)', type: 'text', max: 160 },
];

export const ABOUT_FIELDS: FieldDef[] = [
  { key: 'about', label: 'About me', type: 'textarea', required: true, max: 6000, help: 'Separate paragraphs with a blank line.' },
  { key: 'facts', label: 'Quick facts', type: 'lines', max: 120, help: 'One per line, e.g. "Based in Nagpur, India".' },
];

export const CONTACT_FIELDS: FieldDef[] = [
  { key: 'email', label: 'Email', type: 'email', half: true },
  { key: 'phone', label: 'Phone (public)', type: 'text', max: 40, half: true, help: 'Leave empty to keep it private.' },
  { key: 'resume', label: 'Resume (PDF)', type: 'file', accept: 'application/pdf', help: 'Powers the "Download Resume" button.' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url', half: true },
  { key: 'github', label: 'GitHub URL', type: 'url', half: true },
  { key: 'twitter', label: 'Twitter / X URL', type: 'url', half: true },
  { key: 'instagram', label: 'Instagram URL', type: 'url', half: true },
];

export const SEO_FIELDS: FieldDef[] = [
  { key: 'seoTitle', label: 'Browser / Google title', type: 'text', max: 70 },
  { key: 'seoDescription', label: 'Google description', type: 'textarea', max: 200 },
  { key: 'footerNote', label: 'Footer note', type: 'text', max: 160 },
];

export const PROFILE_ALL_FIELDS: FieldDef[] = [...PROFILE_FIELDS, ...ABOUT_FIELDS, ...CONTACT_FIELDS, ...SEO_FIELDS];

export const COLLECTIONS: Record<string, CollectionDef> = {
  stats: {
    name: 'stats',
    label: 'Key stats',
    singular: 'stat',
    manualOrder: true,
    fields: [
      { key: 'value', label: 'Value', type: 'text', required: true, max: 30, half: true, placeholder: 'AIR 8' },
      { key: 'label', label: 'Label', type: 'text', required: true, max: 80, half: true, placeholder: 'Formula Bharat 2024' },
    ],
  },
  projects: {
    name: 'projects',
    label: 'Projects',
    singular: 'project',
    manualOrder: true,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, max: 120 },
      { key: 'category', label: 'Category', type: 'select', options: CATEGORIES, required: true, half: true },
      { key: 'year', label: 'Year', type: 'text', max: 20, half: true, placeholder: '2025' },
      { key: 'summary', label: 'Short description', type: 'textarea', required: true, max: 300, help: 'One or two sentences for the project card.' },
      { key: 'details', label: 'Full write-up & Story', type: 'article', max: 40000, help: 'Shown on the project page. You can format with Headings, bullets, images, and videos.' },
      { key: 'highlights', label: 'Highlights', type: 'lines', max: 300, help: 'One bullet per line.' },
      { key: 'tags', label: 'Tech / tags', type: 'tags', help: 'Comma separated.' },
      { key: 'image', label: 'Cover / Hero image', type: 'image' },
      { key: 'video', label: 'Video URL or Upload', type: 'url', help: 'YouTube, Vimeo or uploaded MP4/WebM video link.' },
      { key: 'images', label: 'Project Photos, Screenshots & Videos (Dashboards, CAD, Demos)', type: 'image_list', help: 'Upload screenshots, dashboards, work photos, or demo video clips.' },
      { key: 'demoLink', label: 'Live demo link', type: 'url', half: true },
      { key: 'codeLink', label: 'Code / repo link', type: 'url', half: true },
      { key: 'featured', label: 'Featured (large card)', type: 'bool' },
    ],
  },
  experience: {
    name: 'experience',
    label: 'Experience',
    singular: 'role',
    manualOrder: false,
    fields: [
      { key: 'role', label: 'Title', type: 'text', required: true, max: 120 },
      { key: 'company', label: 'Company / team', type: 'text', required: true, max: 120, half: true },
      { key: 'type', label: 'Type', type: 'select', options: ['Full-time', 'Internship', 'Team / Club', 'Volunteer', 'Freelance', 'Research'], half: true },
      { key: 'location', label: 'Location', type: 'text', max: 100 },
      { key: 'start', label: 'Start', type: 'month', required: true, half: true },
      { key: 'end', label: 'End', type: 'month', half: true },
      { key: 'current', label: 'I currently work here', type: 'bool' },
      { key: 'summary', label: 'One-line summary', type: 'text', max: 240 },
      { key: 'bullets', label: 'Key responsibilities', type: 'lines', max: 400, help: 'One bullet per line.' },
      { key: 'logo', label: 'Company Logo', type: 'image', half: true },
      { key: 'image', label: 'Featured Work / Project Image', type: 'image', half: true, help: 'Showcase photo for this role.' },
      { key: 'video', label: 'Video URL (optional)', type: 'url', help: 'Video demonstrating your work or project at this role.' },
      { key: 'details', label: 'Full experience write-up', type: 'article', max: 40000, help: 'Detailed overview of achievements, technical challenges solved, photos and media.' },
      { key: 'images', label: 'Experience Photos, Screenshots & Videos (Internship photos, dashboards, demos)', type: 'image_list', help: 'Upload photos, competition setups, or demo videos from your work.' },
      { key: 'website', label: 'Company / Team Website', type: 'url', half: true },
    ],
  },
  education: {
    name: 'education',
    label: 'Education',
    singular: 'school',
    manualOrder: false,
    fields: [
      { key: 'school', label: 'School / programme', type: 'text', required: true, max: 160 },
      { key: 'degree', label: 'Degree / course', type: 'text', required: true, max: 160 },
      { key: 'start', label: 'Start', type: 'month', half: true },
      { key: 'end', label: 'End (or expected)', type: 'month', half: true },
      { key: 'grade', label: 'Grade / CGPA', type: 'text', max: 60 },
      { key: 'details', label: 'Details', type: 'textarea', max: 600 },
      { key: 'logo', label: 'Logo / image', type: 'image' },
    ],
  },
  skills: {
    name: 'skills',
    label: 'Skills',
    singular: 'skill',
    manualOrder: true,
    fields: [
      { key: 'name', label: 'Skill / tool', type: 'text', required: true, max: 60, half: true },
      {
        key: 'category',
        label: 'Category',
        type: 'text',
        required: true,
        max: 60,
        half: true,
        suggestions: ['Programming', 'Data Science & AI', 'Data Engineering', 'Motorsport & Embedded', 'Web Development', 'Business & Marketing'],
      },
      { key: 'level', label: 'Depth', type: 'select', options: SKILL_LEVELS, help: 'Honest labels beat 10/10 scores.' },
    ],
  },
  goals: {
    name: 'goals',
    label: 'Goals',
    singular: 'goal',
    manualOrder: true,
    fields: [
      { key: 'title', label: 'Goal', type: 'text', required: true, max: 140 },
      { key: 'type', label: 'Horizon', type: 'select', options: ['Short-term', 'Long-term'], required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true, max: 400 },
    ],
  },
  achievements: {
    name: 'achievements',
    label: 'Achievements & certifications',
    singular: 'achievement',
    manualOrder: true,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, max: 160 },
      { key: 'kind', label: 'Kind', type: 'select', options: ['Achievement', 'Certification', 'Publication'], half: true },
      { key: 'year', label: 'Year', type: 'text', max: 20, half: true },
      { key: 'detail', label: 'Detail', type: 'text', max: 240 },
    ],
  },
  posts: {
    name: 'posts',
    label: 'Blog posts',
    singular: 'post',
    manualOrder: false,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, max: 140 },
      { key: 'topic', label: 'Topic', type: 'select_custom', options: BLOG_TOPICS, required: true, half: true, help: 'Pick from list or select "Other..." to type custom topic.' },
      { key: 'tags', label: 'Tags', type: 'tags', half: true, help: 'Comma separated.' },
      { key: 'excerpt', label: 'Summary', type: 'textarea', required: true, max: 300, help: 'Shown on the blog list and in Google.' },
      { key: 'cover', label: 'Cover image', type: 'image' },
      { key: 'body', label: 'Article', type: 'article', required: true, max: 60000 },
      { key: 'published', label: 'Published (untick to keep as a draft)', type: 'bool' },
    ],
  },
};

export const COLLECTION_NAMES = Object.keys(COLLECTIONS);

const isSafeUrl = (v: string) => /^(https?:\/\/|mailto:|\/)/i.test(v) && !/^\/\//.test(v);

export function sanitizeValue(f: FieldDef, raw: unknown): { ok: true; value: unknown } | { ok: false; error: string } {
  const label = f.label;
  switch (f.type) {
    case 'bool':
      return { ok: true, value: raw === true || raw === 'true' };
    case 'tags': {
      const arr = Array.isArray(raw) ? raw : String(raw ?? '').split(',');
      const value = arr.map((s) => String(s).trim().slice(0, 40)).filter(Boolean).slice(0, 20);
      if (f.required && !value.length) return { ok: false, error: `${label} is required` };
      return { ok: true, value };
    }
    case 'image_list':
    case 'lines': {
      const arr = Array.isArray(raw) ? raw : String(raw ?? '').split('\n');
      const value = arr.map((s) => String(s).trim().slice(0, f.max ?? 400)).filter(Boolean).slice(0, 30);
      if (f.required && !value.length) return { ok: false, error: `${label} is required` };
      return { ok: true, value };
    }
    default: {
      const s = String(raw ?? '').trim();
      const limit = f.max ?? (f.type === 'textarea' ? 6000 : 300);
      if (f.required && !s) return { ok: false, error: `${label} is required` };
      if (s.length > limit) return { ok: false, error: `${label} must be at most ${limit} characters` };
      if (!s) return { ok: true, value: '' };
      if ((f.type === 'url' || f.type === 'image' || f.type === 'file') && !isSafeUrl(s)) {
        return { ok: false, error: `${label} must be a valid http(s) URL or an uploaded file` };
      }
      if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return { ok: false, error: `${label} must be a valid email` };
      if (f.type === 'month' && !/^\d{4}-(0[1-9]|1[0-2])$/.test(s)) return { ok: false, error: `${label} must be a valid month` };
      if (f.type === 'select' && f.options && !f.options.includes(s)) return { ok: false, error: `${label} has an invalid value` };
      return { ok: true, value: s };
    }
  }
}

/** Validates + whitelists input. With `partial`, only supplied keys are checked. */
export function sanitize(
  fields: FieldDef[],
  input: Record<string, unknown>,
  partial = false
): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } {
  const data: Record<string, unknown> = {};
  for (const f of fields) {
    if (partial && !(f.key in input)) continue;
    const r = sanitizeValue(f, input[f.key]);
    if (!r.ok) return r;
    data[f.key] = r.value;
  }
  return { ok: true, data };
}
