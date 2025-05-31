"use client";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
} from "@nextui-org/react";
import { useApi } from "@utils";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export function TermsModal({ isOpen, onClose, onOpenChange }: ModalProps) {
	const [, setTermsAccepted] = useQueryState("termo_aceito");
	const [order] = useQueryState("pedido");

	const [term, setTerm] = useState({ id: "", text: "" });

	useEffect(() => {
		const execute = async () => {
			const currentTerm = await useApi<LegalTerms>("GET", "/terms");

			setTerm(currentTerm);
		};

		execute();
	}, []);

	const acceptTerms = async (acceptance: boolean) => {
		try {
			await useApi<string>("PATCH", `/orders/${order}`, {
				termAccepted: acceptance ? term.id : null,
			});

			if (acceptance) {
				setTermsAccepted("Sim");
			} else {
				onClose?.();
			}
		} catch {}
	};

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<ModalHeader>Informe seus dados</ModalHeader>

				<ModalBody className="w-full">
					<Textarea
						className="whitespace-pre-wrap normal-case"
						value={term.text.replaceAll("\\n", "\n\n")}
						isReadOnly
					/>

					<span className="text-center normal-case">
						Ao clicar em "Aceitar", o comprador reconhece e concorda com os termos estabelecidos acima.
					</span>
				</ModalBody>

				<ModalFooter className="w-full justify-center">
					<Button variant="bordered" onClick={() => acceptTerms(false)}>
						Recusar
					</Button>
					<Button variant="bordered" onClick={() => acceptTerms(true)}>
						Aceitar
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
