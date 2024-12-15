export const QUERY = {
  GENERATE_NEW_ID: "SELECT gen_random_uuid() id",
  USER: {
    INSERT:
      "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)",
    FIND_BY_EMAIL: "SELECT * FROM users WHERE email = $1",
  },
};
