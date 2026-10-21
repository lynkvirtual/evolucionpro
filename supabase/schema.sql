-- FUTURO (no se usa en la demostración). Esquema inicial sugerido para cuando se contrate
-- la versión productiva de EVOLUCIÓN PRO con Supabase. Requiere aviso de privacidad aprobado
-- y revisión de políticas RLS antes de almacenar datos reales.
create table socios (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  nombre text not null,
  telefono text,
  membresia_tipo text,
  membresia_vence date,
  saldo_prepagado numeric(10,2) not null default 0,
  credito_disponible numeric(10,2) not null default 0,
  creado_en timestamptz not null default now()
);
create table productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text not null,
  precio numeric(10,2) not null,
  activo boolean not null default true
);
create table inventario (
  id uuid primary key default gen_random_uuid(),
  articulo text not null,
  unidad text not null,
  existencias integer not null default 0,
  minimo integer not null default 0
);
create table consumos (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid references socios(id),
  producto_id uuid references productos(id),
  modalidad text not null check (modalidad in ('directo','credito','saldo','membresia')),
  monto numeric(10,2) not null default 0,
  creado_en timestamptz not null default now()
);
create table visitas (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid references socios(id),
  creado_en timestamptz not null default now()
);
alter table socios enable row level security;
alter table consumos enable row level security;
alter table visitas enable row level security;
-- Las políticas (staff/admin y cada socio sobre sus propios datos) se definen en la fase contratada.
