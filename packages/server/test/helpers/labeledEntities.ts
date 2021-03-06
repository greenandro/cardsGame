import { canBeChild } from "../../src/annotations/canBeChild"
import { containsChildren } from "../../src/annotations/containsChildren"
import { ChildTrait } from "../../src/traits/child"
import { applyTraitsMixins, Entity } from "../../src/traits/entity"
import { IdentityTrait } from "../../src/traits/identity"
import { LabelTrait } from "../../src/traits/label"
import { ParentArrayTrait } from "../../src/traits/parentArray"

@canBeChild
@containsChildren()
@applyTraitsMixins([IdentityTrait, ParentArrayTrait, ChildTrait, LabelTrait])
export class LabeledParent extends Entity<LabeledParent> {}

export interface LabeledParent
  extends IdentityTrait,
    ParentArrayTrait,
    ChildTrait,
    LabelTrait {}

@canBeChild
@applyTraitsMixins([IdentityTrait, ChildTrait, LabelTrait])
export class LabeledEntity extends Entity<LabeledEntity> {}

export interface LabeledEntity extends IdentityTrait, ChildTrait, LabelTrait {}
