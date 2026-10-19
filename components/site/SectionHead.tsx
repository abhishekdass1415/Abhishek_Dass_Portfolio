export default function SectionHead({ index, title, kicker, id }: { index: string; title: string; kicker?: string; id: string }) {
  return (
    <div className="sec-head reveal">
      <span className="sec-idx mono" aria-hidden="true">
        {index}
      </span>
      <h2 id={id}>{title}</h2>
      <span className="sec-rule" aria-hidden="true" />
      {kicker && (
        <span className="sec-kicker mono" aria-hidden="true">
          {kicker}
        </span>
      )}
    </div>
  );
}
