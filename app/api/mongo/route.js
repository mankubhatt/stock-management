import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request) {
  const uri = "mongodb://localhost:27017";

  const client = new MongoClient(uri);

  async function run() {
    try {
      const database = client.db("wimydb");
      const movies = database.collection("users");

      // Query for a movie that has the title 'Back to the Future'
      const query = {};
      const movie = await movies.find(query).toArray();

      console.log(movie);
      return NextResponse.json({ hi: "mayank", movie});
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  return run().catch(console.dir);
}
