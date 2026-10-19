'use client';

import { useState, type ReactNode } from 'react';
import VideoFacade from '../site/VideoFacade';
import { GalleryModal } from '../site/InteractiveGallery';

/**
 * Renders the lightweight article format used by the admin editor:
 *   ## Heading   ### Subheading   > quote   - list item   ``` code ```
 *   ![caption](image-url)        @[video](mp4-or-youtube-or-vimeo-url)
 *   inline: **bold**  *italic*  `code`  [link](url)
 * Everything is rendered as React nodes (never raw HTML), so it is XSS-safe.
 */

const safeUrl = (u: string) => /^(https?:\/\/|\/(?!\/))/i.test(u.trim());

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const key = `${keyBase}-${i++}`;
    if (t.startsWith('**')) out.push(<strong key={key}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith('`')) out.push(<code key={key}>{t.slice(1, -1)}</code>);
    else if (t.startsWith('[')) {
      const [, label, url] = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(t)!;
      out.push(
        safeUrl(url) ? (
          <a key={key} href={url} target={url.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer">
            {label}
          </a>
        ) : (
          label
        )
      );
    } else out.push(<em key={key}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Video({ url }: { url: string }) {
  return <VideoFacade url={url} title="Embedded media" />;
}

export default function PostBody({ body }: { body: string }) {
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const nodes: ReactNode[] = [];
  let k = 0;
  let para: string[] = [];
  let list: string[] = [];
  let quote: string[] = [];

  const flush = () => {
    if (para.length) nodes.push(<p key={k++}>{inline(para.join(' '), `p${k}`)}</p>);
    if (list.length)
      nodes.push(
        <ul key={k++}>
          {list.map((l, i) => (
            <li key={i}>{inline(l, `l${k}-${i}`)}</li>
          ))}
        </ul>
      );
    if (quote.length) nodes.push(<blockquote key={k++}>{inline(quote.join(' '), `q${k}`)}</blockquote>);
    para = [];
    list = [];
    quote = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();

    if (t.startsWith('```')) {
      flush();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++]);
      nodes.push(
        <pre key={k++} tabIndex={0}>
          <code>{code.join('\n')}</code>
        </pre>
      );
      continue;
    }
    if (!t) {
      flush();
      continue;
    }
    const img = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(t);
    if (img && safeUrl(img[2])) {
      flush();
      const src = img[2];
      const alt = img[1] || 'Illustration';
      nodes.push(
        <figure
          key={k++}
          onClick={() => setZoomImg(src)}
          style={{ cursor: 'zoom-in' }}
          title="Click to view full size"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" decoding="async" />
          <figcaption>
            {alt} {alt ? '· ' : ''}🔍 Click to zoom
          </figcaption>
        </figure>
      );
      continue;
    }
    const vid = /^@\[[^\]]*\]\(([^)\s]+)\)$/.exec(t);
    if (vid && safeUrl(vid[1])) {
      flush();
      nodes.push(
        <div key={k++} className="post-video">
          <Video url={vid[1]} />
        </div>
      );
      continue;
    }
    if (t.startsWith('### ')) {
      flush();
      nodes.push(<h3 key={k++}>{inline(t.slice(4), `h${k}`)}</h3>);
    } else if (t.startsWith('## ')) {
      flush();
      nodes.push(<h2 key={k++}>{inline(t.slice(3), `h${k}`)}</h2>);
    } else if (t.startsWith('> ')) {
      if (para.length || list.length) flush();
      quote.push(t.slice(2));
    } else if (/^[-*] /.test(t)) {
      if (para.length || quote.length) flush();
      list.push(t.slice(2));
    } else {
      if (list.length || quote.length) flush();
      para.push(t);
    }
  }
  flush();
  return (
    <>
      <div className="post-body">{nodes}</div>
      {zoomImg && (
        <GalleryModal
          images={[zoomImg]}
          initialIndex={0}
          altPrefix="Zoomed View"
          onClose={() => setZoomImg(null)}
        />
      )}
    </>
  );
}
