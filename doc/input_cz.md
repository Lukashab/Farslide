Specifikace formátu obsahového souboru
========
Každý YML obsahový soubor použitý pro specifikaci struktury a obsahu Farslide prezentace obsahuje dvě sekce.
Následující řádky popisují formát a specifikaci těchto dvou sekcí.
Ukázka formátu vstupního obsahového souboru - [inpyt.yml](input.yml)


header
------------
Tato sekce slouží k vložení meta informací do Vaší prezentace. Žádný z následujících atributů není povinný.
#### Atributy
- **name** - Jméno prezentace.
- **author** - Autor prezentace.
- **date** - Datum vytvoření prezentace (V případě absence tohoto atributu se přidá aktuální datum).

presentation
------------
Veškeré informace v této sekci jsou parsovány Farslide pluginem a konvertovány jako obsah do výsledné prezentace.
Tato sekce obsahuje specifikaci všech snímků, které chceme mít ve výsledku exportu. Snímky jsou rozděleny na dva typy.

- **node** - Jeden snímek obsahující obsah psaný v syntaxi jazyka Markdown.
- **topic** - Skupina snímků, která může obsahovat jak Markdown obsah, tak další snímky (**node**) nebo skupiny (**topic**).


Snímky jsou reprezentovány YML listem obsahujícím klíčová slova **node** a **topic**.


#### Atributy
- **style** - Obsahuje dodatečné styly, které jsou přidány do HTML výsledku exportu. Byl přidán jeden speciální styl navíc oproti klasické CSS specifikaci. **size-ratio** slouží k upravení velikosti fontů obsahu snímku v závislosti na zadané poměrové hodnotě. 
- **content** - Obsah snímku. Jedná se o text zapsaný v syntaxi jazyka Markdown (který je při exportu pluginu přetransformován na HTML formátovaný obsah). V případě prvku **topic** může obsahovat jak Markdown obsah tak ostatní nody nebo topicy.

Pokud chce uživatel do prvku **topic** přidat oba dva typy obsahu, musí specifikovat dodatečné atributy uvnitř tagu **content**

- **node_content** - obsah snímku totožný s obsahem prvku **node**
- **topic_content** - List dalších prvků typu **node** nebo **topic**

#### Other syntax rules
- Každý atribut musí mít vždy svou hodnotu. Pokud tomu tak není, export prezentace skončí chybou.

