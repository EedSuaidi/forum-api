/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable("replies", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    comment_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "comments(id)",
      onDelete: "CASCADE",
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    date: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    is_delete: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("replies");
};
