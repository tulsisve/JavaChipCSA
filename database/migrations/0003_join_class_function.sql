-- ============================================================================
-- join_class(text) — lets a student join a class by code.
--
-- RLS on `classes` intentionally prevents students from SELECTing a class
-- row until they're already a member (so join codes can't be used to browse
-- other teachers' classes). That means the lookup-by-code step has to run
-- with elevated privilege. This function is the one narrow, audited escape
-- hatch: security definer, but it only ever inserts a membership row for
-- auth.uid() itself — it can't be used to add or view anyone else.
-- ============================================================================

create or replace function join_class(class_join_code text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  target_class_id uuid;
  already_member boolean;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to join a class.';
  end if;

  select id into target_class_id
  from classes
  where join_code = class_join_code
    and archived_at is null
    and (join_code_expires_at is null or join_code_expires_at > now());

  if target_class_id is null then
    raise exception 'That class code is invalid or has expired.';
  end if;

  select exists(
    select 1 from class_members
    where class_id = target_class_id and student_id = auth.uid()
  ) into already_member;

  if already_member then
    return target_class_id;
  end if;

  insert into class_members (class_id, student_id, status)
  values (target_class_id, auth.uid(), 'active');

  insert into audit_logs (actor_id, action, entity_type, entity_id)
  values (auth.uid(), 'class.joined', 'class', target_class_id);

  return target_class_id;
end;
$$;

revoke all on function join_class(text) from public;
grant execute on function join_class(text) to authenticated;
