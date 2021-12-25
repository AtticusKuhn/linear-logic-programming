@{%
const lexer = require("./lexer.js")
%}


@lexer lexer

Program -> Rule:+ {%id%}
ws -> %whitespace:+ {%id%}
Rule -> Expr %dot  {%(d)=>({
    type:"rule",
    expr:d[0],
})%}
Term -> %atom Term2:? {%(d)=>({
    type:"term",
    atom:d[0],
    exprs:d[1] || [],
})%} 
Term2 -> %lparen Expr Term3 {%d=>[d[1], d[2]]%}
Term3 -> (%comma Expr Term3) {%d=>[d[1], d[2]]%}
    | %rparen {%id%}
# Term -> %atom %lparen Expr %rparen 
Expr ->  
# %fx  ws Expr 
    # | %fy ws Expr 
    # | Expr  ws %xf 
    # | Expr ws %yf 
     Expr  ws %xfx  ws Expr {%(d,l,reject) => {
         if(JSON.stringify(d[0]).length > JSON.stringify(d[4]).length){
             return reject;
         }else{
             return {
                 type:"xfx",
                 operator: d[2],
                 x1: d[0],
                 x2: d[4]
             };
         }
     }%}
    |  %variable  {%(d)=>({
        type:"variable",
        value: d[0]
    })%}
    | Term {%id%}
    | Expr ws %xfy ws Expr 
    | Expr ws %yfx ws Expr
    | %number {%id%}
    | %string {%id%}
    | List {%id%}
    | %lparen Expr %rparen {%d=>d[1]%}
    | %lbrace Expr %rbrace{%d=>d[1]%}
List -> %lbracket List2
List2 -> Expr List3 | %rbracket
List3 -> %comma Expr List3 | %bar Expr %rbracket | %rbracket

