export const QUERY = {
  GENERATE_NEW_ID: "SELECT UUID() uuid;",
  USER: {
    INSERT:
      'INSERT INTO users (id, name, email, password) VALUES (UUID_TO_BIN("?"), ?, ?, ?);',
    FIND_BY_EMAIL:
      "SELECT BIN_TO_UUID(id) id, name, email, password FROM users WHERE email = ?;",
  },
};
