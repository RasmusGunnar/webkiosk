## FC Nordsjælland Fan Hub (Expo prototype)

En simpel Expo/React Native-prototype, der visualiserer de flows vi har diskuteret: byfællesskaber (Ganløse m.fl.), fanfraktioner (Wild Tigers, Mild Fathers), kampdag-events og offentlig sangbog. Alt er statisk mock-data, så du kan se strukturen med det samme.

### Hvad du kan se i prototypen
- **Bundfaner**: Hjem, Byfællesskaber, Fraktioner, Kampdag, Indbakke, Profil.
- **Offentlige fraktioner**: Kanaler, setlist og sangbog vises for alle.
- **Byfællesskaber**: Eksempel på Ganløse/Farum/Hillerød med “kom alene”-vinkel og samkørsel.
- **Kampdag**: Events før/ved/efter kamp + fraktions-briefs.
- **Konfig/feature flags**: Viser hvordan en `config/app`-doc i Firestore kan styre tænd/sluk uden App Store-release.

### Ikoner og splash (bevidst udeladt)
For at holde PR’en fri for binære assets er ikoner/splash-filer fjernet. Expo falder tilbage til standardikoner. Hvis du vil genskabe dem:
1. Læg dine `.png`-filer i `assets/` (fx `icon.png`, `adaptive-icon.png`, `splash-icon.png`, `favicon.png`).
2. Opdater `app.json` felterne `icon`, `splash.image`, `android.adaptiveIcon.foregroundImage`, og `web.favicon` til de relevante stier.

### Kør lokalt
1. Installer afhængigheder (allerede gjort i containeren):  
   ```bash
   npm install
   ```
2. Start projektet:  
   ```bash
   npm run web
   ```  
   eller kør i Expo Go på mobil via `npm start`.

### Næste skridt mod en rigtig app
- Tilføj Firebase (Auth + Firestore) og flyt mock-data til collections (communities, factions, channels, songs, events).
- Indfør Remote Config eller en `config/app`-doc til feature flags.
- Sæt EAS Build + EAS Update op for hhv. App Store builds og små OTA hotfixes.
- Udvid profil/rolleniveau (captain/mod) og moderation (report/skjul, read-only kanaler).
