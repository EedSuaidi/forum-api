/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.addColumn("threads", {
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn("threads", "created_at");
};
