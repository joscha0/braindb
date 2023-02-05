type User = {
  $id: string;
  email: string;
  name: string;
};

type Page = {
  $id: string;
  name: string;
  content: string;
};

export type { User, Page };
