const { app, request, database } = require("../config");
// test for visistor
describe("Routes", () => {
  it("should return 401 for /user/:id route", async () => {
    // Mock empty rows returned from the database
    const rows = [];

    // Mock the implementation of the database query method
    jest.spyOn(database, "query").mockImplementation(() => [rows]);

    const res = await request(app).get("/api/user/1");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 for /homestructure route", async () => {
    const res = await request(app).get(
      "/api/homestructure/?offset=0&limit=30&search"
    );
    expect(res.statusCode).toBe(200);
  });
});
