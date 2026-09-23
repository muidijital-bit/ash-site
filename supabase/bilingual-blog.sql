-- ASH: Turkce ve Ingilizce blog surumlerini tek islemde yonetir.
-- Supabase > SQL Editor > New query alaninda bu dosyanin tamamini calistirin.
-- Mevcut yazilari degistirmez; yalnizca iki yonetim fonksiyonu ekler.
begin;

create or replace function public.ash_save_blog_pair(posts jsonb, target_status text)
returns setof public.ash_blog_posts
language plpgsql security invoker set search_path = '' as $$
declare
  item jsonb;
  pair_key text;
  current_post public.ash_blog_posts%rowtype;
  affected integer;
begin
  if auth.uid() is null or not exists (select 1 from public.ash_admins where user_id = auth.uid()) then
    raise exception 'ASH_FORBIDDEN' using errcode = '42501';
  end if;
  if target_status is null or target_status not in ('draft', 'published')
    or jsonb_typeof(posts) is distinct from 'array' then
    raise exception 'ASH_INVALID_INPUT' using errcode = '22023';
  end if;
  if jsonb_array_length(posts) not between 1 and 2
    or (target_status = 'published' and jsonb_array_length(posts) <> 2) then
    raise exception 'ASH_BOTH_LANGUAGES_REQUIRED' using errcode = '22023';
  end if;
  pair_key := posts->0->>'translation_key';
  if pair_key is null or pair_key !~ '^[a-z0-9-]{1,160}$'
    or exists (select 1 from jsonb_array_elements(posts) p where
      p->>'translation_key' is distinct from pair_key
      or coalesce(p->>'locale', '') not in ('tr', 'en')
      or coalesce(p->>'version', '') !~ '^[0-9]+$'
      or jsonb_typeof(p->'content') is distinct from 'object')
    or (select count(distinct p->>'locale') from jsonb_array_elements(posts) p) <> jsonb_array_length(posts) then
    raise exception 'ASH_INVALID_INPUT' using errcode = '22023';
  end if;

  -- Always lock in the same order. A stale editor cannot overwrite either language.
  perform 1 from public.ash_blog_posts where translation_key = pair_key order by locale for update;
  if exists (select 1 from public.ash_blog_posts b where b.translation_key = pair_key
    and not exists (select 1 from jsonb_array_elements(posts) p where p->>'id' = b.id::text)) then
    raise exception 'ASH_CONFLICT' using errcode = 'P0001';
  end if;

  for item in select value from jsonb_array_elements(posts) order by value->>'locale' loop
    if target_status = 'published' and (
      length(btrim(coalesce(item->'content'->>'title', ''))) < 3
      or btrim(coalesce(item->'content'->>'summary', '')) = ''
      or btrim(coalesce(item->'content'->>'metaDescription', '')) = ''
      or btrim(coalesce(item->'content'->>'category', '')) = ''
      or btrim(coalesce(item->'content'->>'cover', '')) = ''
      or btrim(coalesce(item->'content'->>'bodyMarkdown', '')) = ''
      or coalesce(item->'content'->>'date', '') !~ '^\d{4}-\d{2}-\d{2}$'
      or (item->'content'->>'date')::date > current_date
    ) then
      raise exception 'ASH_INCOMPLETE_TRANSLATION' using errcode = '22023';
    end if;
    if nullif(item->>'id', '') is not null then
      select * into current_post from public.ash_blog_posts where id = (item->>'id')::uuid;
      if not found or current_post.translation_key <> pair_key
        or current_post.locale <> item->>'locale'
        or current_post.slug <> item->'content'->>'slug'
        or current_post.version <> (item->>'version')::integer then
        raise exception 'ASH_CONFLICT' using errcode = 'P0001';
      end if;
      update public.ash_blog_posts set content = item->'content', status = target_status
      where id = current_post.id and version = current_post.version;
      get diagnostics affected = row_count;
      if affected <> 1 then raise exception 'ASH_CONFLICT' using errcode = 'P0001'; end if;
    else
      if (item->>'version')::integer <> 0 then
        raise exception 'ASH_CONFLICT' using errcode = 'P0001';
      end if;
      insert into public.ash_blog_posts(locale, translation_key, slug, content, status)
      values (item->>'locale', pair_key, item->'content'->>'slug', item->'content', target_status);
    end if;
  end loop;
  return query select * from public.ash_blog_posts where translation_key = pair_key order by locale;
end $$;

create or replace function public.ash_delete_blog_pair(posts jsonb)
returns void
language plpgsql security invoker set search_path = '' as $$
declare
  item jsonb;
  pair_key text;
  current_post public.ash_blog_posts%rowtype;
begin
  if auth.uid() is null or not exists (select 1 from public.ash_admins where user_id = auth.uid()) then
    raise exception 'ASH_FORBIDDEN' using errcode = '42501';
  end if;
  if jsonb_typeof(posts) is distinct from 'array' then
    raise exception 'ASH_INVALID_INPUT' using errcode = '22023';
  end if;
  if jsonb_array_length(posts) not between 1 and 2 then
    raise exception 'ASH_INVALID_INPUT' using errcode = '22023';
  end if;
  select translation_key into pair_key from public.ash_blog_posts where id = (posts->0->>'id')::uuid;
  if pair_key is null then raise exception 'ASH_CONFLICT' using errcode = 'P0001'; end if;
  perform 1 from public.ash_blog_posts where translation_key = pair_key order by locale for update;
  if (select count(*) from public.ash_blog_posts where translation_key = pair_key) <> jsonb_array_length(posts)
    or (select count(distinct p->>'id') from jsonb_array_elements(posts) p) <> jsonb_array_length(posts) then
    raise exception 'ASH_CONFLICT' using errcode = 'P0001';
  end if;
  for item in select value from jsonb_array_elements(posts) loop
    select * into current_post from public.ash_blog_posts where id = (item->>'id')::uuid;
    if not found or current_post.translation_key <> pair_key
      or current_post.version is distinct from (item->>'version')::integer then
      raise exception 'ASH_CONFLICT' using errcode = 'P0001';
    end if;
  end loop;
  delete from public.ash_blog_posts where translation_key = pair_key;
end $$;

revoke all on function public.ash_save_blog_pair(jsonb, text) from public, anon;
revoke all on function public.ash_delete_blog_pair(jsonb) from public, anon;
grant execute on function public.ash_save_blog_pair(jsonb, text) to authenticated;
grant execute on function public.ash_delete_blog_pair(jsonb) to authenticated;
notify pgrst, 'reload schema';
commit;

select 'Iki dilde blog yonetimi hazir' as sonuc;
