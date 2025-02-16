import { database } from "@database";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;
	const id = searchParams.get("id");

	if (id) {
		const shirt = await database
			.selectFrom("Shirt")
			.select(["id", "colors", "model", "photos", "prices"])
			.where("id", "=", id)
			.executeTakeFirst();

		return NextResponse.json(shirt);
	}

	const shirts = await database
		.selectFrom("Shirt as s")
		.select(["s.id", "s.colors", "s.model", "s.photos", "s.prices"])
		.leftJoin("ShirtOrder as so", "so.shirtId", "s.id")
		.orderBy(eb => eb.cast("s.createdAt", "date"), "desc")
		.orderBy(eb => eb.fn.count("so.id"), "desc")
		.orderBy("s.model", "asc")
		.execute();

	return NextResponse.json(
		shirts.reduce((obj, { id, ...shirt }) => {
			obj[id] = shirt;

			return obj;
		}, {} as ShirtListing),
	);
}
