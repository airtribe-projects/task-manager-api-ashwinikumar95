const seedTasks = [
  {
    id: 1,
    title: 'Set up environment',
    description: 'Install Node.js, npm, and git',
    completed: true,
    priority: 'medium',
    createdAt: new Date('2020-01-01T00:00:00.000Z').toISOString(),
  },
];

let tasks = seedTasks.map((t) => ({ ...t }));

function key(id) {
  return String(id);
}

function clone(doc) {
  return { ...doc };
}

class Task {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const k = key(this.id);
    const idx = tasks.findIndex((t) => key(t.id) === k);
    if (idx === -1) {
      tasks.push(clone(this));
    } else {
      tasks[idx] = { ...tasks[idx], ...clone(this) };
    }
    return this;
  }

  static async find() {
    return tasks.map(clone);
  }

  static async findById(id) {
    const doc = tasks.find((t) => key(t.id) === key(id));
    return doc ? clone(doc) : null;
  }

  static async findByIdAndUpdate(id, patch, _options) {
    const idx = tasks.findIndex((t) => key(t.id) === key(id));
    if (idx === -1) return null;
    const merged = { ...tasks[idx] };
    for (const [k, v] of Object.entries(patch)) {
      if (v !== undefined) merged[k] = v;
    }
    tasks[idx] = merged;
    return clone(tasks[idx]);
  }

  static async findByIdAndDelete(id) {
    const idx = tasks.findIndex((t) => key(t.id) === key(id));
    if (idx === -1) return null;
    const [removed] = tasks.splice(idx, 1);
    return clone(removed);
  }
}

module.exports = Task;
