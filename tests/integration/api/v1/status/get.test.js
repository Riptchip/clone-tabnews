test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.dependencies.database).toBeDefined();
  const databaseBody = responseBody.dependencies.database;

  expect(responseBody.updated_at).toBeDefined();
  expect(databaseBody.version).toBeDefined();
  expect(databaseBody.max_connections).toBeDefined();
  expect(databaseBody.opened_connections).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(typeof databaseBody.version).toBe("string");
  expect(databaseBody.version).toBe("16.3");

  expect(typeof databaseBody.max_connections).toBe("number");
  expect(databaseBody.max_connections).toBeTruthy();
  expect(databaseBody.max_connections).toBe(100);

  expect(typeof databaseBody.opened_connections).toBe("number");
  expect(databaseBody.opened_connections).toBeTruthy();
  expect(databaseBody.opened_connections).toBe(1);
});
