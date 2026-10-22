CREATE TABLE "attempts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"student_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"step" text NOT NULL,
	"answer" jsonb,
	"is_correct" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "case_settings" (
	"classroom_id" uuid NOT NULL,
	"case_id" text NOT NULL,
	"is_open" boolean DEFAULT true NOT NULL,
	"wokwi_url" text,
	CONSTRAINT "case_settings_classroom_id_case_id_pk" PRIMARY KEY("classroom_id","case_id")
);
--> statement-breakpoint
CREATE TABLE "classrooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"name" text NOT NULL,
	"join_code" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"solutions_visible" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "classrooms_join_code_unique" UNIQUE("join_code")
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "progress" (
	"student_id" uuid NOT NULL,
	"item_id" text NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"located" boolean DEFAULT false NOT NULL,
	"hints_used" integer DEFAULT 0 NOT NULL,
	"wrong_attempts" integer DEFAULT 0 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"solved_at" timestamp with time zone,
	CONSTRAINT "progress_student_id_item_id_pk" PRIMARY KEY("student_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"classroom_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"partner_name" text,
	"token_hash" text NOT NULL,
	"pin_encrypted" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "teacher_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teacher_sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teachers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_settings" ADD CONSTRAINT "case_settings_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_classroom_id_classrooms_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classrooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_sessions" ADD CONSTRAINT "teacher_sessions_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attempts_student_item_idx" ON "attempts" USING btree ("student_id","item_id");--> statement-breakpoint
CREATE INDEX "attempts_student_created_idx" ON "attempts" USING btree ("student_id","created_at");--> statement-breakpoint
CREATE INDEX "classrooms_teacher_idx" ON "classrooms" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "login_attempts_key_created_idx" ON "login_attempts" USING btree ("key","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "students_classroom_name_unique" ON "students" USING btree ("classroom_id",lower("display_name"));--> statement-breakpoint
CREATE INDEX "teacher_sessions_teacher_idx" ON "teacher_sessions" USING btree ("teacher_id");