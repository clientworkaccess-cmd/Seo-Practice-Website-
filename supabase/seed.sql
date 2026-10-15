-- Optional: a couple of dummy posts so the deployed site isn't empty.
insert into public.posts (slug, title, meta_description, body_md, status)
values
('hello-loop', 'Hello from the content loop',
 'First dummy post, proving the publish path works end to end.',
 e'This is a **dummy post**. If you can read it on the deployed site, the Supabase read path works.\n\n## What this proves\n\n- The posts table is readable with the anon key\n- Markdown renders\n- The page has a canonical tag and Article schema\n',
 'published'),
('second-test', 'Second test post',
 'A second post so the list view has more than one row.',
 e'Another dummy post for testing list ordering and the sitemap.\n\n### Notes\n\nDelete these any time.\n',
 'published')
on conflict (slug) do nothing;
