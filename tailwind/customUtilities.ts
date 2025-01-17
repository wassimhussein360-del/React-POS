export default function ({
  addUtilities,
}: {
  addUtilities: (utilities: object, variants: string[]) => void;
}) {
  const newUtilities = {
    ".flex-center": {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
    },
    ".flex-between": {
      display: "flex",
      "align-items": "center",
      "justify-content": "space-between",
    },
    ".flex-end": {
      display: "flex",
      "align-items": "center",
      "justify-content": "flex-end",
    },
    // Add more custom utilities as needed
  };

  addUtilities(newUtilities, ["responsive", "hover"]);
}
