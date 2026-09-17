export const up = (pgm) => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    body: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("threads");
};
