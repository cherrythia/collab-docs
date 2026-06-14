export const documentsRoutes = {
  "/api/documents": {
    GET: async () => {
      const docs = await Bun.sql`SELECT * FROM documents ORDER BY created_at DESC`;
      return Response.json(docs);
    },
    POST: async (req: Request) => {
      const { title } = await req.json();
      if (!title?.trim()) {
        return Response.json({ error: "Title required" }, { status: 400 });
      }
      const [doc] = await Bun.sql`
        INSERT INTO documents (title) VALUES (${title}) RETURNING *
      `;
      return Response.json(doc, { status: 201 });
    },
  },
};
