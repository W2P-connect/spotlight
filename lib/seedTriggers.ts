import postgres from "postgres";
import "dotenv/config";

const dbUrl = process.env.NEXT_PUBLIC_POSTGRES_PRISMA_URL;

if (!dbUrl) {
    throw new Error("Couldn't find db url");
}
const sql = postgres(dbUrl);

async function main() {
    await sql`
        create or replace function public.handle_new_user()
        returns trigger as $$
        begin
            insert into public.profile (id)
            values (new.id);
            return new;
        end;
        $$ language plpgsql security definer;
    `;

    await sql`
        create or replace trigger on_auth_user_created
            after insert on auth.users
            for each row execute procedure public.handle_new_user();
    `;

    await sql`
        create or replace function public.handle_user_delete()
        returns trigger as $$
        begin
          delete from auth.users where id = old.id;
          return old;
        end;
        $$ language plpgsql security definer;
    `;

    await sql`
        create or replace trigger on_profile_user_deleted
          after delete on public.profile
          for each row execute procedure public.handle_user_delete()
      `;

    await sql`
        create unique index if not exists unique_main_muscle_per_exercise
        on exercise_to_muscle (exercise_id)
        where is_main = true;
    `;


    console.log(
        "Finished adding triggers and functions for profile handling and other stuff."
    );
    process.exit();
}

main();
