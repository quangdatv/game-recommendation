(defrule search-matching
        ?f <- (game (name ?name) (genre $? ?genre $?) (platform $? ?platform $?) (age-range ?age-range)
                  (game-mode $? ?game-mode $?) (difficulty ?difficulty))
        (search (genre ""|?genre) (game-mode ""|?game-mode) (platform ""|?platform)
                (age-range ""|?age-range) (difficulty ""|?difficulty))
        =>
        (printout t (fact-slot-value ?f id)
              "---" (fact-slot-value ?f name)
              "---" (fact-slot-value ?f description)
              "---" (fact-slot-value ?f genre)
              "---" (fact-slot-value ?f publisher)
              "---" (fact-slot-value ?f platform)
              "---" (fact-slot-value ?f age-range)
              "---" (fact-slot-value ?f game-mode)
              "---" (fact-slot-value ?f release-date)
              "---" (fact-slot-value ?f length)
              "---" (fact-slot-value ?f difficulty)
              "---" (fact-slot-value ?f image)
              "~~~"
        )
        (retract ?f)
)
