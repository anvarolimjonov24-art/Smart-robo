// PURE MOCK PRISMA - NO IMPORTS FROM @prisma/client
// Use this to bypass any environment issues that cause hangs during module load.
const createMock = () => {
    const handler: ProxyHandler<any> = {
        get: (target, prop) => {
            if (prop === 'constructor') return Object;
            if (prop === '$connect' || prop === '$disconnect') return () => Promise.resolve();
            if (prop === '$on') return () => { };

            // Return a function that returns a mock object for any model-like access
            const modelMock = {
                count: async () => 10,
                aggregate: async () => ({ _sum: { totalAmount: 1500000 } }),
                findMany: async () => [],
                findFirst: async () => ({ id: 'mock-id', name: 'Mock Store', telegramId: '123456', orderNumber: 1001, customer: { telegramId: '123456' } }),
                findUnique: async () => ({ id: 'mock-id', name: 'Mock Object', telegramId: '123456', orderNumber: 1002, customer: { telegramId: '123456' } }),
                create: async (args: any) => ({ id: 'mock-id', ...args.data, customer: { telegramId: '123456' } }),
                update: async (args: any) => ({ id: 'mock-id', ...args.data, customer: { telegramId: '123456' } }),
                delete: async () => ({ id: 'mock-id' }),
                upsert: async (args: any) => ({ id: 'mock-id', ...args.create, customer: { telegramId: '123456' } }),
                include: () => modelMock,
                where: () => modelMock,
                orderBy: () => modelMock,
                take: () => modelMock,
                skip: () => modelMock,
            };
            return modelMock;
        }
    };
    return new Proxy({}, handler);
};

export const prisma = createMock();

console.log("🛠 [Smart-Robo] Offline Mock Layer Active");
