// 一覧での一画面ごとの表示数
export const ITEM_LIMIT = 10;

// フッターのタイトル
export const footerTitle: string[] = ["学生向け", "進路情報"];
// フッターのタイトルごとのリンク先
export const FOOTER_LINKS: {
  title: string;
  value: { text: string; link: string }[];
}[] = [
  {
    title: "在学生・教職員の方向け",
    value: [{ text: "クイックリンク", link: "" }],
  },
  {
    title: "進路情報",
    value: [
      { text: "学部の進路情報", link: "" },
      { text: "大学院の進路情報", link: "" },
    ],
  },
];

// フッターの下部リンク
export const FOOTER_FOOT_LINKS: { text: string; link: string }[] = [
  { text: "大学", link: "" },
  { text: "アクセス", link: "" },
  { text: "個人情報保護方針", link: "" },
];
