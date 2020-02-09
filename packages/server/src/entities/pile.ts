import { def } from "@cardsgame/utils"

import { canBeChild, containsChildren } from "../annotations"
import { State } from "../state"
import { Entity, applyTraitsMixins } from "../traits/entity"
import { ParentArrayTrait } from "../traits/parentArray"
import { LocationTrait } from "../traits/location"
import { ChildTrait } from "../traits/child"
import { LabelTrait } from "../traits/label"
import { IdentityTrait } from "../traits/identity"

@canBeChild
@containsChildren()
@applyTraitsMixins([
  IdentityTrait,
  LocationTrait,
  ChildTrait,
  ParentArrayTrait,
  LabelTrait
])
export class Pile extends Entity<PileOptions> {
  create(state: State, options: PileOptions = {}) {
    this.name = def(options.name, "Pile")
    this.type = def(options.type, "pile")
  }
}

interface Mixin
  extends IdentityTrait,
    LocationTrait,
    ChildTrait,
    ParentArrayTrait,
    LabelTrait {}

type PileOptions = Partial<ConstructorType<Mixin>>

export interface Pile extends Mixin {}
