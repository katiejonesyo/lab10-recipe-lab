const fs = require("fs");
const pool = require("../lib/utils/pool");
const request = require("supertest");
const app = require("../lib/app");
const Log = require("../lib/models/log");
const Recipe = require("../lib/models/recipe");

describe("log-lab routes", () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync("./sql/setup.sql", "utf-8"));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a log', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          name: 'flour', 
          measurement: 'cup', 
          amount: 1
        }
      ]
    });
  
    return request(app)
      .post('/api/v1/logs')
      .send({
        dateOfEvent: 'January 16, 2020',
        notes: 'test',
        rating: 4,
        recipeId: recipe.id
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          dateOfEvent: expect.any(String),
          notes: 'test',
          rating: 4,
          recipeId: recipe.id
        });
      });
  });

  it("gets all logs", async () => {
    const recipe = await Recipe
    .insert({
      name: "cookies",
      directions: [
        "preheat oven to 375",
        "mix ingredients",
        "put dough on cookie sheet",
        "bake for 10 minutes",
      ]
    });

    const logs = await Promise.all(
      [
        {
          recipeId: recipe.id,
          dateOfEvent: "January 16th, 2020",
          notes: "These cookies were terrible.",
          rating: 0,
        },
        {
          recipeId: recipe.id,
          dateOfEvent: "January 16th, 2020",
          notes: "These cookies were terrible.",
          rating: 0,
        },
        {
          recipeId: recipe.id,
          dateOfEvent: 'January 16th, 2020',
          notes: 'These cookies were terrible.',
          rating: 0,
        },
      ].map(log => Log.insert(log))
    );

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it('gets a log by id', async () => {
    const recipe = await request(app)
      .post("/api/v1/recipes")
      .send({
        name: "cookies",
        directions: [
          "preheat oven to 375",
          "mix ingredients",
          "put dough on cookie sheet",
          "bake for 10 minutes",
        ],
      });

    const log = await Log.insert({
      recipeId: recipe.id,
      dateOfEvent: "January 16th, 2020",
      notes: "These cookies were terrible.",
      rating: 0,
    });

    return request(app)
      .get(`/api/v1/logs/${log.id}`)
      .then((res) => expect(res.body).toEqual(log));
  });

  it("updates a log by id", async () => {
    const recipe = await Recipe
    .insert({
      name: "cookies",
      directions: [
        "preheat oven to 375",
        "mix ingredients",
        "put dough on cookie sheet",
        "bake for 10 minutes",
      ],
    });

    const log = await Log
    .insert({
      recipeId: recipe.id,
      dateOfEvent: "January 16th, 2020",
      notes: "These cookies were terrible.",
      rating: 0,
    });

    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({
        recipeId: recipe.id,
        dateOfEvent: "February 27th, 2020",
        notes: "JK, these cookies were great!",
        rating: 5,
      })
      .then((res) =>
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            recipeId: recipe.id,
            dateOfEvent: "February 27th, 2020",
            notes: "JK, these cookies were great!",
            rating: 5,
          })
        )
      );
  });

  it("deletes a log by id", async () => {
    const recipe = await request(app)
      .post("/api/v1/recipes")
      .send({
        name: "cookies",
        directions: [
          "preheat oven to 375",
          "mix ingredients",
          "put dough on cookie sheet",
          "bake for 10 minutes",
        ],
      });

    const log = await request(app).post("/api/v1/logs").send({
      recipeId: recipe.id,
      dateOfEvent: "January 16th, 2020",
      notes: "These cookies were terrible.",
      rating: 0,
    });

    return request(app)
      .delete(`/api/v1/logs/${log.body.id}`)
      .then((res) => expect(res.body).toEqual(log.body));
  });
});


