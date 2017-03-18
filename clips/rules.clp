(defrule add-new-game "print and assert new game"
        ?new-game <- (game (id ?id)
                (name $?name)
                (genre $?genre)
                (publisher $?publisher)
                (platforms $?platforms)
                (age-range $?age-range)
                (game-mode $?game-mode)
                (release-date $?release-date)
                (length $?length)
                (rating $?rating)
                (difficulty $?difficulty))
        =>
        (printout t "id: " ?id ", name: " ?name ", genre: " ?genre
                ", publisher: " ?publisher ", platforms: " ?platforms
                ", age-range: " ?age-range ", game-mode: " ?game-mode
                ", release-date: " ?release-date ", length: " ?length
                ", rating: " ?rating ", difficulty: " ?difficulty crlf)
        (assert ?new-game)
        )
)

(defrule update-game "enable user to edit game uploaded by them"
        ?game-id <- (game (id ?id))
        ?updated-game <- (game (name ?name)
                (genre ?genre)
                (publisher ?publisher)
                (platforms ?platforms)
                (age-range ?age-range)
                (game-mode ?game-mode)
                (release-date ?release-date)
                (length ?length)
                (difficulty ?difficulty))
        =>
        (modify ?game-id ?updated-game)
)

(defrule remove-game "remove a game"
        ?game-id <- (game (id ?id))
        =>
        (retract ?game-id))

(defrule add-game-review "add a review for a game"
        ?new-review <- (review (id ?id)
                (rating ?rating)
                (game-id ?game-id)
                (reviewer-id ?reviewer-id)
                (comment ?comment))
        =>
        (assert ?new-review))

(defrule update-game-review "update a review"
        ?update-review <- (review (rating ?rating)
                (comment ?comment))
        ?review-id <- (review (id ?id))
        =>
        (modify ?review-id ?update-review))

(defrule remove-review "remove a review"
        ?review-id <- (review (id ?id))
        =>
        (retract ?review-id))

(defrule game-rating "rating the game"
        ?game <- (game (id ?id)
                (rating ?rating&:(> ?rating -1)&:(< ?rating 6)))
        =>
        (bind ?count 0)
        (bind ?sum 0)
        (do-for-all-facts
                (?review review)
                (= ?review:game-id ?id)
                (bind ?count (+ ?count 1))
                (bind ?sum (+ ?sum 1)))
        (if (> ?count 0)
                then
                (modify ?game (rating (/ ?sum ?count)))
                else
                (modify ?game (rating 0))
        )
)

(defrule filtering "print all facts"
        ?filter <- (filter (genre ?genre)
                (age-range ?age-range)
                (game-mode ?game-mode)
                (rating ?rating))
        => 
        (printout t "all facts: " ?filter crlf))
