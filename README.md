# Felanmälningssystem för felparkeringar

Ett fullstackprojekt där användare kan rapportera felparkerade bilar och parkeringsvakter hanterar dem.

## Funktioner
- Rapportera via formulär med plats och bild
- Rollbaserad inloggning (kund/vakt/admin)
- Vakter får notifiering om anmälningar
- Statusuppdateringar i realtid

## Tech-stack
- **Frontend:** React Native + Tailwind CSS
- **Backend:** Docker + Spring Boot + PostgreSQL

## Komma igång

### Frontend
```bash
cd frontend
npx expo start
```

### Backend
```bash
docker desktop start
docker compose up --build
```
Bygger en container enligt [`docker-compose.yml`](https://github.com/voizter37/felparkering-api/blob/4eb3534fb29af986c2976d00e5ff87890477a640/docker-compose.yml) som: 
- Bygger backend med Gradle
- Startar backend på `http://localhost:8080/` 
- Startar en PostgreSQL-databas som backend är kopplad till.

## Tester

### Köra backend-tester
```bash
cd backend
./gradlew test
```

## Dokumentation

### API-specifikation

Fullständig specifikation enligt [`backend/docs/api-spec.yaml`](backend/docs/api-spec.yaml)

### Addresslista
Adresserna kommer ifrån [osmnames.org](https://osmnames.org/download/) där jag har plockat ut data för endast Sverige genom att köra:
```bash
zcat planet-latest.tsv.gz | awk -F '\t' -v OFS='\t' 'NR == 1 || $16 == "se"' > sweden.tsv
```
Jag har sedan arbetat med denna data i en [Python-notebook](addresses.ipynb) där jag har rensat datan på orelevanta kolumner, hämtat saknade adresser med hjälp av longitud och latitud samt delat in adresserna till de topp 10 mest befolkade städerna som nu också blir de vaktgrupper som kommer att användas i projektet.