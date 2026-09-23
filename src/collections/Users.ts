import type { CollectionConfig } from "payload";

/** Admin panel accounts. Distinct from Agents — see the note there. */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Settings",
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      admin: {
        description:
          "Only admins can delete listings or edit permits. Editors can draft and publish.",
      },
    },
  ],
  timestamps: true,
};
