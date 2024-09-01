const { app, request } = require("../config");
// test for visistor
describe("Routes", () => {
  it("should return 401 for /user/:id route", async () => {
    const res = await request(app).get("/api/user/1");
    expect(res.statusCode).toBe(401);
  });
  it("should return 401 for /homestructure/profile route", async () => {
    const res = await request(app).get("/api/homestructure/profile");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 for /homestructure route", async () => {
    const res = await request(app).get(
      "/api/homestructure/?offset=0&limit=30&search"
    );
    expect(res.statusCode).toBe(200);
  });
});
