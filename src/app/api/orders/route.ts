import { database } from "@database";
import { StatusCodes } from "http-status-codes";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { babyLook, client: clientData, color, modelId: shirtId, payment, size } = await req.json();

	const shirt = await database.selectFrom("Shirt").where("id", "=", shirtId).execute();
	if (!shirt) {
		return new Response("Essa camisa não existe.", { status: StatusCodes.NOT_FOUND });
	}

	let client = await database
		.selectFrom("Client")
		.where("email", "=", clientData.email)
		.select("id")
		.executeTakeFirst();
	if (!client) {
		client = await database.insertInto("Client").values(clientData).returning("id").executeTakeFirst();
	}

	const order = await database
		.insertInto("ShirtOrder")
		.values({
			babyLook,
			color,
			downPayment: payment,
			clientId: client!.id,
			quantity: 1,
			shirtId,
			size,
		})
		.returning("id")
		.executeTakeFirstOrThrow();

	return NextResponse.json(order.id);
}
