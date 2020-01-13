# Backend

Detta är en redovisningstext för en projektuppgift i kursen jsramverk, Blekinge tekniska högskola. 

Jag valde att använda mig av Express samt SQLite som databas och inte MongoDB. Anledningen var att jag ville ha backenden krångelfri ihop med autentisering då jag gjorde ganska många API-routes för att t ex kunna köpa, sälja och även visa historik för en specifik användare. Min databas är ganska enkel med 6 relaterade tabeller för varje enskild användare - användare, råvara, pengasaldo, användarens råvarusaldo, köpt och sålt. 

När en användare registreras görs det automatiskt insert (med nollvärde) på tabellerna för pengar och enhetssumman av varje metall (utöver tabellen för användare) och dessa är såklart kopplade till användaren som registreras. Jag använder mig av db.serialize för att få till en någorlunda transaktionsliknande aktion, dvs. att flera saker görs i rad. Jag lyckades inte hitta några bra exempel på transaktioner med SQLite och Node tyvärr. Sedan gör jag på liknande sätt för att köpa och sälja då det dras/läggs till pengar, dras/läggs till enhetssumman för råvaror (hur mycket av guld, silver och brons som varje användare har totalt) och även för historiken (köp/sälj). Det finns också routes för historik (köpt och sålt), pengasaldo och råvarusaldo. Koden för ovan blev ganska lång, över 300 rader och jag gick nog lite över vad jag hade behövt, men jag tyckte att det var en rolig uppgift. 

### Realtid

Denna backend är inte integrerad med socket.io-servern, jag körde istället på microservice som i chatten då jag tycker detta gick smidigt att implementera. Jag använde exemplet från kursrepot med kakpriser och justerade det en aning ifall priserna t ex går under noll. Jag lade ingen större vikt på prislogik. Diagrammet fungerar som det ska. 