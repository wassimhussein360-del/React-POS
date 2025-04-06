import React from "react";
import { Modifier, ModifierOption } from "@/app/abstraction/types";
import { $translate } from "@/app/helpers/helpers";

interface Props {
  assignedModifiers: Modifier[];
}

const SelectedModifiersSummary: React.FC<Props> = ({ assignedModifiers }) => {
  return (
    <div className="bg-gray-200 px-1 rounded">
      {assignedModifiers.map((modifier, index) => {
        const selectedOptions = modifier.list
          .filter((option: ModifierOption) => option.selected)
          .map(
            (option: ModifierOption) =>
              `${option.name?.en || option.nameEn}${
                option.withQuantity ? ` (x${option.quantity || 1})` : ""
              }`
          );

        return selectedOptions.length > 0 ? (
          <div className="text-[9px] " key={index}>
            <strong>{$translate(modifier.name)}:</strong> {selectedOptions.join(" | ")}
          </div>
        ) : null;
      })}
    </div>
  );
};

export default SelectedModifiersSummary;
