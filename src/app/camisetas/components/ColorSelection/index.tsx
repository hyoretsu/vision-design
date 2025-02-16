"use client";
import { ShirtSection } from "@components";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";

export interface ColorSelectionProps {
	models: ShirtListing;
}

const hexCodes = {
	accent: new Map<string, string>([
		["azul", "#7ed1ef"],
		["laranja", "#ffc300"],
		["rosa", "#ff69b4"],
		["verde", "#32cd32"],
	]),
	main: new Map<string, string>([
		["azul", "#1b2b8a"],
		["azul escuro", "#17519b"],
		["branco", "#ffffff"],
		["cinza", "#b1b1b1"],
		["preto", "#434343cc"],
		["roxo", "#9703d188"],
		["verde", "#1e3e25"],
		["vinho", "#730303"],
	]),
};

export function ColorSelection({ models }: ColorSelectionProps) {
	const [selectedModel] = useQueryState("modelo", parseAsString.withDefault(Object.keys(models)[0]));

	const { colors } = models[selectedModel];

	const [current, setColor] = useQueryState("cor");
	const [order] = useQueryState("pedido");

	if (!selectedModel) return null;

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!current && !order) {
			setColor(colors[0]);
		}
	}, [order, setColor]);

	return (
		<ShirtSection
			title="Cores"
			data={colors}
			tooltips={colors}
			columns={6}
			text={false}
			backgrounds={colors.map(color =>
				color.split(" e ").map((color, i) => {
					const lowercaseColor = color.toLowerCase();

					if (i === 1) {
						return (hexCodes.accent.get(lowercaseColor) ?? hexCodes.main.get(lowercaseColor))!;
					}

					return hexCodes.main.get(lowercaseColor)!;
				}),
			)}
			state={[current, setColor]}
		/>
	);
}
