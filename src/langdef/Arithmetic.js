var symbolTable = SymbolTable()
    .prefix("+",10)
    .prefix("-",10)

    .infix("+", 2)
    .infix("-", 2)
    .infix("*", 4)
    .infix("/", 4)

    .infixR("^",6)

    .literal("(number)")

    .group("(",")")

    .symbol("(end)")