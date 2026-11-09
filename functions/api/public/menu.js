export async function onRequestGet({ env }) {
  if (!env.DB) return Response.json({ products: [] });
  const { results = [] } = await env.DB.prepare(
    `SELECT p.id,p.name,p.description,p.price_piasters,p.image_url,p.product_type,
            c.name AS category_name
     FROM products p LEFT JOIN categories c ON c.id=p.category_id
     WHERE p.is_active=1 ORDER BY p.sort_order,p.name`
  ).all();
  return Response.json({ products: results }, { headers: { "Cache-Control": "public, max-age=60" } });
}