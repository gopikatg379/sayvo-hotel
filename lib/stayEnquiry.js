export function guestDetails({ adults = "2", children = "0", childrenAges = "" }) {
  return [
    `Adults: ${adults}`,
    `Children: ${children}`,
    String(children) !== "0" && String(childrenAges).trim() && `Children’s ages: ${String(childrenAges).trim()}`,
  ].filter(Boolean).join("\n");
}
