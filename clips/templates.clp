(deftemplate game "game's template"
        (slot id (type INTEGER))
        (slot name (type STRING))
        (slot description (type STRING))
        (multislot genre (type STRING))
        (slot publisher (type STRING))
        (multislot platform (type STRING))
        (slot age-range (type STRING))
        (multislot game-mode (type STRING))
        (slot release-date (type STRING))
        (slot length (type NUMBER))
        (slot difficulty (type STRING))
)

(deftemplate search "user's search"
        (slot genre (type STRING))
        (slot game-mode (type STRING))
        (slot platform (type STRING))
        (slot age-range (type STRING))
        (slot difficulty (type STRING))
)

(deftemplate review "user's review"
        (slot id (type INTEGER))
        (slot rating (type NUMBER))
        (slot game-id (type INTEGER))
        (slot reviewer-id (type INTEGER))
        (slot comment (type STRING))
)