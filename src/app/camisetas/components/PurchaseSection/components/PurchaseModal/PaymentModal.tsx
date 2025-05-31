"use client";
import {
	Button,
	Link,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tooltip,
} from "@nextui-org/react";
import { Clipboard } from "@phosphor-icons/react";
import { useApi } from "@utils";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { createStaticPix, hasError } from "pix-utils";
import { type ChangeEvent, useRef, useState } from "react";

export function PaymentModal({ isOpen, onClose, onOpenChange }: ModalProps) {
	const [orderId] = useQueryState("pedido");
	const [, setOrderStatus] = useQueryState("status");
	const [, setTermsAccepted] = useQueryState("termo_aceito");

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [qrCode, setQrCode] = useState<string>("");
	const [pixCopied, setPixCopied] = useState(false);

	const pix = createStaticPix({
		infoAdicional: `Pedido ${orderId} (camisa)`,
		merchantCity: "João Pessoa",
		merchantName: "Vision Design",
		pixKey: "vision.design.cc@gmail.com",
		transactionAmount: 51.99,
	});

	if (hasError(pix)) {
		throw new Error("Erro ao gerar pix.");
	}

	const brCode = pix.toBRCode();

	const generateQrCode = async () => {
		setQrCode(await pix.toImage());
	};

	generateQrCode();

	const submitReceipt = async (e: ChangeEvent<HTMLInputElement>) => {
		await useApi("POST", `/orders/${orderId}/send-receipt`, e.target.files![0]);

		setOrderStatus("successo");
		setTermsAccepted(null);
		onClose?.();
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<ModalHeader>Forma de pagamento</ModalHeader>

				<ModalBody className="w-full">
					<span>
						<Link href="https://pay.infinitepay.io/vision-design/VC1D-uex66ZqVz-51,99" isExternal>
							Cartão
						</Link>{" "}
						em até 12x (com juros da plataforma)
					</span>

					<span>Pix copia e cola:</span>

					<div className="relative flex items-start overflow-hidden rounded-lg bg-default-100 p-2">
						<span className="whitespace-nowrap">{brCode}</span>

						<div className="absolute top-0 right-0 flex aspect-square h-full items-center justify-center bg-default-100">
							<Tooltip content="Copiado!" isOpen={pixCopied}>
								<button
									type="button"
									onClick={() => {
										navigator.clipboard.writeText(brCode);
										setPixCopied(true);
										setTimeout(() => setPixCopied(false), 2000);
									}}
								>
									<Clipboard size={20} />
								</button>
							</Tooltip>
						</div>
					</div>

					<span>ou QR code:</span>

					<Image className="aspect-square w-full" src={qrCode} alt="" width={0} height={0} />
				</ModalBody>

				<ModalFooter className="w-full justify-center">
					<input
						className="hidden"
						ref={fileInputRef}
						type="file"
						accept=".png, .jpg, .jpeg, .pdf"
						onChange={submitReceipt}
					/>

					<Button
						className="flex h-full flex-col py-2 leading-3"
						type="submit"
						variant="bordered"
						onClick={() => fileInputRef.current?.click()}
					>
						<span>Enviar comprovante</span>
						<span>(imagem, PDF ou print)</span>
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
