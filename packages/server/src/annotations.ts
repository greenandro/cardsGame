import {
  type as colType,
  DefinitionType,
  Context,
  Schema
} from "@colyseus/schema"
import { globalContext } from "@colyseus/schema/lib/annotations"

import { logs } from "@cardsgame/utils"

const registeredTypeDefinitions: Map<
  string,
  Map<string, DefinitionType>
> = new Map()

const allChildrensTypes: { [key: string]: DefinitionType } = {}

/**
 * Provides type definitions in one object for all
 * children registered with `@canBeChild` decorator
 */
export const getAllChildrensTypes = () => {
  return { ...allChildrensTypes }
}

export function type(
  type: DefinitionType,
  context?: Context
): PropertyDecorator {
  return function(target: typeof Schema, field: string) {
    const constructor = target.constructor as typeof Schema

    let logType: any = `"${type}"`
    if (Array.isArray(type)) {
      logType = `(${typeof type}) [${typeof type}]`
    } else if (typeof type === "function") {
      logType = `(${typeof type}) "${type.name}"`
    } else if (typeof type === "object") {
      logType = `(${typeof type}) ${type}`
    }

    // Interecept type definition
    if (field.indexOf("children") !== 0) {
      if (!registeredTypeDefinitions.has(constructor.name)) {
        registeredTypeDefinitions.set(constructor.name, new Map())
      }
      logs.verbose("child type:", `${constructor.name}.${field} ${logType}`)
      registeredTypeDefinitions.get(constructor.name).set(field, type)
    }

    return colType(type, context)(target, field)
  }
}

export function defineTypes(
  target: typeof Schema,
  fields: { [property: string]: DefinitionType },
  context: Context = globalContext
) {
  for (let field in fields) {
    type(fields[field], context)(target.prototype, field)
  }
  return target
}

const registeredParents: {
  con: typeof Schema
  childrenSynced: boolean
}[] = []

/**
 * @private for internal usage only
 * Holds constructors for all registered children (`@canBeChild`)
 */
export const registeredChildren: Function[] = []

const synchChildrenArray = (
  parentConstructor: typeof Schema,
  childrenConstructor: Function
) => {
  const arr = []
  arr.push(childrenConstructor)

  // logs.verbose(
  //   `syncing "children${childrenConstructor.name}" in ${parentConstructor.name}`
  // )
  type(arr)(parentConstructor.prototype, `children${childrenConstructor.name}`)
}

/**
 * Decorator!
 * Register an entity class as possible child for any other parent entities.
 */
export function canBeChild(childConstructor: Function) {
  logs.verbose("canBeChild", childConstructor.name)

  // Remember this child type for future classes
  registeredChildren.push(childConstructor)

  // Add this child type to other parents,
  // which wish their children to be synced to client
  registeredParents
    .filter(({ childrenSynced }) => childrenSynced)
    .map(({ con }) => con)
    .forEach(parentConstructor =>
      synchChildrenArray(parentConstructor, childConstructor)
    )

  // Throw all prop types in
  registeredTypeDefinitions.get(childConstructor.name).forEach((val, key) => {
    if (key in allChildrensTypes && allChildrensTypes[key] !== val) {
      logs.warn(
        "canBeChild",
        `prop type "${key}" is already in, but contains different value`,
        val
      )
    }
    if (!(key in allChildrensTypes)) {
      allChildrensTypes[key] = val
    }
  })

  logs.verbose("allChildrensTypes after current child:")
  logs.verbose(JSON.stringify(allChildrensTypes, null, 2))
}

/**
 * Decorator!
 * Remember as possible parent to any kinds of children entities
 * Also enables syncing any previously remembered children kind on this constructor
 * @param childrenSynced set `false` to keep the children secret from clients
 */
export function containsChildren(childrenSynced = true) {
  return function containsChildren(parentConstructor: typeof Schema) {
    // Remember this parent
    registeredParents.push({
      con: parentConstructor,
      childrenSynced
    })

    Object.defineProperty(parentConstructor.prototype, "__syncChildren", {
      value: childrenSynced
    })

    // Add all known children kinds to this one
    if (childrenSynced) {
      registeredChildren.forEach(childConstructor =>
        synchChildrenArray(parentConstructor, childConstructor)
      )
    }
  }
}