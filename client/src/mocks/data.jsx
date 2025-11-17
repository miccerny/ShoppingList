export const mockData = {
  users: [
    {
      id: 1,
      email: 'michal@example.com',
      lists: [
        {
          id: 101,
          name: 'Groceries',
          items: [
            { id: 1001, name: 'Milk', quantity: 2, done: false },
            { id: 1002, name: 'Eggs', quantity: 10, done: true },
            { id: 1003, name: 'Bread', quantity: 1, done: false },
          ],
        },
      ],
    },
  ],
};