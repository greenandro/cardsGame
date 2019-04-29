import { State } from "../../state"
import { Player } from "../../player"
import { EntityTransform } from "../../transform"
import { IParent, addChild } from "./parent"
import { IIdentity } from "./identity"

export function EntityConstructor(entity: IEntity, options: IEntityOptions) {
  // state && id
  entity._state = options.state
  entity.id = entity._state.registerEntity(entity)

  // Transforms
  entity._localTransform = new EntityTransform(
    options.x,
    options.y,
    options.angle
  )
  entity._localTransform.on("update", () => updateTransform(entity))

  entity._worldTransform = new EntityTransform()
  entity._worldTransform.on("update", () => updateTransform(entity))
  updateTransform(entity)

  // parent
  if (!options.parent) {
    // no parent = root as parent
    // entity.parent = 0
    addChild(entity._state, this)
  } else {
    const newParent =
      typeof options.parent === "number"
        ? entity._state.getEntity(options.parent)
        : options.parent
    if (!newParent.isParent()) {
      throw new Error(
        `${
          options.type
        } constructor: given 'parent' is not really IParent (no 'children' property)`
      )
    }
    addChild(newParent, this)
  }
}

export interface IEntity extends IIdentity {
  _state: State
  isParent(): this is IParent

  idx: number
  parent: EntityID
  owner: Player

  type: string
  name: string

  x?: number
  y?: number
  angle?: number
  width?: number
  height?: number

  // Private stuff, author shouldn't be care about these,
  // entityConstructor() should take care of initing them

  /**
   * > Current transform of the object based on local factors
   *
   * eg. author-chosen transform when creating this entity
   */
  _localTransform?: EntityTransform

  /**
   * > Current transform of the object based on world (parent) factors
   *
   * eg.transform applied by parent container
   */
  _worldTransform?: EntityTransform
}

// Entity constructor options
export interface IEntityOptions {
  state: State
  type?: string
  name?: string
  width?: number
  height?: number
  x?: number
  y?: number
  angle?: number
  parent?: EntityID | IEntity
  idx?: number
  owner?: Player
}

/**
 * Gets a reference to this entity's parent.
 * There must be any parent, so any undefined will fallback to state's `entities`
 */
export function getParentEntity(entity: IEntity): IEntity & IParent {
  const parent = entity._state.getEntity(entity.parent)
  if (parent.isParent()) {
    return parent
  }
}

export function getIdxPath(entity: IEntity): number[] {
  const path: number[] = [this.idx]
  const getNext = (entity: IEntity) => {
    const parent = getParentEntity(entity)
    const parentsIdx = parent.idx
    if (typeof parentsIdx === "number") {
      path.unshift(parentsIdx)
      getNext(parent)
    }
  }
  getNext(entity)

  return path
}

/**
 * Points out if this element can be
 * target of any interaction
 */
export function isInteractive(entity: IEntity) {
  const parent = getParentEntity(entity)
  if (parent.hijacksInteractionTarget) {
    return false
  }
  return true
}

/**
 * Get the real owner of this thing, by traversing `this.parent` chain.
 * Owner could be set on an element or container, meaning every element in
 * such container belongs to one owner.
 *
 * @returns `Player` or `undefined` if this container doesn't belong to anyone
 */
export function getOwner(entity: IEntity): Player {
  if (entity.owner) {
    return entity.owner
  }
  const parent = getParentEntity(entity)
  if (!parent) {
    return
  }
  if (parent.owner) {
    return parent.owner
  }
  return getOwner(parent)
}

export function updateTransform(entity: IEntity) {
  return ["x", "y", "angle"].map(prop => {
    entity[prop] = entity._localTransform[prop] + entity._worldTransform[prop]
  })
}

export function resetWorldTransform(entity: IEntity) {
  return ["x", "y", "angle"].map(prop => {
    entity._worldTransform[prop] = 0
  })
}
