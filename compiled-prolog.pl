:- use_module(library(dom)).

button(X) :-
    create(li, LI),
    add_class(LI, 'list-group-item'), % Style
    html(LI, X),
    get_by_id('main', Parent),
    append_child(Parent, LI).


init :- button('hello').
hello(1).