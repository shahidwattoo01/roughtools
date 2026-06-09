// ============================================================
// ROUGHTOOLS â€” JsonLd Component
// Renders JSON-LD structured data scripts
// Usage: <JsonLd data={getToolPageSchema(tool)} />
// ============================================================

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | Record<string, any>[]
}

/**
 * Renders JSON-LD structured data as a <script> tag.
 * Supports single schema object or array of multiple schemas.
 */
export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data is safe
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  )
}