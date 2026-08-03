/**
 * Renders a JSON-LD structured-data block. The payload is serialized with
 * `<` escaped so user-influenced strings can never break out of the script
 * element.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
