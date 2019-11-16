import { Entity, applyMixins } from "../../src/traits/entity"
import {
  containsChildren,
  canBeChild,
  ParentTrait
} from "../../src/traits/parent"
import { ChildTrait } from "../../src/traits/child"
import { IdentityTrait, LabelTrait } from "../../src/traits"
import { OwnershipTrait } from "../../src/traits/ownership"

@canBeChild
@containsChildren()
@applyMixins([
  IdentityTrait,
  ParentTrait,
  ChildTrait,
  LabelTrait,
  OwnershipTrait
])
export class SmartParent extends Entity<SmartParentOptions> {}

interface ParentMixin
  extends IdentityTrait,
    ParentTrait,
    ChildTrait,
    LabelTrait,
    OwnershipTrait {}

type SmartParentOptions = Partial<ConstructorType<ParentMixin>>

export interface SmartParent extends ParentMixin {}

// ==================================

@canBeChild
@applyMixins([IdentityTrait, ChildTrait, LabelTrait, OwnershipTrait])
export class SmartEntity extends Entity<SmartEntityOptions> {}

interface EntityMixin
  extends IdentityTrait,
    ChildTrait,
    LabelTrait,
    OwnershipTrait {}

type SmartEntityOptions = Partial<ConstructorType<EntityMixin>>

export interface SmartEntity extends EntityMixin {}