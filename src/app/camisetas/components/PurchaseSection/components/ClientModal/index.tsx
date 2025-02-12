"use client";
import { useAppStore } from "@context/store";
import {
	Button,
	Form,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import { useApi } from "@utils";
import { parseAsString, useQueryStates } from "nuqs";

export function ClientModal({ isOpen, onOpenChange }: ModalProps) {
	const { client: storedClient, setClient } = useAppStore(state => state);

	const [{ baby_look: babyLook, cor: color, modelo: modelId, tamanho: size }, setParams] = useQueryStates({
		baby_look: parseAsString,
		cor: parseAsString,
		modelo: parseAsString,
		pedido: parseAsString,
		tamanho: parseAsString,
	});

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				<ModalHeader>Informe seus dados</ModalHeader>

				<Form
					onSubmit={async e => {
						e.preventDefault();

						const client = Object.fromEntries(new FormData(e.currentTarget)) as Client;
						setClient(client);

						const pedido = await useApi<string>("POST", "/orders", {
							babyLook: babyLook === "Sim",
							client,
							color,
							modelId,
							payment: 52,
							size,
						});

						setParams({
							baby_look: null,
							cor: null,
							modelo: null,
							pedido,
							tamanho: null,
						});
					}}
				>
					<ModalBody className="w-full [&_input]:normal-case">
						<Input label="Nome" name="name" defaultValue={storedClient.name} isRequired />
						<Input label="Email" name="email" type="email" defaultValue={storedClient.email} isRequired />
						<Input label="Celular" name="phoneNumber" defaultValue={storedClient.phoneNumber} isRequired />
					</ModalBody>

					<ModalFooter className="w-full justify-center">
						<Button type="submit" variant="bordered">
							Comprar
						</Button>
					</ModalFooter>
				</Form>
			</ModalContent>
		</Modal>
	);
}
