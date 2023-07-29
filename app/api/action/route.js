import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";


export async function POST(request) {
    let body = await request.json()
    const uri = "mongodb://localhost:27017";

    const client = new MongoClient(uri);

    async function run() {
        try {
            
            let newQty = +body.initialQty

            if ("plus" == body.action){
                newQty += 1
            } else if("minus" == body.action){
                newQty -= 1
            } else{
                return NextResponse.json({ error: "invalid property"}, { status: 400})
            }
            const database = client.db("stock");
            const inventory = database.collection("inventory");
            
            const filter = {"slug": body.slug}
            const updateDoc = { $set: { "qty": String(newQty) } };
            await inventory.updateOne(filter, updateDoc)
            return NextResponse.json({ message: "updated successfully" });
        } finally {
            await client.close();
        }
    }
    return run().catch(console.dir);
}
