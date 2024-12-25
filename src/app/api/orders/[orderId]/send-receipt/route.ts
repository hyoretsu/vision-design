import { PutObjectCommand, S3Client, StorageClass } from "@aws-sdk/client-s3";
import { database } from "@database";
import { StatusCodes } from "http-status-codes";
import { type NextRequest, NextResponse } from "next/server";
import type { Params } from "../types";

export async function POST(req: NextRequest, { params }: DynamicSegments<Params>) {
	const { orderId } = await params;

	const order = await database.selectFrom("ShirtOrder").where("id", "=", orderId).executeTakeFirst();
	if (!order) {
		return new NextResponse("Pedido não encontrado", { status: StatusCodes.NOT_FOUND });
	}

	const receipt = (await req.formData()).get("receipt") as File | null;

	if (!receipt) {
		return new NextResponse("Nenhum comprovante enviado", { status: StatusCodes.BAD_REQUEST });
	}

	const s3Client = new S3Client({
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
		},
		region: "us-east-2",
	});

	const ContentType = receipt.type;
	const Key = `shirts/receipts/${orderId}/down.${ContentType.split("/")[1]}`;

	await Promise.all([
		s3Client.send(
			new PutObjectCommand({
				Bucket: "vision-design",
				Key,
				Body: Buffer.from(await receipt.arrayBuffer()),
				ContentType,
				StorageClass: StorageClass.GLACIER_IR,
			}),
		),
		database
			.updateTable("ShirtOrder")
			.set({
				payments: [true],
			})
			.where("id", "=", orderId)
			.execute(),
	]);

	return NextResponse.json(null);
}
