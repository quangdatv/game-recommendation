(defrule search-matching
        ?game <- (game (name ?name) (genre $? ?genre $?) (platform $? ?platform $?) (age-range ?age-range)
                  (game-mode $? ?game-mode $?) (difficulty ?difficulty))
        (search (genre ""|?genre) (game-mode ""|?game-mode) (platform ""|?platform)
                (age-range ""|?age-range) (difficulty ""|?difficulty))
        =>
        (printout t ?name)
        (deffact ?game)
)
