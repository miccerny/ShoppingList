export const mockData = {
  user: [
    {
      id: 1,
      email: "michal@example.com",
      password: "1234",
      list: [
        {
          id: 101,
          name: "Nákupní seznam",
          items: [
            { id: 1, name: "Mléko" },
            { id: 2, name: "Chléb" }
          ]
        },
        {
          id: 102,
          name: "Drogerie",
          items: [
            { id: 1, name: "Šampon" },
            { id: 2, name: "Mýdlo" }
          ]
        },
        {
          id: 103,
          name: "Nákup 20.10.",
          items: [
            { id: 5, name: "Rohlík", count: 1 },
            { id: 6, name: "Kečup", count: 2 }
          ]
        }
      ]
    }
  ]
};