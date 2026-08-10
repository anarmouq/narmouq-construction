/* Prints a string, turning **any words wrapped in double asterisks** into the
   brand gold — the way the reference site highlights key words inside its
   headings and paragraphs. Used by every section heading. */

export default function Accent({ text = '' }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        /* Odd indexes are the captured groups, i.e. the highlighted words. */
        i % 2 === 1 ? (
          <span className="accent" key={i}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}
