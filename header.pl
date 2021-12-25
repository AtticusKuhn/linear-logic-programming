:- use_module(library(dom)).

button(X) :-
    create(li, LI),
    add_class(LI, 'list-group-item'), % Style
    html(LI, X),
    get_by_id('results-greet', Parent),
    append_child(Parent, LI).