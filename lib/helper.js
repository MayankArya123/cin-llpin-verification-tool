function detailsOf(item) {
  if (item.type === "LLP") {
    return [
      { label: "Identifier Type", value: "LLPIN" },
      { label: "Format", value: "AAA-1234" },
      { label: "Length", value: `${item.input.length} Characters` },
    ];
  }
  return [
    { label: "Listing", value: item.listed },
    { label: "Company Type", value: item.companyType },
    { label: "State", value: item.state },
    { label: "Incorporation Year", value: item.year },
    { label: "ROC", value: item.roc },
  ].filter((item) => item.value);
}

function csvCell(v) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

export { detailsOf, csvCell };
