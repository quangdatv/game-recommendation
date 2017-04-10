; test add & update game
(deffacts games
        (game (id 1) (name "Game 1") (description "test desc 1") (genre "genre test" "genre 2") (publisher "Thang") 
        (platforms "IOS" "Android") (age-range "e") (game-mode "single-player" "multiplayer") 
        (release-date "2015-10-20 00:00:00") (length 11.3) (difficulty "Tough")
        (command "add"))
        (game (id 2) (name "Game 1") (description "test desc 1") (publisher "Thang") 
        (platforms "IOS" "Android") (age-range "e") (game-mode "single-player" "multiplayer") 
        (release-date "2015-10-20 00:00:00") (length 11.3) (difficulty "Tough")
        (command "add"))
        (game (id 1) (name "Game 1") (genre "genre test" "genre 2") (publisher "Thang") 
        (platforms "IOS" "Android") (age-range "e") (game-mode "single-player" "multiplayer") 
        (release-date "2015-10-20 00:00:00") (length 11.3) (command "add")))

; test add review
;(deffacts reviews
;        (review (id 1) (rating 5) (game-id 1) (reviewer-id 2) (comment "testing comment")))

; 
;(deffacts searches
;        (search (genre "genre test") (platform "IOS") ))