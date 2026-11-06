/**
 * A small in-memory stand-in for the Firestore calls the models use, so the
 * data layer's rules can be tested without credentials. It doesn't model
 * security rules, indexes or real transaction conflicts.
 */

import type { Firestore } from "firebase-admin/firestore";

type Data = Record<string, unknown>;

export function installFakeFirestore() {
  const store = new Map<string, Data>();
  let nextId = 0;

  // Snapshots are fixed at read time, like Firestore's.
  const snapshot = (path: string) => {
    const data = store.get(path);
    const copy = data ? { ...data } : undefined;
    return {
      id: path.split("/").at(-1)!,
      ref: docRef(path),
      exists: data !== undefined,
      data: () => copy,
      get: (field: string) => copy?.[field],
    };
  };

  function docRef(path: string) {
    return {
    id: path.split("/").at(-1)!,
    path,
    get: async () => snapshot(path),
    set: async (data: Data, options?: { merge?: boolean }) => {
      store.set(path, options?.merge ? { ...store.get(path), ...data } : data);
    },
    update: async (data: Data) => {
      if (!store.has(path)) throw new Error(`NOT_FOUND: ${path}`);
      store.set(path, { ...store.get(path), ...data });
    },
    delete: async () => {
      store.delete(path);
    },
    collection: (name: string) => collection(`${path}/${name}`),
    };
  }

  const collection = (name: string) => {
    const depth = name.split("/").length + 1;
    const docs = () =>
      [...store.keys()].filter((key) => key.startsWith(`${name}/`) && key.split("/").length === depth);
    const query = (filter: (data: Data) => boolean, order?: { field: string; limit: number }) => ({
      get: async () => {
        let paths = docs().filter((key) => filter(store.get(key)!));
        if (order) {
          paths = paths
            .sort((a, b) => Number(store.get(b)![order.field]) - Number(store.get(a)![order.field]))
            .slice(0, order.limit);
        }
        return { docs: paths.map(snapshot) };
      },
    });
    const matches = (data: Data, field: string, op: string, value: unknown) =>
      op === ">=" ? String(data[field]) >= String(value) : op === ">" ? Number(data[field]) > Number(value) : data[field] === value;
    // Supports chained where() calls by combining the filters.
    const where = (previous: (data: Data) => boolean, field: string, op: string, value: unknown) => {
      const filter = (data: Data) => previous(data) && matches(data, field, op, value);
      return {
        ...query(filter),
        where: (f: string, o: string, v: unknown) => where(filter, f, o, v),
        count: () => ({
          get: async () => ({ data: () => ({ count: docs().filter((key) => filter(store.get(key)!)).length }) }),
        }),
      };
    };
    return {
      doc: (id: string = `auto${++nextId}`) => docRef(`${name}/${id}`),
      add: async (data: Data) => {
        const ref = docRef(`${name}/auto${++nextId}`);
        await ref.set(data);
        return ref;
      },
      where: (field: string, op: string, value: unknown) => where(() => true, field, op, value),
      orderBy: (field: string) => ({
        limit: (limit: number) => query(() => true, { field, limit }),
      }),
    };
  };

  const db = {
    collection,
    batch: () => {
      const ops: (() => Promise<void>)[] = [];
      return {
        set: (ref: ReturnType<typeof docRef>, data: Data) => void ops.push(() => ref.set(data)),
        update: (ref: ReturnType<typeof docRef>, data: Data) => void ops.push(() => ref.update(data)),
        delete: (ref: ReturnType<typeof docRef>) => void ops.push(() => ref.delete()),
        commit: async () => {
          for (const op of ops) await op();
        },
      };
    },
    getAll: async (...refs: { path: string }[]) => refs.map((r) => snapshot(r.path)),
    runTransaction: async <T>(fn: (tx: unknown) => Promise<T>): Promise<T> =>
      fn({
        get: (ref: ReturnType<typeof docRef>) => ref.get(),
        set: (ref: ReturnType<typeof docRef>, data: Data, options?: { merge?: boolean }) => ref.set(data, options),
        update: (ref: ReturnType<typeof docRef>, data: Data) => ref.update(data),
        delete: (ref: ReturnType<typeof docRef>) => ref.delete(),
      }),
  };

  global.firestoreDb = db as unknown as Firestore;
  return store;
}
