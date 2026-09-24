# YouTube upload metadata

Copy-paste metadata per locale. Durations are the rendered video lengths. Chapter timestamps
are the English timeline (3:36); other locales shift by a few seconds — the chapter *labels*
stay valid, only the numbers need adjusting if you upload a non-English cut as the primary
video.

Full metadata (title + description + tags) is provided for the ten uploads with the widest
reach; the remaining 27 locales get a compact table with localized titles and durations.
Every locale's subtitles are in `subtitles/`, and every narrated locale's audio track is in
the master MKV (`build/video/master-multiaudio.mkv`).

## Thumbnail

Text overlay on a dark terminal slide: **"12 networks. 4 addresses. 1 phrase."** — pair with a
screenshot of the `npm run derive` output showing the four-account table, so the claim is
visible in the thumbnail itself.

***

## English (`en`) — 3:36

### Title

```text
12 networks, 4 accounts, 1 recovery phrase — how MetaMask multichain accounts really work
```

### Description

```text
One MetaMask account shows twelve networks — Ethereum, Linea, Base, Arbitrum, BNB Chain,
OP Mainnet, Polygon, Monad, Arc, Bitcoin, Solana and TRON — but only four addresses exist,
and the wallet shows a private key for just one of them. This video explains the whole
derivation in three minutes: the BIP-39 phrase, the two curves (secp256k1 and ed25519), the
four derivation paths, the four address encodings, and why nine EVM networks share one key
while their balances stay separate.

Code + derivation guide + line-by-line explainers:
https://github.com/baneeishaque-ompventure/metamask-multichain-accounts

Chapters:
0:00 Twelve networks. Four accounts. One phrase.
0:19 Where is the rest of my wallet?
0:34 A phrase is not a key.
0:52 One seed, two trees.
1:14 Four paths, four keys.
1:30 Why Solana's apostrophes are mandatory.
1:50 Four ways to write an address.
2:09 Nine networks, one key.
2:25 One address, nine ledgers.
2:43 Three secrets, three jobs.
3:00 Verify it yourself.
3:23 Twelve networks, four accounts, one phrase.

What the demo proves:
- One BIP-39 phrase derives four accounts: EVM, Bitcoin (native SegWit), Solana, TRON
- secp256k1 uses BIP-32; ed25519 needs SLIP-0010 — hardened-only, no xpubs
- The nine EVM networks share one key: address derivation never asks which chain
- Every result is pinned to official vectors (BIP-39, BIP-84, SLIP-0010, EIP-55)
- The demo is read-only: no signing, no RPC, no network calls

Stack: TypeScript, Node.js, noble/scure cryptography.
License: MIT
```

### Tags

```text
metamask, multichain, bip39, bip32, slip10, derivation path, ethereum, bitcoin, solana, tron,
wallet, cryptography, web3, mnemonic, seed phrase, account derivation
```

***

## Hindi (`hi`) — 4:08

### Title

```text
बारह नेटवर्क, चार अकाउंट, एक फ़्रेज़ — MetaMask मल्टीचेन अकाउंट असल में कैसे काम करते हैं
```

### Description

```text
एक MetaMask अकाउंट बारह नेटवर्क दिखाता है — एथेरियम, लिनेया, बेस, आर्बिट्रम, बीएनबी चेन,
ओपी मेननेट, पॉलीगॉन, मोनाड, आर्क, बिटकॉइन, सोलाना और ट्रॉन — लेकिन असल में सिर्फ़ चार अकाउंट
होते हैं, और वॉलेट उनमें से सिर्फ़ एक की प्राइवेट की दिखाता है। यह वीडियो पूरी डेरिवेशन समझाता
है: BIP-39 फ़्रेज़, दो कर्व (secp256k1 और ed25519), चार पाथ, चार एड्रेस एनकोडिंग, और यह क्यों
नौ EVM नेटवर्क एक ही की साझा करते हैं जबकि उनके बैलेंस अलग रहते हैं।

कोड + डेरिवेशन गाइड + लाइन-बाय-लाइन एक्सप्लेनर:
https://github.com/baneeishaque-ompventure/metamask-multichain-accounts

अध्याय (अंग्रेज़ी टाइमलाइन):
0:00 बारह नेटवर्क। चार अकाउंट। एक फ़्रेज़।
0:19 बाक़ी वॉलेट कहाँ है?
0:34 फ़्रेज़, की नहीं होता।
0:52 एक सीड, दो पेड़।
1:14 चार पाथ, चार कीज़।
1:30 सोलाना के अपॉस्ट्रफ़ी ज़रूरी क्यों?
1:50 एड्रेस लिखने के चार तरीक़े।
2:09 नौ नेटवर्क, एक की।
2:25 एक एड्रेस, नौ लेजर।
2:43 तीन सीक्रेट, तीन काम।
3:00 खुद वेरिफ़ाई करें।
3:23 बारह नेटवर्क, चार अकाउंट, एक फ़्रेज़।

डेमो क्या साबित करता है:
- एक BIP-39 फ़्रेज़ से चार अकाउंट: EVM, बिटकॉइन, सोलाना, ट्रॉन
- secp256k1 के लिए BIP-32; ed25519 के लिए SLIP-0010 — सिर्फ़ हार्डन्ड, कोई xpub नहीं
- नौ EVM नेटवर्क एक ही की साझा करते हैं — एड्रेस डेरिवेशन चेन नहीं पूछता
- हर नतीजा ऑफ़िशियल टेस्ट वेक्टर्स पर पिन है (BIP-39, BIP-84, SLIP-0010, EIP-55)
- डेमो रीड-ओनली है: कोई साइनिंग नहीं, कोई RPC नहीं

स्टैक: TypeScript, Node.js, noble/scure क्रिप्टोग्राफ़ी।
लाइसेंस: MIT
```

### Tags

```text
metamask, मल्टीचेन, bip39, bip32, slip10, डेरिवेशन पाथ, एथेरियम, बिटकॉइन, सोलाना, ट्रॉन,
वॉलेट, क्रिप्टोग्राफ़ी, web3, सीड फ़्रेज़
```

***

## Bengali (`bn`) — 4:32

### Title

```text
বারোটি নেটওয়ার্ক, চারটি অ্যাকাউন্ট, একটি ফ্রেজ — MetaMask মাল্টিচেইন অ্যাকাউন্ট আসলে কীভাবে কাজ করে
```

### Description

```text
একটি MetaMask অ্যাকাউন্ট বারোটি নেটওয়ার্ক দেখায় — ইথেরিয়াম, লিনিয়া, বেস, আরবিট্রাম,
বিএনবি চেইন, ওপি মেইননেট, পলিগন, মনাড, আর্ক, বিটকয়েন, সোলানা এবং ট্রন — কিন্তু আসলে থাকে
মাত্র চারটি অ্যাকাউন্ট, আর ওয়ালেট তাদের মধ্যে একটির প্রাইভেট কী দেখায়। এই ভিডিও পুরো
ডেরিভেশন ব্যাখ্যা করে: BIP-39 ফ্রেজ, দুটি কার্ভ (secp256k1 ও ed25519), চারটি পাথ, চারটি
ঠিকানা-এনকোডিং, এবং কেন নয়টি EVM নেটওয়ার্ক একটি কী শেয়ার করে অথচ ব্যালেন্স আলাদা থাকে।

কোড + ডেরিভেশন গাইড + লাইন-বাই-লাইন ব্যাখ্যা:
https://github.com/baneeishaque-ompventure/metamask-multichain-accounts

অধ্যায় (ইংরেজি টাইমলাইন):
0:00 বারোটি নেটওয়ার্ক। চারটি অ্যাকাউন্ট। একটি ফ্রেজ।
0:19 বাকি ওয়ালেট কোথায়?
0:34 ফ্রেজ কোনো কী নয়।
0:52 এক সিড, দুটি গাছ।
1:14 চার পাথ, চার কী।
1:30 সোলানার অ্যাপস্ট্রফি কেন বাধ্যতামূলক।
1:50 ঠিকানা লেখার চার উপায়।
2:09 নয় নেটওয়ার্ক, এক কী।
2:25 এক ঠিকানা, নয়টি লেজার।
2:43 তিনটি গোপন, তিনটি কাজ।
3:00 নিজেই যাচাই করুন।
3:23 বারো নেটওয়ার্ক, চার অ্যাকাউন্ট, এক ফ্রেজ।

ডেমো যা প্রমাণ করে:
- একটি BIP-39 ফ্রেজ থেকে চারটি অ্যাকাউন্ট: EVM, বিটকয়েন, সোলানা, ট্রন
- secp256k1-এ BIP-32; ed25519-এ SLIP-0010 — শুধু হার্ডেনড, xpub নেই
- নয়টি EVM নেটওয়ার্ক এক কী শেয়ার করে — ঠিকানা তৈরিতে চেইন আসে না
- প্রতিটি ফলাফল অফিসিয়াল টেস্ট ভেক্টরে পিন করা
- ডেমো রিড-অনলি: সাইনিং নেই, RPC নেই

স্ট্যাক: TypeScript, Node.js, noble/scure ক্রিপ্টোগ্রাফি।
লাইসেন্স: MIT
```

### Tags

```text
metamask, মাল্টিচেইন, bip39, bip32, slip10, ডেরিভেশন পাথ, ইথেরিয়াম, বিটকয়েন, সোলানা, ট্রন,
ওয়ালেট, ক্রিপ্টোগ্রাফি, web3, সিড ফ্রেজ
```

***

## Arabic (`ar`) — 6:54

### Title

```text
اثنا عشر شبكة، أربعة حسابات، عبارة استرداد واحدة — كيف تعمل حسابات MetaMask متعددة الشبكات
```

### Description

```text
يعرض حساب MetaMask واحد اثنتي عشرة شبكة — إيثريوم، لينيا، بيس، أربيتروم، بي إن بي تشين،
أو بي مين نت، بوليجون، موناد، آرك، بيتكوين، سولانا، وترون — لكن الحسابات الحقيقية أربعة فقط،
والمحفظة تُظهر مفتاحًا خاصًا لواحد منها فقط. يشرح هذا الفيديو مسار الاشتقاق كاملًا: عبارة
BIP-39، والمنحنيان secp256k1 وed25519، والمسارات الأربعة، وترميزات العناوين الأربعة، ولماذا
تتشارك شبكات EVM التسع مفتاحًا واحدًا بينما تبقى الأرصدة منفصلة.

الكود + دليل الاشتقاق + شرح سطرًا بسطر:
https://github.com/baneeishaque-ompventure/metamask-multichain-accounts

الفصول (الخط الزمني الإنجليزي):
0:00 اثنا عشر شبكة. أربعة حسابات. عبارة واحدة.
0:19 أين بقية المحفظة؟
0:34 العبارة ليست مفتاحًا.
0:52 بذرة واحدة، شجرتان.
1:14 أربعة مسارات، أربعة مفاتيح.
1:30 لماذا علامات سولانا إلزامية.
1:50 أربع طرق لكتابة عنوان.
2:09 تسع شبكات، مفتاح واحد.
2:25 عنوان واحد، تسعة دفاتر.
2:43 ثلاثة أسرار، ثلاث مهام.
3:00 تحقق بنفسك.
3:23 اثنا عشر شبكة، أربعة حسابات، عبارة واحدة.

ما يثبته العرض:
- عبارة BIP-39 واحدة تشتق أربعة حسابات: EVM وبيتكوين وسولانا وترون
- secp256k1 يستخدم BIP-32؛ وed25519 يحتاج SLIP-0010 — مُصلَّب فقط، بلا xpub
- شبكات EVM التسع تتشارك مفتاحًا واحدًا — اشتقاق العنوان لا يسأل عن الشبكة
- كل نتيجة مثبتة على متجهات الاختبار الرسمية
- العرض للقراءة فقط: بلا توقيع، بلا RPC

التقنيات: TypeScript، Node.js، تشفير noble/scure.
الرخصة: MIT
```

### Tags

```text
metamask, متعدد الشبكات, bip39, bip32, slip10, مسار الاشتقاق, إيثريوم, بيتكوين, سولانا, ترون,
محفظة, تشفير, web3, عبارة الاسترداد
```

***

## Spanish (`es`) — 4:01

### Title

```text
12 redes, 4 cuentas, 1 frase de recuperación — cómo funcionan de verdad las cuentas multichain de MetaMask
```

### Description

```text
Una sola cuenta de MetaMask muestra doce redes — Ethereum, Linea, Base, Arbitrum, BNB Chain,
OP Mainnet, Polygon, Monad, Arc, Bitcoin, Solana y TRON — pero solo existen cuatro cuentas, y
la cartera muestra la clave privada de una sola. Este vídeo explica toda la derivación: la
frase BIP-39, las dos curvas (secp256k1 y ed25519), las cuatro rutas, las cuatro codificaciones
de dirección, y por qué las nueve redes EVM comparten una clave mientras sus saldos siguen
separados.

Código + guía de derivación + explicación línea por línea:
https://github.com/baneeishaque-ompventure/metamask-multichain-accounts

Capítulos (línea de tiempo en inglés):
0:00 Doce redes. Cuatro cuentas. Una frase.
0:19 ¿Dónde está el resto de mi cartera?
0:34 Una frase no es una clave.
0:52 Una semilla, dos árboles.
1:14 Cuatro rutas, cuatro claves.
1:30 Por qué los apóstrofes de Solana son obligatorios.
1:50 Cuatro formas de escribir una dirección.
2:09 Nueve redes, una clave.
2:25 Una dirección, nueve libros mayores.
2:43 Tres secretos, tres trabajos.
3:00 Verifícalo tú mismo.
3:23 Doce redes, cuatro cuentas, una frase.

Lo que demuestra la demo:
- Una frase BIP-39 deriva cuatro cuentas: EVM, Bitcoin, Solana y TRON
- secp256k1 usa BIP-32; ed25519 necesita SLIP-0010 — solo endurecido, sin xpubs
- Las nueve redes EVM comparten una clave: la derivación no pregunta por la cadena
- Cada resultado está fijado a los vectores oficiales
- La demo es de solo lectura: sin firmas, sin RPC

Stack: TypeScript, Node.js, criptografía noble/scure.
Licencia: MIT
```

### Tags

```text
metamask, multichain, bip39, bip32, slip10, ruta de derivación, ethereum, bitcoin, solana, tron,
cartera, criptografía, web3, frase semilla
```

***

## German (`de`) — 4:55

### Title

```text
12 Netzwerke, 4 Konten, 1 Wiederherstellungsphrase — wie MetaMask-Multichain-Konten wirklich funktionieren
```

### Description

```text
Ein einziges MetaMask-Konto zeigt zwölf Netzwerke — Ethereum, Linea, Base, Arbitrum, BNB Chain,
OP Mainnet, Polygon, Monad, Arc, Bitcoin, Solana und TRON — aber es existieren nur vier Konten,
und die Wallet zeigt den privaten Schlüssel für genau eines davon. Dieses Video erklärt die
gesamte Ableitung: die BIP-39-Phrase, die zwei Kurven (secp256k1 und ed25519), die vier Pfade,
die vier Adresskodierungen und warum sich neun EVM-Netzwerke einen Schlüssel teilen, während
ihre Kontostände getrennt bleiben.

Code + Ableitungsleitfaden + Zeile-für-Zeile-Erklärung:
https://github.com/baneeishaque-ompventure/metamask-multichain-accounts

Kapitel (englische Timeline):
0:00 Zwölf Netzwerke. Vier Konten. Eine Phrase.
0:19 Wo ist der Rest meiner Wallet?
0:34 Eine Phrase ist kein Schlüssel.
0:52 Ein Seed, zwei Bäume.
1:14 Vier Pfade, vier Schlüssel.
1:30 Warum Solanas Apostrophe Pflicht sind.
1:50 Vier Arten, eine Adresse zu schreiben.
2:09 Neun Netzwerke, ein Schlüssel.
2:25 Eine Adresse, neun Ledger.
2:43 Drei Geheimnisse, drei Aufgaben.
3:00 Verifiziere es selbst.
3:23 Zwölf Netzwerke, vier Konten, eine Phrase.

Was die Demo beweist:
- Eine BIP-39-Phrase leitet vier Konten ab: EVM, Bitcoin, Solana, TRON
- secp256k1 nutzt BIP-32; ed25519 braucht SLIP-0010 — nur hardened, keine xpubs
- Die neun EVM-Netzwerke teilen einen Schlüssel: die Ableitung fragt nicht nach der Chain
- Jedes Ergebnis ist an offizielle Testvektoren gebunden
- Die Demo ist read-only: keine Signaturen, kein RPC

Stack: TypeScript, Node.js, noble/scure-Kryptografie.
Lizenz: MIT
```

### Tags

```text
metamask, multichain, bip39, bip32, slip10, derivationspfad, ethereum, bitcoin, solana, tron,
wallet, kryptografie, web3, seed phrase
```

***

## French (`fr`) — 4:22

### Title

```text
12 réseaux, 4 comptes, 1 phrase de récupération — comment fonctionnent vraiment les comptes multichain de MetaMask
```

### Description

```text
Un seul compte MetaMask affiche douze réseaux — Ethereum, Linea, Base, Arbitrum, BNB Chain,
OP Mainnet, Polygon, Monad, Arc, Bitcoin, Solana et TRON — mais il n'existe que quatre comptes,
et le portefeuille ne montre la clé privée que d'un seul. Cette vidéo explique toute la
dérivation : la phrase BIP-39, les deux courbes (secp256k1 et ed25519), les quatre chemins, les
quatre encodages d'adresse, et pourquoi neuf réseaux EVM partagent une clé alors que leurs
soldes restent séparés.

Code + guide de dérivation + explication ligne par ligne :
https://github.com/baneeishaque-ompventure/metamask-multichain-accounts

Chapitres (chronologie anglaise) :
0:00 Douze réseaux. Quatre comptes. Une phrase.
0:19 Où est le reste de mon portefeuille ?
0:34 Une phrase n'est pas une clé.
0:52 Une graine, deux arbres.
1:14 Quatre chemins, quatre clés.
1:30 Pourquoi les apostrophes de Solana sont obligatoires.
1:50 Quatre façons d'écrire une adresse.
2:09 Neuf réseaux, une clé.
2:25 Une adresse, neuf registres.
2:43 Trois secrets, trois rôles.
3:00 Vérifiez-le vous-même.
3:23 Douze réseaux, quatre comptes, une phrase.

Ce que la démo prouve :
- Une phrase BIP-39 dérive quatre comptes : EVM, Bitcoin, Solana, TRON
- secp256k1 utilise BIP-32 ; ed25519 a besoin de SLIP-0010 — hardened uniquement, sans xpub
- Les neuf réseaux EVM partagent une clé : la dérivation ne demande pas la chaîne
- Chaque résultat est épinglé aux vecteurs de test officiels
- La démo est en lecture seule : aucune signature, aucun RPC

Stack : TypeScript, Node.js, cryptographie noble/scure.
Licence : MIT
```

### Tags

```text
metamask, multichain, bip39, bip32, slip10, chemin de dérivation, ethereum, bitcoin, solana,
tron, portefeuille, cryptographie, web3, phrase de récupération
```

***

## Portuguese (`pt`) — 5:06

### Title

```text
12 redes, 4 contas, 1 frase de recuperação — como as contas multichain da MetaMask realmente funcionam
```

### Description

```text
Uma única conta MetaMask mostra doze redes — Ethereum, Linea, Base, Arbitrum, BNB Chain,
OP Mainnet, Polygon, Monad, Arc, Bitcoin, Solana e TRON — mas existem apenas quatro contas, e a
carteira mostra a chave privada de somente uma delas. Este vídeo explica toda a derivação: a
frase BIP-39, as duas curvas (secp256k1 e ed25519), os quatro caminhos, as quatro codificações
de endereço, e por que as nove redes EVM compartilham uma chave enquanto seus saldos ficam
separados.

Código + guia de derivação + explicação linha a linha:
https://github.com/baneeishaque-ompventure/metamask-multichain-accounts

Capítulos (linha do tempo em inglês):
0:00 Doze redes. Quatro contas. Uma frase.
0:19 Onde está o resto da minha carteira?
0:34 Uma frase não é uma chave.
0:52 Uma semente, duas árvores.
1:14 Quatro caminhos, quatro chaves.
1:30 Por que os apóstrofos da Solana são obrigatórios.
1:50 Quatro formas de escrever um endereço.
2:09 Nove redes, uma chave.
2:25 Um endereço, nove livros-razão.
2:43 Três segredos, três funções.
3:00 Verifique você mesmo.
3:23 Doze redes, quatro contas, uma frase.

O que a demo prova:
- Uma frase BIP-39 deriva quatro contas: EVM, Bitcoin, Solana e TRON
- secp256k1 usa BIP-32; ed25519 precisa de SLIP-0010 — somente hardened, sem xpubs
- As nove redes EVM compartilham uma chave: a derivação não pergunta a chain
- Cada resultado é fixado aos vetores oficiais
- A demo é somente leitura: sem assinaturas, sem RPC

Stack: TypeScript, Node.js, criptografia noble/scure.
Licença: MIT
```

### Tags

```text
metamask, multichain, bip39, bip32, slip10, caminho de derivação, ethereum, bitcoin, solana,
tron, carteira, criptografia, web3, frase semente
```

***

## Russian (`ru`) — 4:30

### Title

```text
12 сетей, 4 аккаунта, 1 фраза восстановления — как на самом деле работают мультичейн-аккаунты MetaMask
```

### Description

```text
Один аккаунт MetaMask показывает двенадцать сетей — Ethereum, Linea, Base, Arbitrum, BNB Chain,
OP Mainnet, Polygon, Monad, Arc, Bitcoin, Solana и TRON — но на самом деле существует четыре
аккаунта, и кошелёк показывает приватный ключ только одного из них. В этом видео разобрана вся
деривация: фраза BIP-39, две кривые (secp256k1 и ed25519), четыре пути, четыре кодировки
адресов и почему девять сетей EVM делят один ключ, а их балансы остаются раздельными.

Код + руководство по деривации + построчное объяснение:
https://github.com/baneeishaque-ompventure/metamask-multichain-accounts

Главы (английский таймлайн):
0:00 Двенадцать сетей. Четыре аккаунта. Одна фраза.
0:19 Где остальная часть кошелька?
0:34 Фраза — это не ключ.
0:52 Одно семя, два дерева.
1:14 Четыре пути, четыре ключа.
1:30 Почему апострофы Solana обязательны.
1:50 Четыре способа записать адрес.
2:09 Девять сетей, один ключ.
2:25 Один адрес, девять реестров.
2:43 Три секрета, три роли.
3:00 Проверьте сами.
3:23 Двенадцать сетей, четыре аккаунта, одна фраза.

Что доказывает демо:
- Одна фраза BIP-39 выводит четыре аккаунта: EVM, Bitcoin, Solana, TRON
- secp256k1 использует BIP-32; ed25519 требует SLIP-0010 — только hardened, без xpub
- Девять сетей EVM делят один ключ: деривация не спрашивает сеть
- Каждый результат привязан к официальным тестовым векторам
- Демо работает только на чтение: без подписей и RPC

Стек: TypeScript, Node.js, криптография noble/scure.
Лицензия: MIT
```

### Tags

```text
metamask, мультичейн, bip39, bip32, slip10, путь деривации, ethereum, bitcoin, solana, tron,
кошелёк, криптография, web3, seed phrase
```

***

## Japanese (`ja`) — 5:33

### Title

```text
12のネットワーク、4つのアカウント、1つのリカバリーフレーズ — MetaMaskマルチチェーンアカウントの仕組み
```

### Description

```text
1つのMetaMaskアカウントに12のネットワークが表示されます — イーサリアム、リネア、ベース、
アービトラム、BNBチェーン、OPメインネット、ポリゴン、モナド、アーク、ビットコイン、ソラナ、
トロン。しかし実際のアカウントは4つだけで、ウォレットが表示する秘密鍵はそのうち1つ分だけ。
この動画では導出の全体を解説します: BIP-39フレーズ、2つの曲線（secp256k1とed25519）、
4つのパス、4つのアドレス符号化、そして9つのEVMネットワークが1つの鍵を共有しながら
残高が別々である理由。

コード + 導出ガイド + 行ごとの解説:
https://github.com/baneeishaque-ompventure/metamask-multichain-accounts

チャプター（英語タイムライン）:
0:00 12のネットワーク。4つのアカウント。1つのフレーズ。
0:19 残りのウォレットはどこ?
0:34 フレーズは鍵ではない。
0:52 1つのシード、2つの木。
1:14 4つのパス、4つの鍵。
1:30 ソラナのアポストロフィが必須な理由。
1:50 アドレスを書く4つの方法。
2:09 9つのネットワーク、1つの鍵。
2:25 1つのアドレス、9つの台帳。
2:43 3つの秘密、3つの役割。
3:00 自分で検証する。
3:23 12のネットワーク、4つのアカウント、1つのフレーズ。

デモが証明すること:
- 1つのBIP-39フレーズから4つのアカウント: EVM、ビットコイン、ソラナ、トロン
- secp256k1はBIP-32、ed25519はSLIP-0010 — hardened専用、xpubなし
- 9つのEVMネットワークは1つの鍵を共有 — 導出はチェーンを問わない
- すべての結果は公式テストベクターに固定
- デモは読み取り専用: 署名なし、RPCなし

スタック: TypeScript、Node.js、noble/scure暗号ライブラリ。
ライセンス: MIT
```

### Tags

```text
metamask, マルチチェーン, bip39, bip32, slip10, 導出パス, イーサリアム, ビットコイン, ソラナ,
トロン, ウォレット, 暗号技術, web3, シードフレーズ
```

***

## Compact locales (27)

Titles below are each locale's own slide-1 title from `translations/<locale>.json`; append
`— MetaMask Multichain` when uploading. For descriptions, reuse the English description with a
translated first line; the repo URL, stack line, and chapter labels carry over. "Subtitles
only" means the video has no narration track (no system voice ships for that language).

| Locale | Language         | Duration | Suggested title                                            | Audio          |
| ------ | ---------------- | -------- | ---------------------------------------------------------- | -------------- |
| `as`   | অসমীয়া           | 3:35     | বাৰখন নেটৱৰ্ক। চাৰিটা একাউণ্ট। এটা ফ্ৰেজ।                     | subtitles only |
| `brx`  | बड़ो             | 3:28     | बारह नेटवर्क। चार एकाउन्ट। एक फ्रेज।                        | subtitles only |
| `doi`  | डोगरी            | 3:58     | बारह नेटवर्क। चार अकाउंट। इक फ्रेज।                         | subtitles only |
| `gu`   | ગુજરાતી          | 3:47     | બાર નેટવર્ક. ચાર એકાઉન્ટ. એક ફ્રેઝ.                          | subtitles only |
| `id`   | Bahasa Indonesia | 5:14     | Dua belas jaringan. Empat akun. Satu frasa.                | narrated       |
| `it`   | Italiano         | 4:18     | Dodici reti. Quattro account. Una frase.                   | narrated       |
| `kn`   | ಕನ್ನಡ            | 4:40     | ಹನ್ನೆರಡು ನೆಟ್‌ವರ್ಕ್‌ಗಳು. ನಾಲ್ಕು ಖಾತೆಗಳು. ಒಂದು ಫ್ರೇಸ್.             | narrated       |
| `kok`  | कोंकणी           | 3:25     | बारा नेटवर्क। चार खातीं। एक फ्रेज।                           | subtitles only |
| `ks`   | کٲشُر             | 4:05     | بارہ نیٹ ورک۔ چار اکاؤنٹ۔ اک فریز۔                          | subtitles only |
| `ko`   | 한국어           | 4:27     | 12개의 네트워크, 4개의 계정, 1개의 문구.                    | narrated       |
| `mai`  | मैथिली           | 3:59     | बारह नेटवर्क। चारि खाता। एकटा फ्रेज।                        | subtitles only |
| `ml`   | മലയാളം           | 3:11     | പന്ത്രണ്ട് നെറ്റ്‌വർക്കുകൾ. നാല് അക്കൗണ്ടുകൾ. ഒരു ഫ്രേസ്.     | subtitles only |
| `mni`  | মৈতৈলোন্         | 3:31     | ꯇꯔꯥꯅꯤ ꯅꯦꯠꯋꯥꯔꯛ꯫ ꯃꯔꯤ ꯑꯀꯥꯎꯟꯠ꯫ ꯑꯃ ꯋꯥꯍꯩ꯫                         | subtitles only |
| `mr`   | मराठी            | 3:36     | बारा नेटवर्क. चार खाती. एक वाक्य.                           | subtitles only |
| `ne`   | नेपाली           | 3:36     | बाह्र नेटवर्क। चार खाता। एउटा वाक्यांश।                      | subtitles only |
| `or`   | ଓଡ଼ିଆ            | 3:37     | ବାରଟି ନେଟୱାର୍କ। ଚାରିଟି ଖାତା। ଗୋଟିଏ ବାକ୍ୟ।                     | subtitles only |
| `pa`   | ਪੰਜਾਬੀ           | 4:19     | ਬਾਰਾਂ ਨੈੱਟਵਰਕ। ਚਾਰ ਖਾਤੇ। ਇੱਕ ਵਾਕੰਸ਼।                          | subtitles only |
| `sa`   | संस्कृतम्        | 3:08     | द्वादश जालानि। चत्वारि खातानि। एकं वाक्यम्।                  | subtitles only |
| `sat`  | ᱥᱟᱱᱛᱟᱲᱤ          | 4:16     | ᱜᱮᱞ ᱵᱟᱨ ᱱᱮᱴᱣᱟᱨᱠ᱾ ᱯᱩᱱ ᱮᱠᱟᱣᱱᱴ᱾ ᱢᱤᱫ ᱯᱷᱨᱮᱡᱽ᱾                       | subtitles only |
| `sd`   | سنڌي             | 4:32     | ٻارنهن نيٽ ورڪ. چار اڪائونٽ. هڪ جملو.                      | subtitles only |
| `ta`   | தமிழ்            | 4:18     | பன்னிரண்டு நெட்வொர்க்குகள். நான்கு கணக்குகள். ஒரு ஃப்ரேஸ்.  | narrated       |
| `te`   | తెలుగు            | 4:28     | పన్నెండు నెట్‌వర్క్‌లు. నాలుగు ఖాతాలు. ఒక ఫ్రేజ్.              | narrated       |
| `th`   | ไทย              | 5:39     | สิบสองเครือข่าย สี่บัญชี หนึ่งวลี                              | narrated       |
| `tr`   | Türkçe           | 4:55     | On iki ağ. Dört hesap. Tek ifade.                          | narrated       |
| `ur`   | اردو             | 4:40     | بارہ نیٹ ورکس۔ چار اکاؤنٹس۔ ایک فقرہ۔                       | subtitles only |
| `vi`   | Tiếng Việt       | 4:49     | Mười hai mạng. Bốn tài khoản. Một cụm từ.                  | narrated       |
| `zh`   | 中文             | 4:55     | 十二个网络。四个账户。一个短语。                             | narrated       |

## Playlist suggestion

Create one playlist — **"MetaMask multichain accounts, explained"** — and start it with the
English cut, then add every narrated locale as its own entry (or the single multi-audio upload
once Studio's multi-language audio is configured). Subtitle-only locales can be added as
unlisted entries so the full language set stays discoverable without cluttering the channel.
