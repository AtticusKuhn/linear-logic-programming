//@ts-ignore
import nearley from "nearley";
//@ts-ignore
import grammar from "../auto-generated-parser.js";
import fs from "fs";

type AST = Rule[]
type Rule = {
    type: "rule",
    expr: Expr
}
type xfx = {
    type: "xfx",
    operator: {
        value: string,
    },
    x1: Expr,
    x2: Expr,
}
type Expr = xfx | {
    type: "variable",
    value: string
} | Term | {
    type: "string",
    value: string,
} | {
    type: "number",
    value: string,
}
type Term = {
    type: "term",
    atom: string,
    exprs: Expr[],
}
function parse(code: string) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    // const code = (await fs.readFile(filename)).toString();
    parser.feed(code);
    // console.log("parser:")
    // console.log(parser)
    const results: AST[] = parser.results;
    if (!results || results.length === 0) {
        throw new Error("no parser found for input")
    }
    if (results.length > 1) {
        console.error("Error: ambigous grammar detected \n\n" + results[0].join(""));
        console.log(results)
        fs.writeFileSync("error-trace.json", JSON.stringify(results, null, 4))
        throw new Error("Error: ambigous grammar detected")
    }
    return results[0]
}
type compiler<T> = (source: T) => string;
const collectNames = (expr: Expr): Expr[] => {
    if (expr.type === "term") {
        return [expr]
    }
    if (expr.type === "variable") {
        return [expr]
    }
    if (expr.type === "string") {
        return []
    }
    if (expr.type === "number") {
        return []
    }
    return [...collectNames(expr.x1), ...collectNames(expr.x2)]
}
const compileExpr: compiler<Expr> = (expr) => {
    if (expr.type === "xfx") {
        console.log("operator", expr.operator)
        if (expr.operator.value === "o-") {
            const names = collectNames(expr.x2).map(compileExpr).map(str => `retractall(${str})`).join(", ")
            return `${compileExpr(expr.x1)} :- ${compileExpr(expr.x2)}, ${names}. `
        }
        return `${compileExpr(expr.x1)} ${expr.operator} ${compileExpr(expr.x2)} `
    } else if (expr.type === "term") {
        expr.exprs = expr.exprs.flat(1)
        if (expr.exprs.length > 0) {
            console.log("the exprs are", expr.exprs)
            return `${expr.atom}(${expr.exprs.map(compileExpr)})`
        } else {
            return expr.atom
        }
    } else if (expr.type === "variable") {
        return expr.value
    } else {
        return expr.value
        // throw new Error(`unreachable code.expr is: ${JSON.stringify(expr, null, 4)} `)
    }
}
const compileRule: compiler<Rule> = (rule) => {
    const { expr } = rule
    return compileExpr(expr) + "."
}
const compileAST: compiler<AST> = (ast) => {
    return ast.map(compileRule).join("\n")
}
const main = () => {
    const ast = parse(fs.readFileSync("./sample.pl", "utf-8"))
    console.log("parsed successfully")
    fs.writeFileSync("./parsed-ast.json", JSON.stringify(ast, null, 2))
    const str = compileAST(ast)
    const header = fs.readFileSync("header.pl", "utf-8")
    console.log("compiled successfully")
    const full = header + "\n\n\n" + str
    fs.writeFileSync("./compiled-prolog.pl", full)
    fs.writeFileSync("./index.html", `
    <script type="text/prolog" id="prolog.pl">
    ${full}
    </script>
    <div id="main"></div>
    <script type="text/javascript" src="node_modules/tau-prolog/modules/core.js"></script>
    <script type="text/javascript" src="node_modules/tau-prolog/modules/dom.js"></script>
    <script type="text/javascript">
        var session = pl.create(1000);
        session.consult("prolog.pl", (error) => console.log(error));
        session.query("init.");
        session.answer((answer) => {
            console.log(answer)
        });
    </script>`)
}
main()