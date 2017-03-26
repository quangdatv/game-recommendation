(deftemplate game "game's template"
        (slot id (type INTEGER))
        (slot name (type STRING))
        (slot description (type STRING))
        (slot genre (type STRING))
        (slot publisher (type STRING))
        (slot platforms (type STRING))
        (slot age-range (type STRING))
        (slot game-mode (type STRING))
        (slot release-date (type NUMBER))
        (slot length (type NUMBER))
        (slot rating (type NUMBER) (default -1))
        (slot difficulty (type STRING))
)

(deftemplate search "user's search"
        (slot genre (type STRING))
        (slot game-mode (type STRING))
        (slot platform (type STRING))
        (slot age-range (type STRING))
        (slot difficulty (type STRING))
        (slot rating (type NUMBER) (default -1))
)

(deftemplate review "user's review"
        (slot id (type INTEGER))
        (slot rating (type NUMBER))
        (slot game-id (type INTEGER))
        (slot reviewer-id (type INTEGER))
        (slot comment (type STRING))
)

(deftemplate user "user's profile"
        (slot id (type INTEGER))
        (slot name (type STRING))
)