import database from "infra/database.js";

test("Methods different than GET and POST should return 405 and don't leave any open connections to DB", async () => {
  const test_methods = ["PUT", "DELETE", "OPTIONS", "PATCH"];
  for (let i = 0; i < test_methods.length; i++) {
    let response_method = await fetch(
      "http://localhost:3000/api/v1/migrations",
      { method: test_methods[i] },
    );
    expect(response_method.status).toBe(405);
  }

  const opened_connections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DB],
  });

  expect(opened_connections.rows[0].count).toBe(1);
});
