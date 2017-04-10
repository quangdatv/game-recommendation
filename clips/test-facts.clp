; test add & update game
(deffacts games
        (game (id 1) (name "Game 1") (description "test desc 1") (genre "sport" "puzzle" "test") (publisher "Thang")
        (platform "IOS" "Android") (age-range "e") (game-mode "single-player" "multiplayer")
        (release-date "2015-10-20 00:00:00") (length 11.3) (difficulty "Tough"))
        (game (id 2) (name "Game 2") (description "test desc 2") (genre "a" "puzzle" "b") (publisher "Hiep")
        (platform "IOS" "Android") (age-range "e") (game-mode "single-player" "multiplayer")
        (release-date "2015-10-20 00:00:00") (length 11.3) (difficulty "Tough"))
        (game (id 3) (name "Game 3") (description "test desc 3") (genre "c" "d" "sport" "e") (publisher "Vu Dat Quang Dinh")
        (platform "IOS" "Android") (age-range "e") (game-mode "single-player" "multiplayer")
        (release-date "2015-10-20 00:00:00") (length 11.3) (difficulty "Tough")))

; test add review
;(deffacts reviews
;        (review (id 1) (rating 5) (game-id 1) (reviewer-id 2) (comment "testing comment")))

;
;(deffacts searches
;        (search (genre "genre test") (platform "IOS") ))
