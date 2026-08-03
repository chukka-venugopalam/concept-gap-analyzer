from repositories.base import BaseRepository

class UserRepository(BaseRepository):
    async def get_by_email(
        self, conn, email: str
    ) -> dict | None:
        return await self.fetch_one(conn, """
            SELECT id::text, email, display_name,
                   goal, onboarding_done,
                   created_at, last_active_at
            FROM users WHERE email = $1
        """, email)

    async def get_by_id(
        self, conn, user_id: str
    ) -> dict | None:
        return await self.fetch_one(conn, """
            SELECT id::text, email, display_name,
                   goal, onboarding_done
            FROM users WHERE id = $1::uuid
        """, user_id)

    async def create_with_id(
        self, conn,
        user_id: str,
        email: str,
        display_name: str | None = None
    ) -> dict:
        return await self.fetch_one(conn, """
            INSERT INTO users (id, email, display_name)
            VALUES ($1::uuid, $2, $3)
            ON CONFLICT (id) DO UPDATE
              SET email = EXCLUDED.email,
                  display_name = COALESCE(EXCLUDED.display_name, users.display_name),
                  last_active_at = NOW()
            RETURNING id::text, email,
                      display_name, goal,
                      onboarding_done,
                      (xmax = 0) AS is_new
        """, user_id, email, display_name or 'User')

    async def create(
        self, conn,
        email: str,
        display_name: str | None = None
    ) -> dict:
        return await self.fetch_one(conn, """
            INSERT INTO users (email, display_name)
            VALUES ($1, $2)
            ON CONFLICT (email) DO UPDATE
              SET last_active_at = NOW()
            RETURNING id::text, email,
                      display_name, goal,
                      onboarding_done,
                      (xmax = 0) AS is_new
        """, email, display_name or 'User')

    async def update_profile(
        self, conn, user_id: str,
        goal: str | None = None,
        onboarding_done: bool | None = None,
        display_name: str | None = None
    ) -> dict:
        updates = []
        values = []
        idx = 1

        if goal is not None:
            updates.append(f"goal = ${idx}")
            values.append(goal)
            idx += 1
        if onboarding_done is not None:
            updates.append(f"onboarding_done = ${idx}")
            values.append(onboarding_done)
            idx += 1
        if display_name is not None:
            updates.append(f"display_name = ${idx}")
            values.append(display_name)
            idx += 1

        values.append(user_id)
        return await self.fetch_one(conn, f"""
            UPDATE users SET {', '.join(updates)}
            WHERE id = ${idx}::uuid
            RETURNING id::text, email,
                      display_name, goal,
                      onboarding_done
        """, *values)

user_repo = UserRepository()
