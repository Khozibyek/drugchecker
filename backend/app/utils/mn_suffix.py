def _last_word(word: str) -> str:
    """Олон үгтэй нэрнээс сүүлийн үгийг авна. Жишээ: 'Ацикловир тос' → 'тос'"""
    parts = (word or "").strip().split()
    return parts[-1] if parts else ""


def _last_vowel(word: str) -> str:
    """Үгийн сүүлийн эгшгийг буцаана. Жишээ: 'амоксициллин' → 'и'"""
    vowels = "аеёиоуыэюяөү"
    for ch in reversed(word.lower()):
        if ch in vowels:
            return ch
    return ""


def add_comitative(word: str) -> str:
    """
    Хамсрах нөхцөл: -тай / -тэй / -той
    Дүрэм:
      - л, р үсгээр төгссөн       → -той  (Альбендазол → Альбендазолтой)
      - хатуу эгшигтэй (а,о,ы,у)  → -тай  (Диазепам → Диазепамтай)
      - зөөлөн эгшигтэй (и,э,ө,ү) → -тэй  (Ибупрофен → Ибупрофентэй)
    """
    word = (word or "").strip()
    if not word:
        return word
    lw = _last_word(word).lower()
    last_char = lw[-1]
    last_vowel = _last_vowel(lw)

    if last_char in "лр":
        return word + "той"
    if last_vowel in "аоыу":
        return word + "тай"
    return word + "тэй"


def add_genitive(word: str) -> str:
    """
    Харьяалахын тийн ялгал: -ын / -ийн / -ны / -ний / -ы / -ий
    Дүрэм:
      - н үсгээр төгссөн + хатуу эгшиг  → -ы   (Диазепамын → тусгай)
      - н үсгээр төгссөн + зөөлөн эгшиг → -ий  (Амоксициллин → Амоксициллиний)
      - с үсгээр төгссөн                 → -ны  (нүүрс → нүүрсны)
      - й үсгээр төгссөн                 → -н   (тийн → тийн)
      - хатуу эгшигтэй                   → -ын  (Диазепам → Диазепамын)
      - зөөлөн эгшигтэй                  → -ийн (Ацетазоламид → Ацетазоламидийн)
    """
    word = (word or "").strip()
    if not word:
        return word
    lw = _last_word(word).lower()
    last_char = lw[-1]
    last_vowel = _last_vowel(lw)

    if last_char == "н":
        if last_vowel in "аоыу":
            return word + "ы"
        return word + "ий"
    if last_char == "с":
        return word + "ны"
    if last_char == "й":
        return word + "н"
    if last_vowel in "аоыу":
        return word + "ын"
    return word + "ийн"


def add_accusative(word: str) -> str:
    """
    Заахын тийн ялгал: -ыг / -ийг / -г
    Дүрэм:
      - эгшгээр төгссөн        → -г    (кофе → кофег)
      - хатуу эгшигтэй (а,о,ы,у) → -ыг  (тос → тосыг)
      - зөөлөн эгшигтэй        → -ийг  (эм → эмийг)
    """
    word = (word or "").strip()
    if not word:
        return word
    lw = _last_word(word).lower()
    last_char = lw[-1]
    last_vowel = _last_vowel(lw)
    vowels = "аеёиоуыэюяөү"

    if last_char in vowels:
        return word + "г"
    if last_vowel in "аоыу":
        return word + "ыг"
    return word + "ийг"


def add_suffix(word: str, suffix_type: str) -> str:
    """
    Нөхцөл төрлөөр залгана.
      comitative → хамсрах нөхцөл  (-тай/-тэй/-той)
      genitive   → харьяалах нөхцөл (-ын/-ийн/-ны/-ний)
      accusative → заах нөхцөл     (-ыг/-ийг/-г)
    """
    if suffix_type == "comitative":
        return add_comitative(word)
    if suffix_type == "genitive":
        return add_genitive(word)
    if suffix_type == "accusative":
        return add_accusative(word)
    return word