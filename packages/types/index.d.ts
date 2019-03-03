declare const SharedTypesON: boolean

/**
 * Entity
 */

type EntityID = number

/**
 * Client-server interacton
 */

type PrivateAttributeChangeData = {
  path: number[]
  owner?: string
  public: boolean
  attribute: string
  value: any
}

type AttributeChangeData = {
  name: string
  value: any
}
