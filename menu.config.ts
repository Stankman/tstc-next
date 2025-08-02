import { MainMenu } from "./src/lib/types";

// Define the menu items
export const mainMenu: MainMenu = {
    programs: {
      href: "/programs",
      label: "View Programs",
      variant: "outline",
    },
    apply: {
      href: "/apply",
      label: "Apply Now",
      variant: "red",
    },
  };

export const contentMenu = {
    categories: "/posts/categories",
    tags: "/posts/tags",
    authors: "/posts/authors",
};  