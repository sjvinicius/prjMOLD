SET local check_function_bodies = off;

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON TABLES FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON TABLES FROM "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON TABLES FROM "service_role";

CREATE SCHEMA "scmold";

CREATE EXTENSION "hypopg" SCHEMA "extensions";

CREATE EXTENSION "index_advisor" SCHEMA "extensions";

CREATE TABLE "scmold"."detailproduct" (
  "detailproduct_id" uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "label"            character varying,
  "datail"           character varying,
  "created_at"       timestamp with time zone    NOT NULL DEFAULT now(),
  "created_by"       character varying,
  "altered_at"       timestamp without time zone,
  "altered_by"       character varying,
  "status"           character varying           DEFAULT 'A'::character varying,
  "product_id"       uuid                        DEFAULT gen_random_uuid(),
  CONSTRAINT "detailproduct_pkey" PRIMARY KEY (detailproduct_id)
);

ALTER TABLE "scmold"."detailproduct"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "scmold"."order_item" (
  "order_item_id" uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "order_id"      uuid                        NOT NULL,
  "plant_id"      uuid                        NOT NULL,
  "base_id"       uuid                        NOT NULL,
  "plant_name"    text                        NOT NULL,
  "base_name"     text                        NOT NULL,
  "quantity"      integer                     NOT NULL,
  "unit_price"    numeric(10,2)               NOT NULL,
  "subtotal"      numeric(10,2)               NOT NULL,
  "created_at"    timestamp without time zone DEFAULT now(),
  "created_by"    text,
  "altered_at"    timestamp without time zone,
  "altered_by"    text,
  "status"        text                        DEFAULT 'A'::text,
  CONSTRAINT "order_item_pkey" PRIMARY KEY (order_item_id),
  CONSTRAINT "order_item_quantity_check" CHECK ((quantity > 0))
);

ALTER TABLE "scmold"."order_item"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "scmold"."order_status_history" (
  "order_status_history_id" uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "order_id"                uuid                     NOT NULL,
  "old_status"              text                     NOT NULL,
  "new_status"              text                     NOT NULL,
  "created_at"              timestamp with time zone NOT NULL DEFAULT now(),
  "created_by"              text                     NOT NULL,
  "altered_at"              timestamp with time zone NOT NULL DEFAULT now(),
  "altered_by"              text                     NOT NULL,
  "status"                  text                     DEFAULT 'A'::text,
  CONSTRAINT "order_status_history_pkey" PRIMARY KEY (order_status_history_id)
);

ALTER TABLE "scmold"."order_status_history"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "scmold"."order" (
  "order_id"                    uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "order_nsu"                   uuid                        NOT NULL,
  "customer_email"              text                        NOT NULL,
  "customer_cpf"                text,
  "cep"                         text                        NOT NULL,
  "address"                     text                        NOT NULL,
  "number"                      text                        NOT NULL,
  "district"                    text                        NOT NULL,
  "city"                        text                        NOT NULL,
  "complement"                  text,
  "subtotal"                    numeric(10,2)               NOT NULL,
  "shipping"                    numeric(10,2)               NOT NULL DEFAULT 0,
  "total"                       numeric(10,2)               NOT NULL,
  "statusorder"                 text                        NOT NULL DEFAULT 'PENDING_PAYMENT'::text,
  "payment_status"              text                        NOT NULL DEFAULT 'PENDING'::text,
  "infinitepay_invoice_slug"    text,
  "infinitepay_transaction_nsu" text,
  "infinitepay_receipt_url"     text,
  "infinitepay_capture_method"  text,
  "infinitepay_installments"    integer,
  "paid_amount"                 numeric(10,2),
  "created_at"                  timestamp without time zone NOT NULL,
  "created_by"                  character varying,
  "paid_at"                     timestamp without time zone,
  "shipped_at"                  timestamp without time zone,
  "delivered_at"                timestamp without time zone,
  "altered_at"                  timestamp without time zone,
  "altered_by"                  character varying,
  "user_id"                     uuid                        NOT NULL,
  "status"                      text                        NOT NULL DEFAULT 'A'::text,
  CONSTRAINT "order_order_nsu_key" UNIQUE (order_nsu),
  CONSTRAINT "order_pkey" PRIMARY KEY (order_id)
);

ALTER TABLE "scmold"."order"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "scmold"."product" (
  "product_id"   uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "name"         character varying,
  "price"        real,
  "imagepath"    character varying,
  "created_at"   timestamp without time zone NOT NULL DEFAULT now(),
  "created_by"   character varying,
  "alterated_at" timestamp without time zone,
  "alterated_by" character varying,
  "status"       character varying           DEFAULT 'A'::character varying,
  "type"         text,
  CONSTRAINT "product_pkey" PRIMARY KEY (product_id)
);

ALTER TABLE "scmold"."product"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
  RETURNS event_trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'pg_catalog'
  AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

ALTER TABLE "scmold"."order"
  ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE "scmold"."order_item"
  ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY (order_id) REFERENCES scmold."order"(order_id) ON DELETE CASCADE;

ALTER TABLE "scmold"."order_status_history"
  ADD CONSTRAINT "order_status_history_order_id_fkey" FOREIGN KEY (order_id) REFERENCES scmold."order"(order_id);

ALTER TABLE "scmold"."detailproduct"
  ADD CONSTRAINT "detailproduct_product_id_fkey" FOREIGN KEY (product_id) REFERENCES scmold.product(product_id);

CREATE POLICY "Public can read active product details" ON "scmold"."detailproduct"
  FOR SELECT
  TO "anon", "authenticated"
  USING (((status)::text = 'A'::text));

CREATE POLICY "Users can create orders" ON "scmold"."order"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "Users can view their own orders" ON "scmold"."order"
  FOR SELECT
  TO "authenticated"
  USING ((user_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "Users can insert items into their own orders" ON "scmold"."order_item"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((EXISTS ( SELECT 1
   FROM scmold."order"
  WHERE (("order".order_id = order_item.order_id) AND ("order".user_id = ( SELECT auth.uid() AS uid))))));

CREATE POLICY "Users can view their own order items" ON "scmold"."order_item"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM scmold."order" o
  WHERE ((o.order_id = order_item.order_id) AND (o.user_id = ( SELECT auth.uid() AS uid))))));

CREATE POLICY "Users can insert order status history" ON "scmold"."order_status_history"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((EXISTS ( SELECT 1
   FROM scmold."order" o
  WHERE ((o.order_id = o.order_id) AND (o.user_id = ( SELECT auth.uid() AS uid))))));

CREATE POLICY "Public can read active products" ON "scmold"."product"
  FOR SELECT
  TO "anon", "authenticated"
  USING (((status)::text = 'A'::text));

CREATE EVENT TRIGGER "ensure_rls"
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION "public"."rls_auto_enable"();

COMMENT ON EXTENSION "hypopg" IS 'Hypothetical indexes for PostgreSQL';

COMMENT ON EXTENSION "index_advisor" IS 'Query index advisor';

COMMENT ON TABLE "scmold"."product" IS 'storage the products can be combined';

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO PUBLIC, "postgres";

GRANT USAGE ON SCHEMA "scmold" TO "anon", "authenticated";

GRANT CREATE, USAGE ON SCHEMA "scmold" TO "postgres";

GRANT USAGE ON SCHEMA "scmold" TO "service_role";

REVOKE ALL ON TABLE "scmold"."detailproduct" FROM "anon";

GRANT SELECT ON TABLE "scmold"."detailproduct" TO "anon";

REVOKE ALL ON TABLE "scmold"."detailproduct" FROM "authenticated";

GRANT SELECT ON TABLE "scmold"."detailproduct" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "scmold"."detailproduct" TO "postgres";

REVOKE ALL ON TABLE "scmold"."detailproduct" FROM "service_role";

GRANT SELECT ON TABLE "scmold"."detailproduct" TO "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "scmold"."order" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "scmold"."order" TO "postgres";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "scmold"."order" TO "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "scmold"."order_item" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "scmold"."order_item" TO "postgres";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "scmold"."order_item" TO "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "scmold"."order_status_history" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "scmold"."order_status_history" TO "postgres";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "scmold"."order_status_history" TO "service_role";

REVOKE ALL ON TABLE "scmold"."product" FROM "anon";

GRANT SELECT ON TABLE "scmold"."product" TO "anon";

REVOKE ALL ON TABLE "scmold"."product" FROM "authenticated";

GRANT SELECT ON TABLE "scmold"."product" TO "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "scmold"."product" TO "postgres";

REVOKE ALL ON TABLE "scmold"."product" FROM "service_role";

GRANT SELECT ON TABLE "scmold"."product" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "scmold" GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "scmold" GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "scmold" GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO "service_role";

