-- ============================================================
-- Meridian — Örnek veri (opsiyonel)
-- schema.sql çalıştırıldıktan sonra çalıştırabilirsiniz.
-- ============================================================

insert into public.categories (name, slug) values
  ('Elbise', 'elbise'),
  ('Üst Giyim', 'ust-giyim'),
  ('Dış Giyim', 'dis-giyim'),
  ('Aksesuar', 'aksesuar')
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, price, stock, description, images)
select c.id, p.name, p.slug, p.price, p.stock, p.description, p.images
from (values
  ('elbise', 'Ipek Midi Elbise', 'ipek-midi-elbise', 4200.00, 8, '%100 ipek, biye detaylı yaka, mevsimsiz kesim.', array[]::text[]),
  ('ust-giyim', 'Keten Gömlek', 'keten-gomlek', 2100.00, 15, 'Ağır keten, oversize kesim, sedef düğme.', array[]::text[]),
  ('dis-giyim', 'Yün Palto', 'yun-palto', 6800.00, 5, '%80 yün karışımlı, çift düğmeli, diz altı boy.', array[]::text[]),
  ('aksesuar', 'Deri Kemer', 'deri-kemer', 1450.00, 20, 'Tam tane deri, pirinç toka.', array[]::text[]),
  ('ust-giyim', 'Triko Kazak', 'triko-kazak', 2650.00, 12, 'Merserize pamuk, bisiklet yaka.', array[]::text[]),
  ('elbise', 'Keten Gömlek Elbise', 'keten-gomlek-elbise', 3100.00, 10, 'Keten karışım, kemerli, diz altı boy.', array[]::text[])
) as p(cat_slug, name, slug, price, stock, description, images)
join public.categories c on c.slug = p.cat_slug
on conflict (slug) do nothing;
