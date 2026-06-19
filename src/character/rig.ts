import { CHARACTER_CONTRACT, CHARACTER_VIEW_BOX, type RectContract } from "./characterContract.ts";
import { REQUIRED_RIG_IDS, type RigId } from "./requiredRigIds.ts";

export type CharacterRig = Readonly<{
  viewBox: string;
  ids: ReadonlySet<RigId>;
}>;

export class RigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RigValidationError";
  }
}

export function getSvgViewBox(svgText: string): string | null {
  const svgTag = svgText.match(/<svg\b[^>]*>/i)?.[0];
  return svgTag?.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1] ?? null;
}

export function getElementIds(svgText: string): string[] {
  return [...svgText.matchAll(/(?:^|[\s<])id\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1] ?? "");
}

export function getOpeningTagById(svgText: string, id: string): string | null {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<[a-zA-Z][^>]*?(?:^|[\\s<])id\\s*=\\s*["']${escapedId}["'][^>]*>`, "i");
  return svgText.match(pattern)?.[0] ?? null;
}

export function getAttributeFromTag(tag: string, attribute: string): string | null {
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(?:^|\\s)${escapedAttribute}\\s*=\\s*["']([^"']+)["']`, "i");
  return tag.match(pattern)?.[1] ?? null;
}

function assertRectContract(svgText: string, id: RigId, expected: RectContract): void {
  const tag = getOpeningTagById(svgText, id);
  if (tag === null) {
    throw new RigValidationError(`Missing required rig slot: ${id}`);
  }

  const actual = {
    x: Number(getAttributeFromTag(tag, "x")),
    y: Number(getAttributeFromTag(tag, "y")),
    width: Number(getAttributeFromTag(tag, "width")),
    height: Number(getAttributeFromTag(tag, "height"))
  };

  if (
    actual.x !== expected.x ||
    actual.y !== expected.y ||
    actual.width !== expected.width ||
    actual.height !== expected.height
  ) {
    throw new RigValidationError(
      `Rig slot ${id} must match x=${expected.x} y=${expected.y} width=${expected.width} height=${expected.height}`
    );
  }
}

export function getDuplicateIds(svgText: string): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const id of getElementIds(svgText)) {
    if (seen.has(id)) {
      duplicates.add(id);
    }
    seen.add(id);
  }

  return [...duplicates].sort();
}

export function assertRigSlotExists(svgText: string, id: RigId): void {
  const ids = new Set(getElementIds(svgText));
  if (!ids.has(id)) {
    throw new RigValidationError(`Missing required rig slot: ${id}`);
  }
}

export function loadCharacterRig(svgText: string): CharacterRig {
  const viewBox = getSvgViewBox(svgText);
  if (viewBox !== CHARACTER_VIEW_BOX) {
    throw new RigValidationError(`Expected viewBox "${CHARACTER_VIEW_BOX}", received "${viewBox ?? "missing"}"`);
  }

  const duplicateIds = getDuplicateIds(svgText);
  if (duplicateIds.length > 0) {
    throw new RigValidationError(`Duplicate SVG ids: ${duplicateIds.join(", ")}`);
  }

  for (const id of REQUIRED_RIG_IDS) {
    assertRigSlotExists(svgText, id);
  }

  assertRectContract(svgText, "pet-area", CHARACTER_CONTRACT.petArea);
  assertRectContract(svgText, "prompt-area", CHARACTER_CONTRACT.promptArea);
  assertRectContract(svgText, "body", CHARACTER_CONTRACT.bodyBox);

  return {
    viewBox,
    ids: new Set(REQUIRED_RIG_IDS)
  };
}
