// const { session, MemorySessionStorage } = require('grammy');

// const storage = new MemorySessionStorage();
// const useSession = session({
//   initial: () => ({ creatingEntry: false }),
//   storage,
// });

// module.exports = { useSession };

const { session, MemorySessionStorage } = require('grammy');

const storage = new MemorySessionStorage();
const useSession = session({
  initial: () => ({ creatingEntry: false, awaitingCategory: false, category: null }),
  storage,
});

module.exports = { useSession };



