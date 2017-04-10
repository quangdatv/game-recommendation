(defrule search-matching
        (game (id ?id) (name ?name) (description ?description) (genre)
                (publisher ?publisher) (platform ?platform) (age-range ?age-range)
                (game-mode ?game-mode) (release-date ?release-date) (length ?length)
                (difficulty ?difficulty))
        
)


(defrule add-new-game "print new game"
        ?game <- (game (id ?id)
                (name ?name)
                (description ?description)
                (genre $?genre)
                (publisher ?publisher)
                (platforms $?platforms)
                (age-range ?age-range)
                (game-mode $?game-mode)
                (release-date ?release-date)
                (length ?length)
                (rating ?rating)
                (difficulty ?difficulty)
                (command ?command&:(= (str-compare ?command "add") 0)))
        =>
        (printout t "Add game" crlf)
        (modify ?game (command ""))
)

(defrule update-game "enable user to edit game uploaded by them"
        ?game-id <- (game (id ?id))
        ?updated-game <- (game (name ?name)
                (description ?description)
                (genre $?genre)
                (publisher ?publisher)
                (platforms $?platforms)
                (age-range ?age-range)
                (game-mode $?game-mode)
                (release-date ?release-date)
                (length ?length)
                (difficulty ?difficulty)
                (command ?command&:(= (str-compare ?command "update") 0)))
        =>
        (printout t "Modify game" crlf)
        (modify ?game-id (name ?name)
                (description ?description)
                (genre $?genre)
                (publisher ?publisher)
                (platforms $?platforms)
                (age-range ?age-range)
                (game-mode $?game-mode)
                (release-date ?release-date)
                (length ?length)
                (difficulty ?difficulty)
                (command ""))
)

(defrule remove-game "remove a game"
        ?game-id <- (game (id ?id)
                (command ?command&:(= (str-compare ?command "remove") 0)))
        =>
        (printout t "Remove game" crlf)
        (retract ?game-id)
)



(defrule add-game-review "add a review for a game"
        ?review <- (review (id ?id)
                (rating ?rating)
                (game-id ?game-id)
                (reviewer-id ?reviewer-id)
                (comment ?comment)
                (command ?command&:(= (str-compare ?command "add") 0)))
        =>
        (printout t "Add game review" crlf)
        (modify ?review (command ""))
)

(defrule update-game-review "update a review"
        ?review-id <- (review (id ?id))
        ?update-review <- (review (rating ?rating)
                (comment ?comment)
                (command ?command&:(= (str-compare ?command "update") 0)))
        =>
        (printout t "Modify game review" crlf)
        (modify ?review-id (rating ?rating)
                (comment ?comment)
                (command ""))
)

(defrule remove-game-review "remove a review"
        ?review-id <- (review (id ?id)
                (command ?command&:(= (str-compare ?command "remove") 0)))
        =>
        (printout t "Remove game review" crlf)
        (retract ?review-id)
)



(defrule update-game-rating "rating the game"
        ?game <- (game (id ?id)
                (rating ?rating&:(= ?rating -1))
                (command ?command&:(= (str-compare ?command "update-rating") 0)))
        =>
        (printout t "Update game rating" crlf)
        (bind ?count 0)
        (bind ?sum 0)
        (do-for-all-facts
                ((?review review))
                (= ?review:game-id ?id)
                (bind ?count (+ ?count 1))
                (bind ?sum (+ ?sum ?review:rating)))
        (if (> ?count 0)
                then
        (modify ?game (rating (/ ?sum ?count))
                (command ""))
                else
        (modify ?game (rating 0)
                (command "")))
)