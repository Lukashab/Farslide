Farslide - uživatelská příručka
=======
Vytvoření prezentace pomocí pluginu Farslide zahrnuje 3 části.

Vytvoření obsahu prezentace
----
Jelikož plugin Farslide podporuje oddělení obsahové a grafické části prezentace (separation of content), 
je nejprve potřeba vytvořit samostatný soubor formátu yml specifikující strukturu a obsah prezentace. 
Formát vstupního souboru je podrobněji popsán v dokumentačním souboru [input_cz.yml](https://github.com/Lukashab/Farslide/blob/master/doc/input_cz.md). 

Tento soubor je nutným vstupem pro úspěčný export výsledné prezentace pluginem.
 
 Vytvoření grafických podkladů prezentace
 ---
 Grafická část prezentace se vytváří v programu Inkscape.
 
 Plugin Farslide
 ----
 Plugin Farslide slouží k propojení grafické a obsahové části prezentace a k exportu těchto částí do výsledného HTML souboru.
 
 ####Postup použití pluginu
 #####Propojení vstupů
 Obsah s grafikou prezentace se v prostředí pluginu propojuje dvěma funkcemi, které společně specifikují jednotlivé snímky prezentace.
 ######Order
 Pro použití této funkce přejděte do položky **Order** v nabídce pluginu. 
 Funkce umožňuje specifikovat pořadí grafického eleentu jakožto snímku ve výsledné prezentaci.
 
 1. Označte vámi vytvořený grafický element v Inkscape prostředí, kterému chcete přiřadit pořadí v prezentaci.
 2. Zvolte pořadí v číselném poli.
 3. Tlačítkem **apply** přiřadíte pořadí grafickému elementu.
 4. (V případě že bylo již toto pořadí specifikováno, objeví se chybová hláška)
 
 ######Groups
 Pro použití této funkce přejděte do položky **Groups** v nabídce pluginu. 
 Funkce slouží k specifikaci zanoření grafických elementů jakožto snímků prezentace.
 
 1. Jako první označte grafický element, který má představovat rodiče ostatních snímků.
 2. Jako další označte grafické elementy, které mají představovat potomky označeného rodiče.
 3. Tlačítkem **apply** vytvoříte specifikované zanoření.
 
 Mnohonásobné označování elementů (u kterého závisí na pořadí) lze v Inkscape prostředí pomocí klávesové zkratky **ctrl + left mouse**.
 
 ######Export
 Pro použití této funkce přejděte do položky **Export** v nabídce pluginu. 
 Funkce slouží k exportu vytvořených vstupů do výsledné složky s prezentací.
 V momentu použití této funkce se očekává hotové propojení grafiky a obsaového souboru pomocí funkcí **Order** a **Groups**
 
 1. Zvolte lokaci vašeho YML souboru s obsahem prezentace.
 2. Zvolte lokaci pro export prezentace.
 3. Tlačítkem **apply** se provede export výsledné prezentace do zvoleného cílového adresáře.
 
 
 Prezentace
 ------
Vyexportovaný adresář s prezentací obsahuje soubor **index.html**. Tento soubor slouží k spuštění prezentace.

1. Otevřete soubor index.html v libovolném webovém prohlížeči.
2. Pomocí formulářového pole v levém horním rohu můžete zvolit čas animace mezi snímky.
3. Pomocí navigace v pravém dolním rohu můžete přecházet mezi snímky ve všech 4 směrech. 


Přeji mnoho úspěchů a málo strastí při používání pluginu.