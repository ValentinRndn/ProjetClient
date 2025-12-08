const levels = {
    info:  "\x1b[36mINFO\x1b[0m",      // Cyan
  warn:  "\x1b[33mWARN\x1b[0m",      // Yellow
  error: "\x1b[31mERROR\x1b[0m",     // Red
  debug: "\x1b[35mDEBUG\x1b[0m",     // Purple
};

const logger = {
  info: (msg, meta = {}) => {
    console.log(`[${levels.info}] ${msg}`, Object.keys(meta).length ? meta : "");
  },

  warn: (msg, meta = {}) => {
    console.warn(`[${levels.warn}] ${msg}`, Object.keys(meta).length ? meta : "");
  },

  error: (msg, meta = {}) => {
    console.error(`[${levels.error}] ${msg}`, Object.keys(meta).length ? meta : "");
  },

  debug: (msg, meta = {}) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[${levels.debug}] ${msg}`, Object.keys(meta).length ? meta : "");
    }
  }
};

export default logger;