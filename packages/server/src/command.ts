import { logs } from "@cardsgame/utils"

import { Room } from "./room"
import { State } from "./state/state"

export interface Command {
  execute(state: State, room: Room<any>): Promise<void>
  undo(state: State, room: Room<any>): Promise<void>
}

export class Command {
  protected _subCommands: Command[] = []
  private readonly _name: string
  get name(): string {
    return this._name
  }

  /**
   * @param name provide only if you're using `new Command()` syntax.
   * If you're extending command, just leave it empty -
   * the name will be grabbed from class name.
   */
  constructor(name?: string) {
    this._name = name || this.constructor.name
  }

  /**
   * Undoes every remembered extra sub command.
   * `Command` may gather new sub commands only while executing.
   * `Sequence` will only gather sub commands upon construction.
   */
  async undo(state: State, room: Room<any>): Promise<void> {
    if (this._subCommands.length === 0) {
      logs.verbose(`${this.name}, nothing else to undo.`)
      return
    }

    logs.group(`Commands group: ${this.name}.undo()`)
    for (let i = this._subCommands.length - 1; i >= 0; i--) {
      const command = this._subCommands[i]
      if (command.undo) {
        logs.notice(`- ${command.name}: undoing`)
        await command.undo(state, room)
      } else {
        logs.warn(`- ${command.name} doesn't have undo()!`)
      }
    }
    logs.groupEnd()
  }

  /**
   * Execute a sub command.
   * Call ONLY during your commands `execute` method.
   * Will also remember it internally for undoing.
   */
  protected async subExecute(
    state: State,
    room: Room<any>,
    command: Command
  ): Promise<void> {
    this._subCommands.push(command)
    await command.execute(state, room)
  }
}

export type Targets<T> = T | T[] | (() => T | T[])
export class TargetsHolder<T> {
  constructor(private readonly value: Targets<T>) {}
  // TODO: These could be "value" getters?
  get(): T[] {
    const targets =
      typeof this.value === "function" ? (this.value as () => T)() : this.value

    return !Array.isArray(targets) ? [targets] : targets
  }
}

export type Target<T> = T | (() => T)
export class TargetHolder<T> {
  constructor(private readonly value: Target<T>) {}
  // TODO: These could be "value" getters?
  get(): T {
    return typeof this.value === "function"
      ? (this.value as () => T)()
      : this.value
  }
}
