// Number of items displayed per page in the list
export const ITEM_LIMIT = 10;

// Footer titles
export const footerTitle: string[] = ["For Students", "Career Information"];
// Links for each footer title
export const FOOTER_LINKS: {
  title: string;
  value: { text: string; link: string }[];
}[] = [
  {
    title: "For Current Students and Faculty",
    value: [{ text: "Quick Links", link: "" }],
  },
  {
    title: "Career Information",
    value: [
      { text: "Undergraduate Career Information", link: "" },
      { text: "Graduate Career Information", link: "" },
    ],
  },
];

// Footer bottom links
export const FOOTER_FOOT_LINKS: { text: string; link: string }[] = [
  { text: "University", link: "" },
  { text: "Access", link: "" },
  { text: "Privacy Policy", link: "" },
];
