:- use_module(library(dom)).

button(X) :-
    create(button, LI),
    add_class(LI, 'list-group-item'), % Style
    html(LI, X),
    get_by_id('main', Parent),
    append_child(Parent, LI).

div(X) :-
    create(div, LI),
    add_class(LI, 'list-group-item'), % Style
    html(LI, X),
    get_by_id('main', Parent),
    append_child(Parent, LI).
