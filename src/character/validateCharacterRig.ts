import { loadCharacterRig, RigValidationError } from "./rig.ts";

export type RigValidationResult = Readonly<
  | {
      ok: true;
      errors: [];
    }
  | {
      ok: false;
      errors: string[];
    }
>;

export function validateCharacterRig(svgText: string): RigValidationResult {
  try {
    loadCharacterRig(svgText);
    return { ok: true, errors: [] };
  } catch (error) {
    if (error instanceof RigValidationError) {
      return { ok: false, errors: [error.message] };
    }

    return { ok: false, errors: ["Unexpected rig validation failure"] };
  }
}
