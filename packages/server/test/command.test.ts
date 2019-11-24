import { Command } from "../src/command"

class DummieCommand {
  execute = jest.fn()
  undo = jest.fn()
}
class CommandGenerator {
  _name = "test"
  execute() {
    return [new DummieCommand(), new DummieCommand()]
  }
  undo = jest.fn()
}

// it("executes every subCommand", async () => {
//   const commands: unknown[] = [
//     new DummieCommand(),
//     new DummieCommand(),
//     new DummieCommand()
//   ]

//   const command = new Command(commands as Command[])

//   await command.execute({} as any, {} as any)

//   commands.forEach((cmd: DummieCommand) => {
//     expect(cmd.execute).toHaveBeenCalled()
//   })
// })

it(`handles empty list`, () => {
  const command = new Command()

  expect(async () => await command.execute({} as any, {} as any)).not.toThrow()
})
