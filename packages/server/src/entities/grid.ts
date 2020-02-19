import { def, limit } from "@cardsgame/utils"

import { canBeChild, containsChildren, type } from "../annotations"
import { State } from "../state"

import { ChildTrait } from "../traits/child"
import { Entity, applyTraitsMixins } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { LocationTrait } from "../traits/location"
import { OwnershipTrait } from "../traits/ownership"
import { ParentMapTrait } from "../traits/parentMap"
import { SelectableChildrenTrait } from "../traits/selectableChildren"

export function isGrid(entity: any): entity is Grid {
  return "columns" in entity && "rows" in entity
}

/**
 * Two dimensional container of items of set spots.
 * May also be used as one-dimensional "line" of limited child items.
 */
@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentMapTrait,
  LabelTrait,
  OwnershipTrait,
  SelectableChildrenTrait
])
export class Grid extends Entity<GridOptions> {
  @type("uint8") columns: number
  @type("uint8") rows: number

  // @type("number") cellSpacing: number

  @type("string") justify: GridJustify
  @type("string") justifyItems: GridJustifyItems
  @type("string") alignItems: GridAlignItems

  itemAngle: number

  hijacksInteractionTarget = false

  create(state: State, options: GridOptions = {}) {
    this.name = def(options.name, "Grid")
    this.type = def(options.type, "grid")

    this.columns = Math.max(1, def(options.columns, 1))
    this.rows = Math.max(1, def(options.rows, 1))
    this.maxChildren = this.columns * this.rows

    this.justify = options.justify
    this.justifyItems = options.justifyItems
    this.alignItems = options.alignItems

    // this.cellSpacing = def(options.cellSpacing, 0)

    this.itemAngle = def(options.itemAngle, 0)
  }

  addChildAt(entity: ChildTrait, column: number, row: number): void {
    this.addChild(entity, column + row * this.columns)
  }

  getChildAt<T extends ChildTrait>(column: number, row: number): T {
    return this.getChildren<T>().find(child => {
      child.idx === column + row * this.columns
    })
  }
}

type GridJustify =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "space-around"
  | "space-between"
type GridJustifyItems = "start" | "end" | "center" | "stretch"
type GridAlignItems = "start" | "end" | "center" | "stretch"

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentMapTrait,
    LabelTrait,
    OwnershipTrait,
    SelectableChildrenTrait {}

type GridOptions = Partial<
  ConstructorType<Mixin> & {
    columns: number
    rows: number
    cellSpacing: number

    justify: GridJustify
    justifyItems: GridJustifyItems
    alignItems: GridAlignItems

    itemAngle: number
  }
>

export interface Grid extends Mixin {}
