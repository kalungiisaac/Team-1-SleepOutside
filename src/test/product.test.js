const ProductList = require("../js/ProductList.cjs");

describe("ProductList basic operations", () => {
  let pl;

  beforeEach(() => {
    pl = new ProductList([
      { name: "Tent A", description: "Lightweight tent", price: 100 },
      { name: "Sleeping Bag B", description: "Warm and cozy", price: 80 },
      { name: "Backpack C", description: "Spacious pack", price: 120 },
    ]);
  });

  test("add and getById", () => {
    const added = pl.add({ name: "New Item", description: "Fresh", price: 50 });
    expect(added.id).toBeDefined();
    const fetched = pl.getById(added.id);
    expect(fetched).toMatchObject({ name: "New Item", price: 50 });
  });

  test("updateById and removeById", () => {
    const item = pl.add({ name: "Temp", price: 10 });
    const updated = pl.updateById(item.id, { price: 15, name: "Temp Updated" });
    expect(updated.price).toBe(15);
    expect(updated.name).toBe("Temp Updated");
    const removed = pl.removeById(item.id);
    expect(removed).toBe(true);
    expect(pl.getById(item.id)).toBeNull();
  });

  test("search by name and description", () => {
    const results1 = pl.search("tent");
    expect(results1.length).toBeGreaterThanOrEqual(1);
    const results2 = pl.search("warm");
    expect(results2.some((r) => r.name.includes("Sleeping"))).toBe(true);
  });

  test("sortBy numeric field and string field", () => {
    const sortedByPriceAsc = pl.sortBy("price", "asc");
    expect(sortedByPriceAsc[0].price).toBeLessThanOrEqual(sortedByPriceAsc[1].price);
    const sortedByNameDesc = pl.sortBy("name", "desc");
    expect(sortedByNameDesc[0].name >= sortedByNameDesc[1].name).toBe(true);
  });

  test("paginate returns correct page info", () => {
    const page = pl.paginate(1, 2);
    expect(page.page).toBe(1);
    expect(page.perPage).toBe(2);
    expect(page.data.length).toBe(2);
    expect(page.total).toBeGreaterThanOrEqual(3);
  });

  test("saveToJSONFile and fromJSONFile work correctly", async () => {
    const tmp = require('os').tmpdir();
    const path = require('path').join(tmp, `pl-test-${Date.now()}.json`);
    const list = new ProductList([{ name: 'X', price: 1 }]);
    await list.saveToJSONFile(path);
    const loaded = await ProductList.fromJSONFile(path);
    expect(Array.isArray(loaded.products)).toBe(true);
    expect(loaded.products[0].name).toBe('X');
  });

  test("paginate beyond range returns empty data and correct totals", () => {
    const p = pl.paginate(100, 10);
    expect(p.data.length).toBe(0);
    expect(p.totalPages).toBeGreaterThanOrEqual(1);
  });
});

