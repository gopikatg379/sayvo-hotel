const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const { syncAdminCredentials } = require("../lib/adminCredentials.cjs");

function databaseMock(initial = []) {
  const rows = new Map(initial.map(row => [row.email, { ...row }]));
  return {
    rows,
    admin: {
      async upsert({ where, update, create }) {
        const row = rows.has(where.email)
          ? { ...rows.get(where.email), ...update }
          : { id: rows.size + 1, ...create };
        rows.set(where.email, row);
        return { id: row.id, email: row.email };
      },
    },
  };
}

test("sync creates the configured admin with a normalized email and hashed password", async () => {
  const db = databaseMock();
  const result = await syncAdminCredentials(db, {
    ADMIN_SEED_EMAIL: " NewAdmin@Example.com ",
    ADMIN_SEED_PASSWORD: "NewTestPassword!",
  });
  assert.equal(result.email, "newadmin@example.com");
  assert.equal(result.password, undefined);
  const saved = db.rows.get(result.email);
  assert.notEqual(saved.password, "NewTestPassword!");
  assert.equal(await bcrypt.compare("NewTestPassword!", saved.password), true);
});

test("sync updates an existing password without changing the account identity or other accounts", async () => {
  const oldHash = await bcrypt.hash("OldTestPassword!", 4);
  const db = databaseMock([
    { id: 10, name: "Hotel Manager", email: "admin@example.com", password: oldHash },
    { id: 11, name: "Other Admin", email: "other@example.com", password: oldHash },
  ]);
  await syncAdminCredentials(db, { ADMIN_SEED_EMAIL: "admin@example.com", ADMIN_SEED_PASSWORD: "UpdatedTestPassword!" });
  const saved = db.rows.get("admin@example.com");
  assert.equal(saved.id, 10);
  assert.equal(saved.name, "Hotel Manager");
  assert.equal(await bcrypt.compare("UpdatedTestPassword!", saved.password), true);
  assert.equal(await bcrypt.compare("OldTestPassword!", saved.password), false);
  assert.equal(db.rows.get("other@example.com").password, oldHash);
});

test("sync rejects missing credentials before touching the database", async () => {
  let writes = 0;
  const db = { admin: { upsert: async () => { writes++; } } };
  await assert.rejects(() => syncAdminCredentials(db, {}), /ADMIN_SEED_EMAIL/);
  await assert.rejects(() => syncAdminCredentials(db, { ADMIN_SEED_EMAIL: "admin@example.com" }), /ADMIN_SEED_PASSWORD/);
  assert.equal(writes, 0);
});
