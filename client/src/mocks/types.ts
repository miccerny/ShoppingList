export interface Item {
  id: number;
  name: string;
  quantity: number;
  done: boolean;
}

export interface ShoppingList {
  id: number;
  name: string;
  items: Item[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  lists: ShoppingList[];
}