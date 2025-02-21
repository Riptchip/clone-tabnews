import database from "infra/database.js";
import { version } from "react";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const versionQuery = await database.query("SHOW server_version;");

  const maxConnectionsQuery = await database.query("SHOW max_connections;");

  const connectionsQuery = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_database WHERE datname = $1;",
    values: [process.env.POSTGRES_DB],
  });

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: versionQuery.rows[0].server_version,
        max_connections: parseInt(maxConnectionsQuery.rows[0].max_connections),
        opened_connections: connectionsQuery.rows[0].count,
      },
    },
  });
}

export default status;
