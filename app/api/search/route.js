import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')

    const uri = "mongodb://localhost:27017";

    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db("stock");
            const inventory = database.collection("inventory");

            const products = await inventory.aggregate([
                {
                    $match: {
                        $or: [
                            { slug: { $regex: query, $options: "i" } },
                            { qty: { $regex: query, $options: "i" } },
                            { price: { $regex: query, $options: "i" } }
                        ]
                    }
                }
            ]).toArray();

            return NextResponse.json({ success: true, products });
        } finally {
            await client.close();
        }
    }

    return run().catch(console.dir);
}
