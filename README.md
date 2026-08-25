# System wspomagania triage'u pacjentów — praca magisterska

Aplikacja webowa, w której pacjent wskazuje okolicę ciała, opisuje objawy i historię
chorobową, a system przypisuje mu **kolor triage'u w skali manchesterskiej** wraz
z konkretnym zaleceniem, oraz proponuje najbardziej pasującą jednostkę chorobową
z bazy opisanej kodami ICD-10.

Projekt powstał jako część pracy magisterskiej na kierunku informatyka (specjalność UX)
na Zachodniopomorskim Uniwersytecie Technologicznym w Szczecinie.

## Jak to działa

**1. Wybór okolicy ciała**
Pacjent zaczyna od wskazania miejsca dolegliwości na sylwetce.

**2. Wywiad objawowy**
Formularz zbiera parametry istotne dla klasyfikacji — m.in. intensywność bólu w skali
liczbowej oraz duszność: osobno w spoczynku i przy wysiłku.

**3. Historia chorobowa**
Dodatkowy kontekst uwzględniany przy rekomendacji.

**4. Klasyfikacja triage**
Reguły decyzyjne przypisują jeden z pięciu kolorów skali manchesterskiej:

| Kolor | Zalecenie |
|---|---|
| 🔴 Czerwony | Stan wymaga natychmiastowej pomocy — telefon pod 112 |
| 🟠 Pomarańczowy | Wysokie ryzyko — skierowanie na SOR |
| 🟡 Żółty | Pilna konsultacja w ciągu 12–24 h |
| 🟢 Zielony | Kontakt z lekarzem rodzinnym w najbliższych dniach |
| 🔵 Niebieski | Bez wskazań do interwencji |

**5. Dopasowanie jednostki chorobowej**
Opis objawów podany tekstem jest zestawiany z bazą chorób. Dla każdej pozycji liczony
jest udział objawów pokrywających się z opisem pacjenta; wygrywa najwyższy wynik.
Baza zawiera kod ICD-10, nazwę i listę objawów — na przykład `S20 — powierzchowne urazy
klatki piersiowej` z objawami takimi jak ból w okolicy urazu, siniaki czy obrzęk.

**6. Wynik i rekomendacja**
Pacjent dostaje kolor triage'u, dopasowaną jednostkę chorobową i tekst zalecenia.

## Stack

| Warstwa | Technologie |
|---|---|
| Frontend | Angular (komponenty standalone), TypeScript |
| Renderowanie | Angular SSR — `server.ts` |
| Backend | Node.js, Express |
| Baza danych | MongoDB — kolekcje `choroby` i dane treningowe |

Backend wystawia dwa punkty końcowe: `/api/diseases` z bazą jednostek chorobowych
oraz `/api/trainingData` z danymi wykorzystanymi w części badawczej pracy.

## Uruchomienie

```bash
npm i
# MongoDB lokalnie na porcie 27017, baza "Szpital"
node server.js     # API na porcie 3000
npm start          # aplikacja Angular
```

## Zakres i ograniczenia

Klasyfikacja triage'u w tej wersji opiera się na **regułach decyzyjnych**, nie na modelu
uczonym — progi bólu i duszności są zapisane wprost w kodzie. Dopasowanie choroby również
działa na prostym pokryciu objawów, bez miary podobieństwa semantycznego. Było to świadome
uproszczenie: celem tej części pracy było zbudowanie działającego przepływu i interfejsu,
a nie wdrożenie modelu produkcyjnie.

⚠ **To projekt akademicki.** Aplikacja nie jest wyrobem medycznym i nie zastępuje
konsultacji lekarskiej.
