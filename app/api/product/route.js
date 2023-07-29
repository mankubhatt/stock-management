import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request) {
    const uri = "mongodb://localhost:27017";

    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db("stock");
            const inventory = database.collection("inventory");

            const query = {};
            const products = await inventory.find(query).toArray();
            return NextResponse.json({ success: true, products });
        } finally {
            await client.close();
        }
    }
    return run().catch(console.dir);
}

export async function POST(request) {
    let body = await request.json()
    const uri = "mongodb://localhost:27017";

    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db("stock");
            const inventory = database.collection("inventory");
            const product = await inventory.insertOne(body)
            return NextResponse.json({ product });
        } finally {
            await client.close();
        }
    }
    return run().catch(console.dir);
}
