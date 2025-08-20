import { type Position } from "smart-offer-types";
import { SquarePen, Delete } from "lucide-react";

type PositionErrors = {
    label?: string;
    quantity?: string;
    unit?: string;
    unitPrice?: string;
};

type Props = {
    newPosition: Position;
    positions: Position[];
    onChange: <K extends keyof Position>(field: K, value: Position[K]) => void;
    onSave: () => void;
    onCancelEdit: () => void;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
    editIndex: number | null;
    positionErrors: PositionErrors;
    formErrors: { positions?: string };
    labelRef: React.RefObject<HTMLInputElement | null>;
    calculateTotal: () => number;
};

const PositionsStep = ({
    newPosition,
    positions,
    onChange,
    onSave,
    onCancelEdit,
    onEdit,
    onDelete,
    editIndex,
    positionErrors,
    formErrors,
    labelRef,
    calculateTotal,
}: Props) => {
    return (
        <section className="space-y-4">
            <div className="border-t pt-4 mt-4 space-y-4">
                <h3 className="font-semibold text-lg mb-2">Neue Position</h3>
                {formErrors.positions && (
                    <p className="text-sm text-red-500 mb-2">
                        {formErrors.positions}
                    </p>
                )}

                {/* Bezeichnung */}
                <div className="flex flex-col">
                    <label htmlFor="label" className="font-medium">
                        Bezeichnung
                    </label>
                    <input
                        ref={labelRef}
                        id="label"
                        type="text"
                        placeholder="Bezeichnung"
                        className={`p-2 rounded border ${
                            positionErrors.label
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        value={newPosition.label}
                        onChange={(e) => onChange("label", e.target.value)}
                    />
                    {positionErrors.label && (
                        <p className="text-sm text-red-500 mt-1">
                            {positionErrors.label}
                        </p>
                    )}
                </div>

                {/* Menge */}
                <div className="flex flex-col">
                    <label htmlFor="quantity" className="font-medium">
                        Menge
                    </label>
                    <input
                        id="quantity"
                        type="number"
                        min={1}
                        className={`p-2 rounded border ${
                            positionErrors.quantity
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        value={newPosition.quantity}
                        onChange={(e) =>
                            onChange("quantity", Number(e.target.value))
                        }
                    />
                    {positionErrors.quantity && (
                        <p className="text-sm text-red-500 mt-1">
                            {positionErrors.quantity}
                        </p>
                    )}
                </div>

                {/* Einheit */}
                <div className="flex flex-col">
                    <label htmlFor="unit" className="font-medium">
                        Einheit
                    </label>
                    <select
                        id="unit"
                        className={`p-2 rounded border ${
                            positionErrors.unit
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        value={newPosition.unit}
                        onChange={(e) =>
                            onChange("unit", e.target.value as Position["unit"])
                        }>
                        <option value="stück">Stück</option>
                        <option value="stunde">Stunde</option>
                        <option value="meter">Meter</option>
                    </select>
                    {positionErrors.unit && (
                        <p className="text-sm text-red-500 mt-1">
                            {positionErrors.unit}
                        </p>
                    )}
                </div>

                {/* Einzelpreis */}
                <div className="flex flex-col">
                    <label htmlFor="unitPrice" className="font-medium">
                        Einzelpreis
                    </label>
                    <input
                        id="unitPrice"
                        type="number"
                        min={0}
                        step={0.01}
                        className={`p-2 rounded border ${
                            positionErrors.unitPrice
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        value={newPosition.unitPrice}
                        onChange={(e) =>
                            onChange("unitPrice", Number(e.target.value))
                        }
                    />
                    {positionErrors.unitPrice && (
                        <p className="text-sm text-red-500 mt-1">
                            {positionErrors.unitPrice}
                        </p>
                    )}
                </div>

                {/* optional: Material */}
                <div className="flex flex-col">
                    <label htmlFor="material" className="font-medium">
                        Material (optional)
                    </label>
                    <input
                        id="material"
                        type="text"
                        className="border border-gray-300 p-2 rounded"
                        value={newPosition.material || ""}
                        onChange={(e) => onChange("material", e.target.value)}
                    />
                </div>

                {/* optional: Typ */}
                <div className="flex flex-col">
                    <label htmlFor="type" className="font-medium">
                        Typ (optional)
                    </label>
                    <select
                        id="type"
                        className="border border-gray-300 p-2 rounded"
                        value={newPosition.type || ""}
                        onChange={(e) =>
                            onChange(
                                "type",
                                e.target.value as "product" | "service"
                            )
                        }>
                        <option value="">Typ wählen</option>
                        <option value="product">Produkt</option>
                        <option value="service">Service</option>
                    </select>
                </div>

                {/* optional: Maße */}
                <div className="flex flex-col">
                    <label htmlFor="width" className="font-medium">
                        Maße (optional)
                    </label>
                    <input
                        id="width"
                        type="number"
                        className="border border-gray-300 p-2 rounded"
                        value={newPosition.dimensions?.length || ""}
                        onChange={(e) =>
                            onChange("dimensions", {
                                ...newPosition.dimensions,
                                length: parseFloat(e.target.value),
                            } as Position["dimensions"])
                        }
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-8">
                    <button
                        type="button"
                        onClick={onSave}
                        className="mt-4 w-full rounded bg-blue-600 hover:bg-blue-700 py-2 px-6 text-white sm:w-auto">
                        {editIndex !== null
                            ? "Position speichern"
                            : "Position hinzufügen"}
                    </button>
                    {editIndex !== null && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="mt-4 flex items-center border border-gray-500 py-2 px-6 text-gray-500 hover:text-gray-700">
                            Bearbeitung abbrechen
                        </button>
                    )}
                </div>

                {/* Liste der Positionen */}
                <div className="mt-6">
                    <h3 className="mb-2 text-lg font-semibold">Positionen</h3>
                    <ul className="space-y-2">
                        {positions.map((pos, index) => (
                            <li
                                key={index}
                                className="flex justify-between rounded border px-4 py-2 text-sm shadow-sm">
                                <span>
                                    {pos.quantity} {pos.unit} {pos.label}
                                </span>
                                <span>
                                    {(pos.unitPrice * pos.quantity).toFixed(2)}€
                                </span>

                                <button
                                    type="button"
                                    onClick={() => onEdit(index)}
                                    className="text-blue-600 hover:text-blue-800">
                                    <SquarePen />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(index)}
                                    className="text-red-600 hover:text-red-800">
                                    <Delete />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-4 font-semibold">
                    Gesamtsumme: {calculateTotal().toFixed(2)}€
                </div>
            </div>
        </section>
    );
};

export default PositionsStep;
