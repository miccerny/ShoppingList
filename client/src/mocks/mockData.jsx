/**
   * Catch-all handler.
   *
   * Behavior:
   * - Logs unmatched requests.
   * - Returns HTTP 418 to clearly signal missing mock implementation.
   *
   * Note:
   * This helps detect frontend requests that are not yet mocked.
   */
export const mockData = {
  /**
     * Mocked users collection.
     *
     * Note:
     * Even though the application currently supports a single user,
     * the structure is an array to reflect a realistic backend model
     * and allow future extension.
     */
  user: [
    {
      /**
      * User identifier.
      */
      id: 1,
       /**
       * User email used for authentication.
       */
      email: "michal@example.com",
       /**
       * Plain-text password used only for mock authentication.
       *
       * My note:
       * This is strictly for development purposes and never
       * represents real-world security practices.
       */
      password: "1234",
       /**
       * Lists owned by the user.
       *
       * Each list contains its own collection of items.
       */
      list: [
        {
          /**
           * Unique list identifier.
           */
          id: 101,
          /**
           * Display name of the list.
           */
          name: "Nákupní seznam",
           /**
           * Items belonging to this list.
           *
           * Note:
           * Item structure matches the DTO shape used by the frontend.
           */
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
            /**
             * Example of item with quantity field.
             *
             * Note:
             * This reflects real application data where
             * some items include additional attributes.
             */
            { id: 5, name: "Rohlík", count: 1 },
            { id: 6, name: "Kečup", count: 2 }
          ]
        }
      ]
    }
  ]
};