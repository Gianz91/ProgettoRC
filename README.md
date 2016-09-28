<H1>Progetto sviluppato per Reti Di Calcolatori</H1>
<H2>Nome: Gianluca<br>
Matricola : 1404678</H2>

Il progetto consiste nella realizzazione di un servizio REST che usufruisce delle api di Google per l'Oauth e per scaricare file dal Drive dell'utente certificato.

L'applicazione è salvata su GoogleService.js e va fatta partire dal prompt di Nodejs. All'interno del servizio, l'utente che desidera certificarsi deve fornire:

<ol>
<li> il Client ID</li>
<li> il Client Secret</li>
</ol>

Per informazioni sulla valorizzazione di questi campi e della loro creazione, si rimanda alle delucidazione sul <a href="https://developers.google.com/identity/protocols/OAuth2">protocollo Oauth di Google</a>

Prelevando poi le informazioni per l'autenticazione, e l'access_token relativo, il servizio permetterà di scegliere uno tra tre file e scaricarli esportandoli in formato .pdf
