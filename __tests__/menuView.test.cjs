describe("menu view utils", () => {
  const items = [
    { id: 1, name: "Americano", category: "drink" },
    { id: 2, name: "Latte", category: "drink" },
    { id: 3, name: "Cheesecake", category: "food" },
    { id: 4, name: "Vegan Salad", category: "vegan" },
  ];

  test("filter menu items by category", () => {
    const filtered = items.filter(i => i.category === "drink");
    expect(filtered.length).toBe(2);
    expect(filtered.map(i => i.name)).toEqual(["Americano", "Latte"]);
  });

  test("search menu items by keyword", () => {
    const keyword = "cake".toLowerCase();
    const searched = items.filter(i => i.name.toLowerCase().includes(keyword));
    expect(searched.length).toBe(1);
    expect(searched[0].name).toBe("Cheesecake");
  });

  test("search is case-insensitive", () => {
    const keyword = "LATTE".toLowerCase();
    const searched = items.filter(i => i.name.toLowerCase().includes(keyword));
    expect(searched.length).toBe(1);
    expect(searched[0].name).toBe("Latte");
  });
});