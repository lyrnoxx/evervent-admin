process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1d";
process.env.AUTH_COOKIE_NAME = "token";

const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../models/User", () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

const User = require("../models/User");
const app = require("../app");

const makeToken = (userId, role) => jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

const makeUser = ({ id, role = "User", name = "John", email = "john@example.com" }) => ({
  _id: id,
  name,
  email,
  role,
  toSafeObject() {
    return {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  },
});

describe("Auth and RBAC routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects register when required fields are missing", async () => {
    const response = await request(app).post("/api/auth/register").send({ email: "a@a.com" });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("returns 401 on protected route without cookie", async () => {
    const response = await request(app).get("/api/users");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("returns 403 when User role accesses admin-only route", async () => {
    const token = makeToken("u-1", "User");
    User.findById.mockResolvedValue(makeUser({ id: "u-1", role: "User" }));

    const response = await request(app).get("/api/users").set("Cookie", [`token=${token}`]);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it("allows Admin role to fetch users", async () => {
    const token = makeToken("a-1", "Admin");
    User.findById.mockResolvedValue(makeUser({ id: "a-1", role: "Admin", email: "admin@example.com" }));

    const users = [
      makeUser({ id: "u-1", role: "User", name: "User One", email: "u1@example.com" }),
      makeUser({ id: "u-2", role: "Admin", name: "Admin Two", email: "a2@example.com" }),
    ];

    User.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(users),
    });

    const response = await request(app).get("/api/users").set("Cookie", [`token=${token}`]);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.users).toHaveLength(2);
  });
});
