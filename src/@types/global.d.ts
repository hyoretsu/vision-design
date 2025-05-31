type BooleanString = "true" | "false";
type ValuesOf<T extends any[]> = T[number];

interface ModalProps {
	isOpen: boolean;
	onClose?: () => void;
	onOpenChange: () => void;
}

interface DynamicSegments<T> {
	params: Promise<T>;
}

interface PlausibleOpts {
	/** A function that is called once the event is logged successfully. */
	callback?: (...args: any[]) => unknown;
	/** An object with custom properties. */
	props?: Record<string, any>;
	/** An object with revenue tracking fields. */
	revenue?: never;
}

interface Window {
	gtag: (...args: any) => void;
	plausible: (eventName: string, opts?: PlausibleOpts) => void;
}
