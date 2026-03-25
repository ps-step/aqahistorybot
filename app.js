import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyAz_jPNmliD7hjB0X-aIPAkKSmFyyZLw-s",

  authDomain: "aqa-history-revision-7a5d9.firebaseapp.com",

  databaseURL: "https://aqa-history-revision-7a5d9-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "aqa-history-revision-7a5d9",

  storageBucket: "aqa-history-revision-7a5d9.firebasestorage.app",

  messagingSenderId: "724726768452",

  appId: "1:724726768452:web:fe1ce11cad7356c988ad11",

  measurementId: "G-FH1QPYER7G"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;

// --- AUTHENTICATION ---
const loginBtn = document.getElementById('login-btn');
const userInfo = document.getElementById('user-info');
loginBtn.addEventListener('click', () => { currentUser ? signOut(auth) : signInWithPopup(auth, new GoogleAuthProvider()); });
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        loginBtn.textContent = "Sign Out";
        userInfo.textContent = `Hello, ${user.displayName}`;
        userInfo.style.display = "inline-block";
    } else {
        loginBtn.textContent = "Sign in with Google";
        userInfo.style.display = "none";
    }
});

// --- TAB SWITCHING ---
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        document.getElementById(e.target.dataset.target).classList.add('active');
    });
});

// --- DATA: CATEGORIES & TIMELINES ---
const spainCats = [
    "Ferdinand and Isabella: Economics", "Ferdinand and Isabella: Foreign and Dynastic Policy", "Ferdinand and Isabella: Religious Policy", 
    "Ferdinand and Isabella: Royal Authority and Administration", "Ferdinand and Isabella: Santa Hermandad", "Ferdinand and Isabella: Securing the Throne and Managing the Nobility", 
    "Charles V: Consolidation of Royal Authority and Revolts", "Charles V: Economics", "Charles V: Foreign Policy", "Charles V: Government and Administration", 
    "Charles V: New World", "Charles V: Religious Policy", "Philip II - Dutch Revolt", "Philip II - Economics", "Philip II - Foreign Policy (not Netherlands)", 
    "Philip II - Revolts", "Philip II - Government and Royal Authority", "Philip II - Religious Policy"
];
const wotrCats = ["1450-1458", "1458-1461", "1461-1469", "1469-1471", "1471-1483", "1483-1485", "1485-1499"];

// --- SPAIN NOTES DATA (MUST BE DEFINED BEFORE UI SETUP) ---
const spainNotesData = {
    "Ferdinand and Isabella: Royal Authority and Administration": [
        { type: "bullet", text: "Personal monarchy: Isabella travelled over 2000km per year to personally oversee justice and suppress dissent." },
        { type: "bullet", text: "The 1480 Cortes of Toledo used Acts of Resumption to reclaim royal lands and revenues lost since 1464. Older gains were protected." },
        { type: "bullet", text: "Corregidores were royal governors in towns. In 1494, there were 54. By 1516, there were 86." },
        { type: "bullet", text: "The Royal Council was professionalised in a 1493 pragmatica. Ten years' legal training was required to sit on the council." },
        { type: "bullet", text: "Secretaries gained status. Hernando de Zafra rose from humble origins to 100k maravedis salary and he negotiated the surrender of Granada." },
        { type: "bullet", text: "The fueros and separate cortes of Aragon were retained. The 1494 Cortes of Aragon appointed viceorys." },
        { type: "bullet", text: "The Castilian cortes was made up of nobles and representatives from 17 towns (plus Granada in 1492)." },
        { type: "bullet", text: "The Castilian cortes did not meet from 1482 to 1498." }
    ],
    "Ferdinand and Isabella: Securing the Throne and Managing the Nobility": [
        { type: "bullet", text: "War of Succession: Isabella was kept captive by her guardian, the Marquis of Villena. Joanna Beltraneja threatened the crown. The Archbishop of Toledo supported Joanna with 19,000 men and 20 castles. Isabella won at 1476 Battle of Toro. Ended by 1479 Treaty of Alcacovas. Castile granted everything north of and including Canaries. Beltraneja was sent to a convent." },
        { type: "bullet", text: "Rewards: Alliances with grandees such as Mendozas, Velascos. New titles established like 1475 Duchy of Infantado, 1492 Duchy of Frias." },
        { type: "bullet", text: "Adulterine castles were turned into Isabelline palaces." },
        { type: "bullet", text: "Marquis of Villena forced to forfeit Escalona." },
        { type: "bullet", text: "Military orders (Santiago, Calatrava, Alcantara) absorbed into crown by 1501. Santiago alone had 80 encomiendas. Vast revenues." },
        { type: "bullet", text: "Mayorazgos were promoted by the 1505 Cortes of Toro. Prevented the sale and division of estates." },
        { type: "bullet", text: "Grandees: 300 families owned 15% of land. Socially dominant, but excluded from the Royal Council." }
    ],
    "Ferdinand and Isabella: Santa Hermandad": [
        { type: "bullet", text: "Established at 1476 Cortes of Madrigal." },
        { type: "bullet", text: "Peacekeeping force for rural towns with 50+ inhabitants." },
        { type: "bullet", text: "Coordinated by Junta General. Treasurer was Abraham Sener, a Jewish tax farmer: allegations of corruption." },
        { type: "bullet", text: "Summary powers to enforce justice, such as death by arrow for highway robbery." },
        { type: "bullet", text: "Militia of 3000 men in 1476. This rose to 10,000 by 1490." },
        { type: "bullet", text: "Provided 300 million maravedis and 16,000 men to the Granada war." },
        { type: "bullet", text: "Central organisation disbanded in 1498 to appease towns (too expensive)." }
    ],
    "Ferdinand and Isabella: Religious Policy": [
        { type: "bullet", text: "Inquisition established by Papal Bull in 1478 to target converso heresy. 700 executed in Seville from 1481-88. 99.3% of trials in Barcelona in 1505 of Jewish origin." },
        { type: "bullet", text: "Jews never really liked. Already long-standing Jewish districts (aljamas) in cities. 1476 pragmatica forbade all Jews from Bilbao." },
        { type: "bullet", text: "Changed curriculum of Salamanca University in 1482 to include limpieze de sangre." },
        { type: "bullet", text: "March 1492 Alhambra decree told all Jews to convert or leave by July. Estimates of exodus range from 40,000 to 300,000. Loss of professionals (eg. silk) but short term gain in confiscated property eg. gold and silver which Jews weren't allowed to take." },
        { type: "bullet", text: "Granada War was framed as crusade and thus funded by the cruzada tax which brought in 800m maravedis from 1484-92." },
        { type: "bullet", text: "Muslims: Archbishop of Granada, Talavera, promoted teaching and religious education. But 1499 intervention by Cisneros used forced baptisms. This led to the 1499-1501 Alpujarras revolt. 1502 decree said Castilian Muslims can choose conversion or exile." },
        { type: "bullet", text: "Cisneros (archbishop of Toledo) was highly infliuential. Made cardinal in 1507, financed Uni of Alcala in 1508, and capture of Oran in 1509." },
        { type: "bullet", text: "Assassination of an inquisitor in Zaragoza in 1485 increased power of Inquisition, led to 15 mass auto de fes, wealth confiscations of prominent figures eg. Francisco de Santa Fe." },
        { type: "bullet", text: "Church control: 1486 Patronato Real gave monarchs the right to appoint bishops." },
        { type: "bullet", text: "In 1492 Antonio de Nebrija published the first Castilian grammar, and said \"language is the instrument of empire\". Tool for conversion of subjugated peoples." }
    ],
    "Ferdinand and Isabella: Foreign and Dynastic Policy": [
        { type: "bullet", text: "France: 1493 Treaty of Barcelona recovered Cerdagne, Rousillion." },
        { type: "bullet", text: "Italy: Gonzalo de Cordoba 'the Grand Captain' won victors at Cerignola and Garigliano 1503. Ferdinand as king of Naples by 1504." },
        { type: "bullet", text: "Diplomacy: First resident ambassadors in London in 1487. 1489 Treaty of Medina del Campo secured English alliance w/ marriages." },
        { type: "bullet", text: "Atlantic: 1479 Treaty of Alcacovas secured Canaries, conquered by 1496. 1494 Treaty of Tordesillas divided the globe." },
        { type: "bullet", text: "North Africa: Presidios were established. 1497 Melilla, 1505 Mers-el-Kebir, 1509 Oran." },
        { type: "bullet", text: "Navarre: Succession crisis exploited to annexation in 1512. Ferdinand as king. Respected fueros." },
        { type: "bullet", text: "1505 Treaty of Blois: Ferdinand married Germaine de Foix, niece of French king, for securing of Naples and Aragon from France." },
        { type: "bullet", text: "Joanna x Philip the Handsome in 1496." },
        { type: "bullet", text: "Isabella x Manuel I in 1490." },
        { type: "bullet", text: "Maria x Manuel I in 1500." },
        { type: "bullet", text: "Catherine x Arthur in 1501." },
        { type: "bullet", text: "Catherina x Henry VIIII in 1509." },
        { type: "bullet", text: "Columbus voyage in 1492 - cost only 2m maravedis." },
        { type: "bullet", text: "1512 Laws of Burgos - declared natives free, mandated conversion to Catholicism, and regulated labor, though they were poorly enforced and legalised the encomienda system," }
    ],
    "Ferdinand and Isabella: Economics": [
        { type: "bullet", text: "Revenue: 800k reales in 1470 to 22m reales in 1504." },
        { type: "bullet", text: "The 10% sales tax - alcabala - was the biggest contributor to revenue." },
        { type: "bullet", text: "Currency: 1497 pragmatica standardised 375 maravedis as 1 ducat, excelente, principat." },
        { type: "bullet", text: "Mesta: 2.8 million sheep in 1450. Protected by the crown. Special interest represented on the royal council. Lack of agriculture led to reliance on imports and wheat shortage by 1506. Tasa (price fix) on grain in 1502 tried to fight this." },
        { type: "bullet", text: "Debt: Juros (10% interest bonds) given out. Repayment reached 131 million maravedis by 1516." },
        { type: "bullet", text: "1494 Consulado of Burgos gave the city a monopoly on the wool trade." },
        { type: "bullet", text: "1503 Casa de Contratacion in Seville controlled trade, shipping schedules, etc... Seville given sole right to New World. Trade volume increased from 300 toneladas in 1504 to 5000 toneladas in 1516." },
        { type: "bullet", text: "Tolls: 1480 exemption for merchants. 1497 exemption for Carter's guild. Corruption. Nobles took tolls but didn't fix bridges." },
        { type: "bullet", text: "1511 enquiry found roads in poor quality, 12 bridges swept away and not rebuilt." },
        { type: "bullet", text: "Expulsion of Jews harmed silk and cloth industries despite short term gain." },
        { type: "bullet", text: "Aragon contributed less than 20% of what Castile contributes." }
    ],
    "Charles V: Consolidation of Royal Authority and Revolts": [
        { type: "bullet", text: "Accession: \"foreign king\". Resentment at early Burgundian appointments eg. Chievres placed his 20 y.o. nephew as Archbishop of Toledo." },
        { type: "bullet", text: "1518-19 Cortes: promised to learn Castilian, respect fueros, etc." },
        { type: "bullet", text: "1519 HRE election: Cost 852k florins. Partially funded by servicios from Cortes of Santiago and Coruna in exchange for Hispanization." },
        { type: "bullet", text: "1520-21 Comuneros: Urban uprising due to high taxes, foreigners, corregidor abuses. Toledo, Segovia. Led by Juan de Padilla. Radicalised by burning of Medina del Campo 1520 on orders of Charles. Failed to get Joanna the Mad's support." },
        { type: "bullet", text: "April 1521 Battle of Villalar: Revolt crushed by nobles. Leaders executed. Last strongholds fell in October 1521. 22 executed." },
        { type: "bullet", text: "1519-21 Germania: Merchants and artisan guilds who held grievances over economic hardship. Limited to Valencia. Council of 13 germanias. Turned radical by Vicente Peris. Attacks on noble estates, forced baptism of mudejars. Main revolt stopped in 1521, holdouts until 1522 by \"The Hidden\" who tuned revolt more spiritual. Majorca until 1523." },
        { type: "bullet", text: "Resolution: Hispanization. Learned Castilian, increased Spanish appointments, married Isabella in 1526." },
        { type: "bullet", text: "Returned in 1522 with 4000 mercenaries." },
        { type: "bullet", text: "All cortes deputies required to have poderes (full powers)." }
    ],
    "Charles V: Government and Administration": [
        { type: "bullet", text: "Conciliar system exanded. 1522 war, 1523 finance, 1524 indies, 1526 state. Los Cobos secretary of finance for 30yrs." },
        { type: "bullet", text: "Consulta standardised conciliar system with council debata leading to consulta, approved or rejected by the king." },
        { type: "bullet", text: "Mercurino Gattinara grand chancellor until 1530. No new grand chancellor appointed, split between los Cobos (finance) and Granvelle (foreign policy)." },
        { type: "bullet", text: "Cortes met 15 times. 1538 Cortes of Toledo nobles refused sisa (food tax). Thereafter, only town deputies summoned." },
        { type: "bullet", text: "1523: Pope granted permanent mastership of the military oders." },
        { type: "bullet", text: "1543: State archive established at Simancas." },
        { type: "bullet", text: "1543: Philip as regent, aged 16. Guided by junta including Cardinal Tavera, de los Cobos. Lasted for 14yrs during Charles' absence." },
        { type: "bullet", text: "Itinerant court continued." },
        { type: "bullet", text: "Letrados dominated." }
    ],
    "Charles V: Foreign Policy": [
        { type: "bullet", text: "\"Plus Oultre\" motto." },
        { type: "bullet", text: "France: Francis I captured at 1525 Battle of Pavia. 1529 Peace of Cambrai confirmed Spanish dominance in Italy." },
        { type: "bullet", text: "Portugal: 1529 Treaty of Zaragoza sold Moluccas claim to Portugal for 350k ducats." },
        { type: "bullet", text: "HRE: 1532 Peace of Nuremberg was a temporary truce with Lutherans so Charles could focus on Ottoman threat. 1547 Battle of Muhlberg defeated Schmalkaldic League but forced into embarrasing 1555 Peace of Augsburg." },
        { type: "bullet", text: "Ottomans: 1529 Siege of Vienna was victory over 100k Ottomans. Charles led 1535 Tunis expedition with 60k men. But 1541 Algiers was a catastophic failure with 150 ships lost." },
        { type: "bullet", text: "England: 1522 Treaty of Windsor continued English alliance, 1554 Philip x Mary Tudor." }
    ],
    "Charles V: Economics": [
        { type: "bullet", text: "Revenue: Still mostly Castile and New World." },
        { type: "bullet", text: "Church contributed approx. 25% of revenue." },
        { type: "bullet", text: "1534 Cortes of Madrid established encabezamiento. Annual lump sum instead of alcabala." },
        { type: "bullet", text: "1536-54: alcabala increased by 22% but prices by 33%. Crown real income reduced." },
        { type: "bullet", text: "Servicios tripled in yield, became more like regular tax rather than special tax." },
        { type: "bullet", text: "Servicio y montazgo: new tax on sheep." },
        { type: "bullet", text: "1516-60: 11.9m ducats from Americas." },
        { type: "bullet", text: "Partially result of Potosi 1545 and Zacatecas 1548." },
        { type: "bullet", text: "1554 mercury amalgamation was new process to extract silver ore." },
        { type: "bullet", text: "1543 almojarifazgo mayor: 5% customs duty on bullion via Sevilla." },
        { type: "bullet", text: "Military spending was biggest expense." },
        { type: "bullet", text: "Burgundian-style court cost 200k ducats/yr. with 762 people." },
        { type: "bullet", text: "502 asientos (short-term loans) negotiated, with Charles borrowing 28.8m ducats." },
        { type: "bullet", text: "Interest rates rose from 17.6% in the 1520s to 48.8% by the 1550s." },
        { type: "bullet", text: "1544: massive debts of 3.1m ducats. 1000 hidalgos auctioned to raise money." },
        { type: "bullet", text: "1540s: desperate measures eg. seizing all private treasure imported to fund Muhlberg." },
        { type: "bullet", text: "Selling public offices weakened crown jurisdiction in the long term." },
        { type: "bullet", text: "Fuggers lent 543k florins and Welsers another 143k florins for HRE. Gained shipping and permits for Americas - Welsers colonised Venezuela." },
        { type: "bullet", text: "Andalusia: wheat +109%, oil +197%, wine +655%. 1511-56" },
        { type: "bullet", text: "Valladolid: wheat +44%, land +86%, wages +33%. 1511-56" },
        { type: "bullet", text: "Scholars like Azpilcueta 1556 first to devise quantity theory of inflation." },
        { type: "bullet", text: "1556: 37m ducats of debt. Bankrupt by 1557. Total failure." }
    ],
    "Charles V: New World": [
        { type: "bullet", text: "1519-21: Cortes with 600 men conquered the Aztecs." },
        { type: "bullet", text: "1532: Pizzaro (pig farmer) with 160 men conquered Incas in Peru." },
        { type: "bullet", text: "1535: Viceroyalty of New Spain (Mexico) established." },
        { type: "bullet", text: "1542: Viceroyalty of Peru established." },
        { type: "bullet", text: "1542: New Laws tried to protect Indians, but with limited influence." },
        { type: "bullet", text: "1544-48: Gonzalo Pizarro rebellion in Peru against New Laws." },
        { type: "bullet", text: "1545: Potosi." },
        { type: "bullet", text: "1546: Zacatecas." },
        { type: "bullet", text: "1554: Mercury amalgamation. New process to extract silver ore." },
        { type: "bullet", text: "1550s: Royal fifth made up 15% of crown income." }
    ],
    "Charles V: Religious Policy": [
        { type: "bullet", text: "\"Plus Oultre\" motto partially symbolised 'Herculean task' of spreading Christianity." },
        { type: "bullet", text: "Limpieza de sangre still used to bar conversos and descendants from office." },
        { type: "bullet", text: "Inquisition began to use tortures. 1547 new Inquisitor General (Valdes) prosecuted moral crimes eg. bigamy." },
        { type: "bullet", text: "Episocpal standards increased eg. with uni training." },
        { type: "bullet", text: "Uni of Alcala became centre of religious innovation eg. 1522 Polyglot Bible." },
        { type: "bullet", text: "1523 Papal Bull confirmed 1486 Patronato Real." },
        { type: "bullet", text: "Poor Papal relations. 1527 Sack of Rome by unpaid mercenaries captured the Pope." },
        { type: "bullet", text: "1534 Ignatius Loyala established Jesuits. Observant." },
        { type: "bullet", text: "1545-63 Council of Trent affirmed Latin Vulgate, Catholic doctrine, etc." },
        { type: "bullet", text: "In retirement, Charles became religious fanatic and advocated extreme violence against protestants." },
        { type: "bullet", text: "1521 Diet of Worms against Luther presided over by Charles. Implicated high ranking people eg. Cazalla (court preacher)." },
        { type: "bullet", text: "Erasmus translated to Castilian in 1526. Charles liked, but by 1533 Inquisition equated Erasmianism with Lutheranism." },
        { type: "bullet", text: "As soon as Charles left Spain, humanists like Juan de Vergara arrested." },
        { type: "bullet", text: "Germania revolt did forced baptims of Muslims. In 1525, Charles banned Islam in Spain. In 1526, admited to Pope conversions were not sincere." },
        { type: "bullet", text: "1526 visit to Granada: \"27 years since their conversions and there are not even 27 Christians\"." },
        { type: "bullet", text: "1526: 80k ducats subsidy, in other areas 20k ducats annual \"farda\" tax from Moriscos to be tolerated by Charles eg. keep traditional dress." },
        { type: "bullet", text: "In Aragon, 60k ducats to be ignored for 40yrs (concordia) in 1528. Still suspected as \"fifth column\"." }
    ],
    "Philip II - Government and Royal Authority": [
        { type: "bullet", text: "Paper king: micromanaged from El Escorial. Signed up to 400 documents in one morning." },
        { type: "bullet", text: "1561 Madrid became the capital." },
        { type: "bullet", text: "1563-84 building of El Escorial also micromanaged by Philip II." },
        { type: "bullet", text: "1567 Nueva Recopilación codified laws of Castile." },
        { type: "bullet", text: "14 councils by 1584 eg. Italy 1559, Portugal 1582." },
        { type: "bullet", text: "Shift to juntas after 1585 to improve efficiency and eliminate bottlenecks eg. Junta de la Noche." },
        { type: "bullet", text: "Secretaries: Antonio Perez was the most influential until his arrest in 1579." },
        { type: "bullet", text: "12 cortes summoned for servicios. Milliones food tax for Armada 1588 became permanent." },
        { type: "bullet", text: "1581 Cortes of Tomar: Philip as king of Portugal. Promised to uphold local laws and appointments." },
        { type: "bullet", text: "1592 Cortes of Tarazona allowed foreign viceroys and majority voting rather than unanimous consent." },
        { type: "bullet", text: "Letrados and secretaries - selected papers for king to read; Juan de Idiáquez withheld letter from Duke of Medina Sidonia where he attempted to decline command of the Armada." },
        { type: "bullet", text: "1590s: only 35% of land in Salamanca and 73/300 towns in Valencia under direct royal jurisdiction." },
        { type: "bullet", text: "Court was simplified eg. Senor instead of His Majesty." },
        { type: "bullet", text: "Castilian Cortes procuradores restricted to entirely petitioning." },
        { type: "bullet", text: "Court factions existed - Alba had the war party and Eboli the peace party. Philip failed to back either one decisively; unnecessary conflict and slow bureaucracy." },
        { type: "bullet", text: "31 March 1578: Juan de Escobedo (secretary of Don John) ambushed and stabbed to death by assassins hired by Pérez. July 1579: Philip ordered arrest of Pérez and Princess of Éboli. Pérez possessed compromising state documents (proving the King ordered hit), Philip spent years alternating between torturing him and treating him leniently to get the papers back." },
        { type: "bullet", text: "Mandatory end-of-term judicial reviews (residencias) improved administration." }
    ],
    "Philip II - Religious Policy": [
        { type: "bullet", text: "Regalism asserted he was 'lord over the Church'; not bound by papal mandates." },
        { type: "bullet", text: "No papal decree published in Spain without prior approval from the Council of Castile." },
        { type: "bullet", text: "Accepted 1564 Council of Trent resolutions but insisted Crown oversee their implementation." },
        { type: "bullet", text: "St Teresa of Ávila founded Discalced Carmelites in the 1580s." },
        { type: "bullet", text: "Philip distrusted the Jesuits (loyal to Rome); attempted to 'nationalise' the order (Inquisiton)." },
        { type: "bullet", text: "Protestant Cells (1557–58) in Seville (130–150 people) and Valladolid (55 people) - panic." },
        { type: "bullet", text: "Protestantism effectively eradicated by 1562 (278 prosecutions, 77 deaths) in autos-de-fé." },
        { type: "bullet", text: "Philip personally attended October 1559 ceremony in Valladolid." },
        { type: "bullet", text: "1558 Censorship Laws: Pragmatica established death penalty for owning/selling unlicensed books. Index of Prohibited Books (1559) issued by Inquisitor General Valdés: banned approximately 700 works, including 14 editions of the Bible and 14 works by Erasmus." },
        { type: "bullet", text: "1559 decree recalled all Spanish students from foreign universities." },
        { type: "bullet", text: "Carranza (1559): Archbishop of Toledo imprisoned for 17 years by Inquisition; Philip appropriated see’s revenues. Luis de León imprisoned for four years (1572–77) for translating Song of Solomon and questioning the Latin Vulgate." },
        { type: "bullet", text: "1560: 85% of those persecuted by the Inquisition were moriscos." },
        { type: "bullet", text: "1563 Edict confiscated Morisco land and banned them from possessing weapons." },
        { type: "bullet", text: "Morisco Edict (1567) forbade Arabic language, Moorish dress, and traditional names, triggering the 1568–70 Alpujarras revolt." },
        { type: "bullet", text: "Alpujarras Outcome: Suppression of the 30,000 rebels by Don John led to the mass dispersal of 80,000–100,000 Moriscos across Castile; 20,000+ died during the winter journey." }
    ],
    "Philip II - Economics": [
        { type: "bullet", text: "1557 Bankruptcy: Philip inherited a massive debt from Charles V estimated at 36 million ducats; he was forced to suspend all payments from the Castilian treasury in January and June 1557. Up to 74 million ducats of debt by 1574." },
        { type: "bullet", text: "High-interest short-term asientos (7 million ducats) converted into long-term juros at a fixed and decreased interest rate of 5 per cent." },
        { type: "bullet", text: "Continued financial instability led to further payment suspensions and debt renegotiations (bankruptcies) in 1560, 1576, and 1596." },
        { type: "bullet", text: "Castilian ordinary revenue tripled during the reign." },
        { type: "bullet", text: "The Millones (1589/90): Introduced following the failure of the Armada to tax basic essentials like meat, wine, oil, and vinegar." },
        { type: "bullet", text: "It collected 8 million ducats in its first 10 years and became a permanent tax." },
        { type: "bullet", text: "By the 1590s, clerical revenues accounted for 20 per cent of Crown income. The Three Graces: Key clerical taxes included: the Cruzada (yield quadrupled), the Subsidio (made permanent in 1561), the Excusado (granted in 1567 by Pope Pius V to fund the army in the Low Countries)." },
        { type: "bullet", text: "Bullion imports from America tripled by the 1590s, with a total of 65 million ducats received between 1555 and 1600." },
        { type: "bullet", text: "Suppressing the Netherlands revolt (1567–1600) cost approximately 80 million ducats." },
        { type: "bullet", text: "The 1588 Armada cost 10 million ducats." },
        { type: "bullet", text: "The Battle of Lepanto cost the Castilian exchequer 5 million ducats." },
        { type: "bullet", text: "Total Debt accumulated to roughly 85 million ducats by 1598, with interest payments consuming half of revenue." }
    ],
    "Philip II - Revolts": [
        { type: "heading", text: "Second Alpujarras Revolt" },
        { type: "bullet", text: "1560: 85% of those persecuted by the Inquisition were moriscos." },
        { type: "bullet", text: "1563 Edict confiscated Morisco land and banned them from possessing weapons. Confiscation of 100,000 hectares." },
        { type: "bullet", text: "Export of Moriscan silk banned." },
        { type: "bullet", text: "1567 Royal Edict forbade Arabic language, Moorish dress, and traditional dances like the zambra. Marquis of Mondejar advised Philip not to do this but he ignored." },
        { type: "bullet", text: "A rebel army of 30,000 was led by Aben Humeya (Fernando de Válor); it was suppressed with extreme brutality by Don John of Austria who brought 12k (later up to 25k) men. Tercio veterans." },
        { type: "bullet", text: "December 1568: Ugíjar Massacre - Moriscos killed 240 Old Christians." },
        { type: "bullet", text: "Siege of Galera (1570): Royal forces razed the village and slaughtered 2,500 inhabitants. Many atrocities comitted." },
        { type: "bullet", text: "Between 80,000 and 100,000 Granadan Moriscos were forcibly deported across Castile." },
        { type: "bullet", text: "20,000+ died during the winter journey." },
        { type: "bullet", text: "84 new forts were built to protect the Granada coast; the Council of State advised general expulsion as early as 1581." },
        { type: "bullet", text: "Agricultural output of Granada declined. Resettled by Christians who were unfamiliar how to cultivate the land." },
        { type: "heading", text: "Aragon Revolt" },
        { type: "bullet", text: "The Ribagorza affair led to Philip II occupying the county in 1591. This involved sending troops into Valencia in 1582. Also, a non-native viceroy was appointed. Aragonese argued this was all against fueros." },
        { type: "bullet", text: "Perez escaped to Zaragoza in April 1590, claiming the right of manifestacion (protection) from the Justiciar." },
        { type: "bullet", text: "Zaragoza Riots (1591): Mobs attacked the Inquisition prison to stop Pérez’s transfer; the Viceroy Almenara was fatally wounded." },
        { type: "bullet", text: "1591 Invasion: Philip sent 14,000 soldiers under Alonso de Vargas to restore order; a small rebel force of 2,000 dispersed. The rebels only ever occupied Zaragoza. Most of Aragon did not join." },
        { type: "bullet", text: "Repression: The Justiciar Juan de Lanuza was beheaded without trial; 150 leaders were executed." },
        { type: "bullet", text: "Tarazona Cortes (1592): Philip secured the right to dismiss the Justiciar at will, appoint non-native (Castilian) viceroys, and pass laws by majority vote." }
    ],
    "Philip II - Foreign Policy (not Netherlands)": [
        { type: "heading", text: "General Strategy" },
        { type: "bullet", text: "Realism: Abandoned 'universal monarchy' to focus on preserving inheritance and defending Catholicism." },
        { type: "bullet", text: "Cost of War: By the 1570s, military campaigns cost the government 700,000 ducats per month." },
        { type: "bullet", text: "1571 Costs: In 1571, the Dutch and Mediterranean campaigns cost 18.5 million ducats." },
        { type: "bullet", text: "In the final decade of his reign, 30 million ducats in France and 21 million in the Low Countries." },
        { type: "heading", text: "France" },
        { type: "bullet", text: "Early Hostilities: Henry II renewed hostilities to gain Italian territories, but financial exhaustion led to a truce at Vaucelles." },
        { type: "bullet", text: "1557/1559 Victories: 1557 victory at Battle of St Quentin; 1559 Treaty of Cateau-Cambrésis confirmed Spanish hegemony in Italy." },
        { type: "bullet", text: "1590s Interventions: Philip intervened in Wars of Religion; diverted Duke of Parma from Netherlands to aid Catholic League against Henry of Navarre. In 1590, Henry IV defeated the Catholic League at the Battle of Ivry." },
        { type: "bullet", text: "Financial Drain: Between 1590 and 1594, 75% of the Low Countries' military treasury was spent on French expeditions and subsidies for the Catholic League." },
        { type: "bullet", text: "Turning the Tide: In 1593, Henry IV converted to Catholicism, and in 1594 he regained control of Paris." },
        { type: "bullet", text: "Mixed Territorial Results: Between 1595-1597, Spain temporarily gained Calais and Amiens but lost Toulouse and Marseilles due to overstretched forces." },
        { type: "bullet", text: "Failed Succession: Philip's attempt to install the Infanta Isabella failed due to French adherence to Salic Law and a nationalistic backlash." },
        { type: "bullet", text: "1598 Treaty of Vervins: War ended by restating 1559 terms; Spain returned most conquests." },
        { type: "heading", text: "The Ottoman Empire & Mediterranean" },
        { type: "bullet", text: "1560 Djerba Disaster: 28 galleys sunk and 10,000–18,000 troops lost. The fleet lost 42 vessels in total, and Spanish veterans had to be withdrawn from the Netherlands to strengthen Mediterranean defenses." },
        { type: "bullet", text: "Naval Expansion: Massive shipbuilding programme (1560–74) constructed 300 galleys at a cost of over 3.5 million ducats." },
        { type: "bullet", text: "1565 Siege of Malta: 9,000 Knights held out against 30,000 Ottomans for four months until García de Toledo's relief force arrived." },
        { type: "bullet", text: "7 Oct 1571 Battle of Lepanto: Holy League victory; 206 galleys liberated 12,000 Christian rowers and killed 30,000 Turks. The Christian fleet included 80 Spanish galleys." },
        { type: "bullet", text: "Lepanto Ottoman Losses: Over 210 Turkish ships were lost, with 117 galleys and 10 galliots captured in good enough condition for future use by Christian forces." },
        { type: "bullet", text: "Lepanto Costs: The campaign cost 1,100,000 ducats, of which 400,000 came from the Italian kingdoms." },
        { type: "bullet", text: "1580 Truce: Philip signed a formal truce with Sultan Selim II to focus on Atlantic and northern Europe." },
        { type: "heading", text: "Portugal" },
        { type: "bullet", text: "1580 Invasion: Following King Sebastian’s 1578 death at Alcazarquivir, the Duke of Alba invaded to unite the Iberian Peninsula." },
        { type: "bullet", text: "1581 Tomar Cortes: Philip proclaimed King; swore to respect fueros, use native officials, and keep separate trade monopolies." },
        { type: "heading", text: "England" },
        { type: "bullet", text: "English Alliance: 1554 marriage to Mary Tudor intended to encircle France; cordiality ended with accession of Elizabeth I." },
        { type: "bullet", text: "Early Tensions: 1568 confiscation of Genoese treasure ships. The 1567 arrival of the Duke of Alba in the Netherlands seriously affected Anglo-Spanish relations." },
        { type: "bullet", text: "Piracy and Smuggling: English merchants smuggled and committed piracy; during his 1576-1581 circumnavigation, Francis Drake seized large quantities of Spanish treasure with Elizabeth's unofficial support." },
        { type: "bullet", text: "Catholic Plots: The 1583 Throckmorton Plot was uncovered by Francis Walsingham, leading to Throckmorton's execution in May 1584. This was followed by the Babington Plot in 1586." },
        { type: "bullet", text: "1587 Attack on Cadiz: On April 19, 1587, Drake arrived at Cadiz and over two days looted, burned, or sank approximately 30 Spanish ships. Drake also destroyed Portuguese ships carrying barrel materials for the Armada's food supplies and captured the treasure ship San Felipe." },
        { type: "bullet", text: "1588 Spanish Armada: 130 ships commanded by Medina Sidonia; failure cost 15,000 men. The Armada cost about 10,000,000 ducats, with Castile contributing around 70%. Furthermore, the campaign cost about 900,000 ducats a month." }
    ],
    "Philip II - Dutch Revolt": [
        { type: "heading", text: "Phase 1: 1555-1567" },
        { type: "bullet", text: "1555-1559: Spent majority of time in Netherlands. Therefore, knew the difficulties." },
        { type: "bullet", text: "1556: States-General refused Philip’s taxes eg. 1% on real-estate." },
        { type: "bullet", text: "August 1557: Refused subsidies again." },
        { type: "bullet", text: "January 1559: Assembly voted for ‘nine years aid’ of 3.6m ducats." },
        { type: "bullet", text: "August 1559: Philip II permanently departs the Netherlands for Spain. Margaret of Parma as Regent but real power is wielded by inner circle led by Granvelle, alienating high Dutch nobility like Orange and Egmont." },
        { type: "bullet", text: "1559–1561: 14 new bishoprics and Crown given power to appoint bishops. Enrages the nobility (who lose patronage) and terrifies populace (who view it as first step to Inquisition)." },
        { type: "bullet", text: "1561-1564: Concessions made, eg. stopped church reform, dismissed Granvelle after ultimatum from Orange and Egmont." },
        { type: "bullet", text: "17 October 1565: Letters from the Segovia Woods refused Egmont’s religious concessions which he had petitioned for in Madrid. Slow response due to ‘headaches’ according to Philip but in reality waiting for situation in Malta and stalling." },
        { type: "bullet", text: "April 1566: Roughly 400 lesser nobles petition Margaret of Parma demanding suspension of heresy laws." },
        { type: "bullet", text: "5 April 1566: 300 troops forced Margaret to rescind heresy laws." },
        { type: "bullet", text: "31 July 1566: Philip agreed to abolish the Inquisition and pardon the rebels but did not arrive until October." },
        { type: "bullet", text: "August 1566: Iconoclastic Fury. Mobs sweep across the Netherlands, smashing statues, altars, and stained glass." },
        { type: "bullet", text: "May 1567: Revolt suppressed but Philip did not know and had already sent Alba with 72k troops. He thought it was too volatile for him to visit personally." },
        { type: "heading", text: "Phase 2: 1567-1574" },
        { type: "bullet", text: "August 1567: Arrival of the Duke of Alba. Margaret of Parma resigns in protest of his extreme methods." },
        { type: "bullet", text: "September 1567: Alba establishes the Council of Troubles; ignores standard legal privileges, executes over 1,000 people and confiscates massive amounts of property." },
        { type: "bullet", text: "May 1568: A rebel army led by Orange's brother defeats Spanish force, though little strategic gain." },
        { type: "bullet", text: "June 1568: Alba beheads the Counts of Egmont and Hoorn in Brussels. Turns moderate Catholics against the Spanish regime." },
        { type: "bullet", text: "March 1569: Alba proposed Tenth Penny sales tax. Refused by States-General, instead given 4m florins over two years." },
        { type: "bullet", text: "31 July 1571: alba implemented the tax anyway. Brought Netherlands to brink of revolt." },
        { type: "bullet", text: "April 1572: Capture of Brielle. Sea Beggars capture the coastal town of Brielle. Towns across Holland and Zeeland declare for the rebellion and recognize Orange as their leader." },
        { type: "bullet", text: "1572: Medinaceli reported to Philip that Alba was the reason for revolt." },
        { type: "bullet", text: "January 1573: Alba recalled to Spain due to his failure to crush the Holland/Zeeland rebellion (even though otherwise successful). He is replaced by Requesens." },
        { type: "bullet", text: "October 1574: Dutch rebels flood the countryside, allowing Sea Beggars to sail up to city walls and deliver food." },
        { type: "heading", text: "Phase 3: 1576-1581" },
        { type: "bullet", text: "March 1576: Requesens dies unexpectedly, leaving a power vacuum." },
        { type: "bullet", text: "September 1576: Don John appointed as governor." },
        { type: "bullet", text: "3 November 1576: The Spanish Fury. Army mutinies and sacks Antwerp, slaughtering around 7,000 citizens." },
        { type: "bullet", text: "8 November 1576: Pacification of Ghent. All Seventeen Provinces sign a treaty uniting them against Spanish." },
        { type: "bullet", text: "February 1577: Perpetual Edict. Don John accepted Pacification of Ghent. Spanish troops begin to leave but Orange refuses to cooperate, so Don John brings troops back." },
        { type: "bullet", text: "July 1577: Parma appointed as military leader. States-General fled north." },
        { type: "bullet", text: "October 1578: Parma succeeds as governor." },
        { type: "bullet", text: "January 1579: The Revolt Splits. Union of Arras: The southern, Catholic provinces reconcile with Spain, fearing Calvinist radicalism. Union of Utrecht: Northern provinces form a military alliance to continue fight." },
        { type: "bullet", text: "March 1580: Philip II issues an imperial ban, placing a massive bounty on the head of William of Orange, declaring him an outlaw." },
        { type: "bullet", text: "July 1581: Act of Abjuration. The northern provinces declare independence, stating that Philip II has violated his contract with his subjects and is no longer their sovereign." },
        { type: "heading", text: "Phase 4: 1584-1594" },
        { type: "bullet", text: "10 July 1584: Assassination of William of Orange." },
        { type: "bullet", text: "1585: Only Holland and Zeeland remained in revolt. Parma very successful." },
        { type: "bullet", text: "August 1585: Parma starves Antwerp into submission. Dutch blockade Scheldt River, permanently ruining Antwerp's economy and shifting trade power to Amsterdam." },
        { type: "bullet", text: "August 1585: Treaty of Nonsuch. Elizabeth I enters the war, sending troops and funds." },
        { type: "bullet", text: "1587: Parma withdrawn from the Dutch campaign to join Armada. Mistake." },
        { type: "bullet", text: "1588: Defeat of the Spanish Armada. Philip II diverts Parma’s army to prepare for the invasion of England." },
        { type: "bullet", text: "1588: Mutinies in Parma’s army and resistance from Maurice of Nassau." },
        { type: "bullet", text: "1590: Parma sent to France." },
        { type: "bullet", text: "1591: Parma returned against orders, but sent to France and died." },
        { type: "bullet", text: "1592-1594: Mansfelt and Fuentes shared power but hated each other and mismanaged the situation." },
        { type: "bullet", text: "1594: Philip set up Isabella and her husband (eventually Albert of Austria) to rule in his name but essentially independently." }
    ]
};

// --- WOTR NOTES DATA ---
const wotrNotesData = {
    "1450-1458": [
        { type: "bullet", text: "<b>23/02/1447</b> - Death of Humphrey, Duke of Gloucester after he is tried for treason five days prior." },
        { type: "bullet", text: "<b>11/1449</b> - Parliament does not grant Henry VI enough funds to pursue the war with France." },
        { type: "bullet", text: "<b>1450</b> - £372,000 of debt, £38,000 of which is owed to York. English economy bankrupt." },
        { type: "bullet", text: "<b>05/1450</b> - Cade's rebellion." },
        { type: "bullet", text: "<b>02/05/1450</b> - Execution of William de la Pole." },
        { type: "bullet", text: "<b>01/06/1450</b> - Cade's forces capture London. Executed Lord Saye and Sele (treasurer)." },
        { type: "bullet", text: "<b>12/07/1450</b> - Cade's rebellion suppressed. General pardon - over 3000 pardoned." },
        { type: "bullet", text: "<b>09/1450</b> - York's return to England. Abandons Ireland - intent on clearing name. 3000-4000 retainers, defying orders to have small retainer." },
        { type: "bullet", text: "<b>1451</b> - Loss of Gascony." },
        { type: "bullet", text: "<b>01/03/1452</b> - Dartford coup. York forced to swear an oath of allegiance at St Paul’s; retirement to Ludlow." },
        { type: "bullet", text: "<b>1453</b> - Battle of Castilion. Ends English claims in France. Earl of Shrewsbury killed - he was kind of legendary." },
        { type: "bullet", text: "<b>08/1453</b> - Skirmish at Heworth Moor. Clash between the Percy and Neville families returning from a wedding, encouraged Nevilles to join York." },
        { type: "bullet", text: "<b>08/1453</b> - Start of catatonic state." },
        { type: "bullet", text: "<b>10/1453</b> - Birth of Edward of Westminster. Somerset as Godfather." },
        { type: "bullet", text: "<b>23/11/1453</b> - Somerset placed in Tower of London." },
        { type: "bullet", text: "<b>01/1454</b> - Margaret of Anjou plans to become regent." },
        { type: "bullet", text: "<b>02/1454</b> - Very poor attendance at Parliament." },
        { type: "bullet", text: "<b>22/03/1454</b> - Death of John Kemp." },
        { type: "bullet", text: "<b>27/03/1454</b> - Start of protectorate - APPOINTMENTS: Salisbury as Chancellor, Thomas Bourchier as Archbishop of Canterbury" },
        { type: "bullet", text: "<b>15/04/1454</b>: Henry Holland, Duke of Exeter, a staunch Lancastrian who allied with the Percys in northern uprisings, is imprisoned at Pontefract Castle." },
        { type: "bullet", text: "<b>25/12/1454</b> - Catatonic state ends. Recognised son - \"a fair little stud\"." },
        { type: "bullet", text: "<b>30/12/1454</b> - End of protectorate." },
        { type: "bullet", text: "<b>22/05/1455</b> - First Battle of St. Albans. YORKIST VICTORY - Somerset, Northumberland, Clifford killed." },
        { type: "bullet", text: "<b>11/1455</b> - Start of second protectorate. Courtenay-Bonville feud." },
        { type: "bullet", text: "<b>02/1456</b> - End of second protectorate." },
        { type: "bullet", text: "<b>1456</b> - Sir Walter Devereux, a Yorkist ally, marches on castles in Wales with two thousand men and seizes the castles at Carmarthen and Aberystwyth" },
        { type: "bullet", text: "<b>1456</b>: Margaret of Anjou moves her court to Coventry, an area more sympathetic to the Lancastrians than London." },
        { type: "bullet", text: "<b>1457</b> - Pierre de Breze's raid on Sandwich." },
        { type: "bullet", text: "<b>25/03/1458</b> - Loveday parade. York x Anjou, Salisbury x Somerset, Exeter x Warwick hand-in-hand." }
    ],
    "1458-1461": [
        { type: "bullet", text: "<b>25/03/1458</b> – Loveday." },
        { type: "bullet", text: "<b>1458</b> – Clashes between Warwick & Anjou’s retainers" },
        { type: "bullet", text: "<b>23/09/1459</b> – Battle of Blore Heath → YORKIST WIN. Salisbury vs Audley, Dudley. " },
        { type: "bullet", text: "<b>12/10/1459</b> – Rout of Ludford. Andrew Trollope defected." },
        { type: "bullet", text: "<b>10/1459</b> – Flight of the Yorkist leaders. York + Edmund to Ireland. Warwick, Salisbury, March to Calais." },
        { type: "bullet", text: "<b>20/11/1459</b> – Parliament of Devils → 27 Acts of Attainder. Included \"Corruption of Blood\" clause, which disinherited the heirs of the traitors forever. Terrified gentry." },
        { type: "bullet", text: "<b>11/1459</b> - Somerset as Captain of Calais. Warwick refused to surrender post. Warwick resorted to piracy - gained him popularity." },
        { type: "bullet", text: "<b>01/1460</b>: Raid on Sandwich. Yorkist forces from Calais, led by Sir John Dynham, launch a surprise dawn raid on Sandwich, capturing the Lancastrian fleet and taking Richard Woodville, Earl Rivers, in his bed. This secured naval supremacy for the Yorkist invasion later that year." },
        { type: "bullet", text: "<b>04/1460</b> - Newnham Bridge: Warwick beat Somerset." },
        { type: "bullet", text: "<b>10/07/1460</b> – Northampton → YORKIST WIN. Heavy rain fucked up Lancastrian cannons. Buckingham dead." },
        { type: "bullet", text: "<b>09/1460</b> – York’s return → acts in the manner of a king eg. touching throne, trumpeters, arms." },
        { type: "bullet", text: "<b>25/10/1460</b> – Act of Accord. Henry VI king for life; York heir apparent; Prince Edward disinherited." },
        { type: "bullet", text: "<b>30/12/1460</b> – Wakefield → LANCASTRIAN WIN. York, Edmund, Salisbury killed. York's head put on walls of York with paper crown." },
        { type: "bullet", text: "<b>02/02/1461</b> – Mortimer’s Cross → YORKIST WIN. Parhelion as divine symbol. Owen Tudor executed." },
        { type: "bullet", text: "<b>17/02/1461</b> – St. Albans II → LANCASTRIAN WIN. Warwick outflanked by night march tactics." },
        { type: "bullet", text: "<b>04/03/1461</b> – Proclamation of E. IV. Claimed Act of Accord was broken so Henry forfeited crown." },
        { type: "bullet", text: "<b>29/03/1461</b> – Towton → YORKIST WIN. Blizzard fucked up the Lancastrians and helped Yorkist arrows." },
        { type: "bullet", text: "<b>05/04/1461</b> - On Easter Monday, Edward IV enters York in triumph. He removes the heads of his allies and replaces them with Lancastrians." },
        { type: "bullet", text: "<b>28/06/1461</b> – Coronation at Westminster Abbey. Brothers made Clarence, Gloucester." }
    ],
    "1461-1469": [
        { type: "bullet", text: "<b>28/06/1461</b> – Coronation at Westminster Abbey" },
        { type: "bullet", text: "<b>1461</b> - Parliament passed 113 attainders against Edward IV's enemies." },
        { type: "bullet", text: "<b>24/06/1462</b> – Treaty of Chinon → Louis XI supports Anjou. Anjou to surrender Calais. " },
        { type: "bullet", text: "<b>25/10/1462</b> – Pierre de Brézé’s raid of Bamburgh and Dunstanburgh" },
        { type: "bullet", text: "<b>10/1463</b> – E. IV’s diplomatic strategy. Truce with Louis XI (Treaty of Hesdin), no more aid to Lancastrians. Truce with Scotland, no more Henry VI in Edinburgh." },
        { type: "bullet", text: "<b>25/04/1464</b> – Hedgeley Moor → MONTAGUE WIN, Ralph Percy killed." },
        { type: "bullet", text: "<b>05/1464</b> – Marriage to Woodville. Bona of Savoy gone." },
        { type: "bullet", text: "<b>15/05/1464</b> – Hexham → MONTAGUE WIN. Somerset executed." },
        { type: "bullet", text: "<b>29/09/1464</b> - Woodville introduced as Queen of England. Warwick humiliated." },
        { type: "bullet", text: "<b>01/1465</b> – \"Diabolical marriage\" of John Woodville (19) and Katherine Neville (3x widow)" },
        { type: "bullet", text: "<b>26/05/1465</b> - Coronation of Elizabeth Woodville" },
        { type: "bullet", text: "<b>07/1465</b> – Henry VI captured + put in the Tower" },
        { type: "bullet", text: "<b>11/02/1466</b> - Woodville marriages (eg. Katherine x Henry Stafford). Messed up Warwick." },
        { type: "bullet", text: "<b>1466</b> - Private pledge of friendship with the Duke of Burgundy" },
        { type: "bullet", text: "<b>06/1467</b> - Edward to Parliament: \"I will live upon mine own\". Acts of Resumption - reclaiming royal lands." },
        { type: "bullet", text: "<b>12/06/1467</b> – Jousting match (Anthony Woodville v. Antony of Burgundy)" },
        { type: "bullet", text: "<b>1467</b> – George Neville removed as chancellor" },
        { type: "bullet", text: "<b>01/1468</b> - Warwick appears before the king and council at Coventry - hope for reconciliation" },
        { type: "bullet", text: "<b>03/07/1468</b> - Margaret of York x Charles the Bold" },
        { type: "bullet", text: "<b>04/1469</b> – First RoR rebellion" }
    ],
    "1469-1471": [
        { type: "bullet", text: "<b>04/1469</b> – First RoR" },
        { type: "bullet", text: "<b>06/1469</b> – Second RoR. Warwick support!" },
        { type: "bullet", text: "<b>11/07/1469</b> – Clarence x Isabel Neville → secret marriage in Calais" },
        { type: "bullet", text: "<b>12/07/1469</b> - From Calais, Warwick published a manifesto against evil councilors." },
        { type: "bullet", text: "<b>07/1469</b>: Warwick and his supporters cross to England and march on London. The city opens the gates to him. He begins to openly back Robin of Redesdale." },
        { type: "bullet", text: "<b>26/07/1469</b> – Edgecote → Edward IV captured. Herbert-Devon dispute led to Yorkist loss - Devon removed all his troops including archers." },
        { type: "bullet", text: "<b>12/08/1469</b> – Earl Rivers + John Woodville executed by Warwick" },
        { type: "bullet", text: "<b>09/1469</b> – Edward IV released as nobility would not cooperate with Warwick." },
        { type: "bullet", text: "<b>10/1469</b> – Edward IV returns to London surrounded by loyal nobles eg. Gloucester." },
        { type: "bullet", text: "<b>12/03/1470</b> - Lancashire rebellion defeated at Losecote Field. Rebels had 30k men led by Baron Robert Welles, puppet of Warwick. Edward declared Warwick and Clarence traitors." },
        { type: "bullet", text: "<b>20/03/1470</b>: Battle of Nibley Green. A violent clash between Viscount Lisle and Lord Berkeley in Gloucestershire over a disputed inheritance. It is notable for being the very last battle fought in England entirely between the private armies of feudal magnates." },
        { type: "bullet", text: "<b>22/07/1470</b> – Treaty of Angers - Anjou forced Warwick on his knees for 15 mins. Edward x Anne Neville" },
        { type: "bullet", text: "<b>03/10/1470</b> – Restoration of Henry VI + release from Tower. 'Amazed' at turn of events" },
        { type: "bullet", text: "<b>06/10/1470</b> - Warwick, Shrewsbury, and Stanley ride into London and greet Henry VI as their lawful king. A statement is issued announcing this." },
        { type: "bullet", text: "<b>13/10/1470</b> - Henry VI paraded in blue robes given by Warwick. Chronicler: \"Mute as a crowned calf\" " },
        { type: "bullet", text: "<b>03/12/1470</b> – Louis XI declares war on Burgundy - England not followed up on this promise in Angers" },
        { type: "bullet", text: "<b>13/12/1470</b> – Edward of Westminster x Anne Neville made official" },
        { type: "bullet", text: "<b>12/1470</b> – Charles the Bold gives Edward IV 50,000 crowns" },
        { type: "bullet", text: "<b>14/02/1471</b> – Warwick orders Calais garrison to attack Burgundy" },
        { type: "bullet", text: "<b>12/03/1471</b> – Edward IV lands at Cromer. Claimed to only want Dukedom of York. Only 1200 men" },
        { type: "bullet", text: "<b>02/04/1471</b> – Gloucester visits Clarence, who gave 4000 men and defected to Edward" },
        { type: "bullet", text: "<b>11/04/1471</b> -  London opened the gates to Edward IV. Merchants in London thought they would do more favourably under Edward IV’s rule." },
        { type: "bullet", text: "<b>14/04/1471</b> – Barnet - YORKIST VICTORY, Warwick and Montague killed. Night march made Warwick cannons aim too far. Oxford's arms mistaken for sun in splendour due to fog" },
        { type: "bullet", text: "<b>04/05/1471</b> – Tewkesbury. Edward of Westminster killed" },
        { type: "bullet", text: "<b>12/05/1471</b> – Fauconberg attacks London. Burned 60 houses on London bridge. What a twat" },
        { type: "bullet", text: "<b>22/05/1471</b> – Death of Henry VI" },
        { type: "bullet", text: "<b>09/1471</b> – Execution of Fauconberg. Head put on pike on London Bridge looking towards Kent" }
    ],
    "1471-1483": [
        { type: "heading", text: "John de Vere" },
        { type: "bullet", text: "<b>1472</b>: John de Vere raids Calais, supported by George Neville, Archbishop of York." },
        { type: "bullet", text: "<b>26 April 1472</b>: John de Vere arrested for treason." },
        { type: "bullet", text: "<b>September 1473</b>: John de Vere captured St. Michael’s Mount." },
        { type: "bullet", text: "<b>15 February 1474</b>: John de vere captured." },
        { type: "heading", text: "Consolidation" },
        { type: "bullet", text: "<b>June 1471</b>: Gloucester gained lands and offices eg. Warden of the West March, Chief Steward of the Duchy of Lancaster." },
        { type: "bullet", text: "<b>July 1471</b>: Jasper + Henry Tudor escape from Wales to Brittany." },
        { type: "bullet", text: "<b>12 July 1471</b>: Gloucester married Anne Neville, opposed by Clarence. No papal dispensation." },
        { type: "bullet", text: "<b>1471</b>: Hastings installed as Lieutenant of Calais when Earl Rivers wanted job." },
        { type: "bullet", text: "<b>1471-1472</b>: Black Book. £16k to £11k household expenses." },
        { type: "bullet", text: "<b>February 1472</b>: Edward IV tried to split Warwick lands - brothers not appeased." },
        { type: "bullet", text: "<b>October 1472</b>: Parliament grants taxation for an invasion of France. £30k. Benevolences (forced gifts) introduced - these did £22k." },
        { type: "bullet", text: "<b>May 1474</b>: Parliament declared Anne Beauchamp legally dead - inheritance divided. Alarmed gentry." },
        { type: "heading", text: "King’s Great Enterprise" },
        { type: "bullet", text: "<b>11 September 1472</b>: Alliance between England and Brittany." },
        { type: "bullet", text: "<b>February 1474</b>: Truce between England and the Hanseatic League." },
        { type: "bullet", text: "<b>25 July 1474</b>: The Treaty of London between England and Burgundy, provisions for the invasion of France." },
        { type: "bullet", text: "<b>1474</b>: Anglo-Scottish treaty, marriage of Cecily of York to the Scottish heir." },
        { type: "bullet", text: "<b>4 July 1475</b>: England invades France. Edward IV leads campaign, lands at Calais. 12k men." },
        { type: "bullet", text: "<b>14 July 1475</b>: Charles the Bold meets with Edward IV but has no force." },
        { type: "bullet", text: "<b>29 August 1475</b>: The Treaty of Picquigny - financial victory. 75k crowns immediately. 50k crowns per year. 50k crowns ransom for Margaret of Anjou. Pensions for English nobles." },
        { type: "heading", text: "Fall of Clarence" },
        { type: "bullet", text: "<b>22 December 1476</b>: Death of Isabel Neville." },
        { type: "bullet", text: "<b>April 1477</b>: Clarence arrests Ankarette Twynyho, John Thursby, and Roger Tocoats for poisoning wife and son. Twynyho and Thursby executed." },
        { type: "bullet", text: "<b>May 1477</b>: John Stacy, astronomer supporting Clarence, arrested and tortured for necromancy. He implicated Thomas Burdett, and Clarence's defence of Thomas Burdett led to..." },
        { type: "bullet", text: "<b>June 1477</b>: Clarence arrested." },
        { type: "bullet", text: "<b>January 1478</b>: Parliament called to pass Attainder against Clarence." },
        { type: "bullet", text: "<b>18 February 1478</b>: Clarence executed." },
        { type: "heading", text: "Later Reign" },
        { type: "bullet", text: "<b>January 1478</b>: Marriage of Anne Mowbray to Richard, Duke of York (son of Edward IV)." },
        { type: "bullet", text: "<b>1478</b>: Breach of the truce on border with Scotland - England threatens war unless reparations." },
        { type: "bullet", text: "<b>May 1480</b>: Gloucester appointed Lieutenant-General of the Realm." },
        { type: "bullet", text: "<b>August 1480</b>: Burning of Bamburgh by the Earl of Angus - town, not castle!" },
        { type: "bullet", text: "<b>June 1481</b>: Lord Howard raided Firth of Forth." },
        { type: "bullet", text: "<b>November 1481</b>: Edward IV returns to London rather than continuing the Scottish campaign personally." },
        { type: "bullet", text: "<b>1482</b>: Arrival of Alexander, Duke of Albany - the disaffected brother of James III - in England." },
        { type: "bullet", text: "<b>1482</b>: Gloucester’s invasion of Scotland. Nobles arrest and imprison James III. Gloucester enters Edinburgh." },
        { type: "bullet", text: "<b>March 1482</b>: Death of Mary of Burgundy, fucked up alliance with Burgundy" },
        { type: "bullet", text: "<b>August 1482</b>: Gloucester captures Berwick-upon-Tweed" },
        { type: "bullet", text: "<b>23 December 1482</b>: The Treaty of Arras. Louis XI of France and Maximilian of Burgundy sign a peace treaty that cuts England out entirely. Louis XI stops paying Edward IV the 50,000 crowns a year agreed upon at Picquigny" },
        { type: "bullet", text: "<b>January 1483</b>: Gloucester given palatinate powers in the north." },
        { type: "bullet", text: "<b>9 April 1483</b>: Edward IV dies unexpectedly." }
    ],
    "1483-1485": [
        { type: "bullet", text: "<b>9 April 1483</b>: Edward IV dies unexpectedly." },
        { type: "bullet", text: "<b>14 April 1483</b>: News of death of Edward IV reaches Ludlow Castle." },
        { type: "bullet", text: "<b>24 April 1483</b>: Royal party sets off." },
        { type: "bullet", text: "<b>29-30 April 1483</b>: Gloucester, Rivers, Buckingham eat dinner together - Stony Stratford." },
        { type: "bullet", text: "<b>1 May 1483</b>: Gloucester arrests Earl Rivers, Sir Thomas Vaughan, Sir Richard Hawte, and Sir Richard Grey." },
        { type: "bullet", text: "<b>May 1483</b>: Elizabeth seeks sanctuary with children (incl. Dorset) and Lionel, Bishop of Salisbury. Took Great Seal with her." },
        { type: "bullet", text: "<b>4 May 1483</b>: Edward V, Gloucester, Buckingham entered London. " },
        { type: "bullet", text: "<b>10 May 1483</b>: Richard appointed Protector of the Realm." },
        { type: "bullet", text: "<b>13 June 1483</b>: Council meeting is held at the Tower of London. Richard accuses Hastings of treason and he is summarily executed. Within three hours. Beheaded on log of timber to be used for repairs. Symbolism of repairing country." },
        { type: "bullet", text: "<b>16 June 1483</b>: Richard, Duke of York released from sanctuary. Joined Edward V in the Tower of London. Cardinal Bourchier pledged his body and soul to keep Richard safe." },
        { type: "bullet", text: "<b>22 June 1483</b>: Ralph Shaw preaches sermon at St. Paul’s Cross." },
        { type: "bullet", text: "<b>25 June 1483</b>: Execution of Earl Rivers and Sir Richard Grey. Assembly of lords of commons petitions Richard of Gloucester to take the throne." },
        { type: "bullet", text: "<b>26 June 1483</b>: Start of reign." },
        { type: "bullet", text: "<b>6 July 1483</b>: Coronation of Richard III and Anne Neville. Very well attended (as they came for Edward V)." },
        { type: "bullet", text: "<b>Late Summer 1483</b>: Princes in the Tower are seen less frequently and disappear from public view entirely." },
        { type: "bullet", text: "<b>October 1483</b>: Buckingham’s Rebellion breaks out. Gentry class rebels in favor of Henry Tudor. Buckingham joins them. \"Great Water\" (flooding of Severn) prevented Buckingham crossing to England." },
        { type: "bullet", text: "<b>October 1483</b>: Henry Tudor attempted to sail from Brittany - turns back when failed rebellion." },
        { type: "bullet", text: "<b>2 November 1483</b>: Buckingham is captured and executed in Salisbury." },
        { type: "bullet", text: "<b>25 December 1483</b>: Henry Tudor swears an oath at Rennes Cathedral to marry Elizabeth of York." },
        { type: "bullet", text: "<b>23 January 1484</b>: Parliament opens; it passes the Titulus Regius, disinheriting Edward IV’s children. 97 Attainders are passed." },
        { type: "bullet", text: "<b>March 1484</b>: Elizabeth Woodville and her daughters leave sanctuary after Richard III publicly swears an oath to protect them." },
        { type: "bullet", text: "<b>9 April 1484</b>: Edward of Middleham dies suddenly at Middleham Castle. This plunges the royal couple into deep grief." },
        { type: "bullet", text: "<b>July 1484</b>: Richard III officially establishes the Council of the North, headquartered in York." },
        { type: "bullet", text: "<b>21 September 1484</b>: Treaty of Nottingham is signed, establishing a three-year truce between Richard III and King James III of Scotland." },
        { type: "bullet", text: "<b>7 December 1484</b>: Richard III issues a proclamation against Henry Tudor and his supporters." },
        { type: "bullet", text: "<b>16 March 1485</b>: Death of Anne Neville after an illness. Rumours spread that Richard III poisoned her to marry his niece, Elizabeth of York." },
        { type: "bullet", text: "<b>30 March 1485</b>: Richard III publicly denies rumors that he will marry Elizabeth of York away, who is sent from court to Sheriff Hutton Castle." },
        { type: "bullet", text: "<b>1 August 1485</b>: Henry Tudor sets sail from Harfleur, France, with a fleet carrying English exiles and 1800 French mercenaries." },
        { type: "bullet", text: "<b>7 August 1485</b>: Henry Tudor lands at Mill Bay, Milford Haven, in Wales, and begins marching inland, gathering Welsh support." },
        { type: "bullet", text: "<b>21 August 1485</b>: The date to which Henry VII would predate his reign to." },
        { type: "bullet", text: "<b>22 August 1485</b>: The Battle of Bosworth Field. Richard III leads a cavalry charge aimed directly at Henry Tudor but is killed in the fighting. Lord Stanley's late intervention proved decisive. Henry Tudor claims the throne by right of conquest as Henry VII." }
    ],
    "1485-1499": [
        { type: "heading", text: "CONSOLIDATION" },
        { type: "bullet", text: "<b>22 August 1485</b>: The Battle of Bosworth. Richard III leads a cavalry charge aimed directly at Henry Tudor but is killed in the fighting. WIlliam Stanley's late intervention proved decisive. Henry Tudor claims the throne by right of conquest as Henry VII." },
        { type: "bullet", text: "<b>11 October 1485</b>: Henry VII issues a general pardon to former opponents who swear allegiance to him." },
        { type: "bullet", text: "<b>30 October 1485</b>: Coronation of Henry VII at Westminster Abbey." },
        { type: "bullet", text: "<b>7 November 1485</b>: Henry VII’s first Parliament meets. He dates his reign to 21 August 1485, rendering anyone who fought for Richard III a traitor. The Titulus Regius is repealed and Edward IV's children are re-legitimated." },
        { type: "bullet", text: "<b>18 January 1486</b>: Henry VII marries Elizabeth of York." },
        { type: "bullet", text: "<b>19 September 1486</b>: Birth of Arthur Tudor, Prince of Wales, at Winchester." },
        { type: "bullet", text: "<b>25 November 1487</b>: Elizabeth of York is crowned Queen at Westminster Abbey" },
        { type: "heading", text: "LOVELL AND STAFFORD, YORKSHIRE, CORNWALL" },
        { type: "bullet", text: "<b>March - April 1486</b>: The Lovell and Stafford Rebellion; attempt to raise Yorkist uprisings in Yorkshire and Worcestershire." },
        { type: "bullet", text: "<b>23 April 1486</b>: Henry VII arrives in York during his northern royal progress. Rebellions dissipate without a battle." },
        { type: "bullet", text: "<b>11 May 1486</b>: Humphrey Stafford dragged from sanctuary and executed. Thomas is pardoned. Lovell escapes to Burgundy." },
        { type: "bullet", text: "<b>Late 1486</b>: Lambert Simnel emerges in Oxford, tutored by a priest, Richard Simon. They travel to Ireland, claiming Simnel is Earl of Warwick." },
        { type: "bullet", text: "<b>February 1487</b>: Henry VII summons council, parades the real Earl of Warwick through London. Henry VII strips Elizabeth Woodville of her estates and forces into a nunnery." },
        { type: "bullet", text: "<b>5 May 1487</b>: Lincoln lands in Dublin. Backed by Margaret of York, he has 2,000 German mercenaries (Martin Schwartz) to support Simnel." },
        { type: "bullet", text: "<b>24 May 1487</b>: Lambert Simnel is crowned as \"Edward VI\" in Dublin, supported by Irish nobility, notably Gerald Fitzgerald (Earl of Kildare)." },
        { type: "bullet", text: "<b>4 June 1487</b>: Yorkist rebel army lands at Piel Island in Lancashire and begins marching south." },
        { type: "bullet", text: "<b>16 June 1487</b>: The Battle of Stoke Field. Lincoln, Martin Schwartz, and Thomas Fitzgerald are killed. Francis Lovell disappears. Simnel is captured and given a job in the royal kitchens." },
        { type: "bullet", text: "<b>20 April 1489</b>: Outbreak of the Yorkshire Rebellion; anger in northern England over heavy parliamentary taxation levied to defend Brittany." },
        { type: "bullet", text: "<b>28 April 1489</b>: Henry Percy (Northumberland) is murdered by an angry mob led by Robert Chamber at Cock Lodge." },
        { type: "bullet", text: "<b>17 May 1489</b>: Rebels, joined by Sir John Egremont, captured York." },
        { type: "bullet", text: "<b>May 1489</b>: Yorkshire Rebellion suppressed by Surrey. Rober Chamber is executed. Sir John Egremont, flees to Burgundy." },
        { type: "bullet", text: "<b>Jan-Feb 1497</b>: Parliament grants taxation to fund campaign against Scotland. Aggressively collected in Cornwall - corruption; poorest subject supposed to be protected from tax were not in Cornwall." },
        { type: "bullet", text: "<b>May 1497</b>: Rebellion sparks in Cornwall led by Michael Joseph (blacksmith). 6000 peasants plan to march on London and present their grievances. Failure to capture Exeter. Audley joined. Rebels reached Blackheath, aimed to punish councilors eg. John Morton, Reginald Bray." },
        { type: "bullet", text: "<b>17 June 1497</b>: Battle of Deptford Bridge. Henry spread word of battle on 19 June but instead chose 17 June. Lord Daubenay and 8000 men suppressed rebellion. Leaders captured and executed." },
        { type: "heading", text: "WARBECK" },
        { type: "bullet", text: "<b>April-May 1487</b>: Travelled to the Portuguese court. Entered the service of explorer Pero Vaz de Cunha. Made connections with the Bramptons." },
        { type: "bullet", text: "<b>28 June 1491</b>: Prince Henry was born." },
        { type: "bullet", text: "<b>November 1491</b>: Warbeck was declared in Cork to be Richard, Duke of York. Gained the support of the Earl of Desmond, John Atwater, and John Taylor. The latter two were the former mayor of Cork and a Yorkist exile." },
        { type: "bullet", text: "<b>December 1491</b>: Henry VII sent a force to Ireland. Warbeck fled. Example of swift response." },
        { type: "bullet", text: "<b>March 1492</b>: Warbeck arrived in Harfleur. Charles VIII funded his fleet and received him as a prince." },
        { type: "bullet", text: "<b>2 October 1492</b>: Henry VII invaded France with the support of Maximilian. Caused by Charles’ campaigns in Brittany, his distraction in Italy, a need for domestic prestige, opportunism given that the weather would not allow for a long war and so a financially advantageous peace could be sought, and partially by Charles’ financing of Warbeck." },
        { type: "bullet", text: "<b>3 November 1492</b>: The Treaty of Etaples was signed. France agreed to pay £159,000 in annual installments. Charles VIII pledged to expel Warbeck from France and stop harboring any rebels or pretenders to the English throne." },
        { type: "bullet", text: "<b>12 December 1492</b>: Warbeck arrived in the Low Counters greeted by Margaret of Burgundy and Maximilian as supporters. The latter was likely because he was cut out of the Etaples negotiations." },
        { type: "bullet", text: "<b>Spring 1493</b>: Henry VII sent a military expedition to Ireland to assess support for Warbeck. He also stayed in Kenilworth Castle with a standing force while sending out spies. Clearly wary of the threat of Warbeck." },
        { type: "bullet", text: "<b>July 1493</b>: Ambassadors were sent to Margaret’s court. They accused her of plotting against Henry VII and personally insulted her. Consequently a trade embargo was imposed which severely weakened the cloth and wool merchants." },
        { type: "bullet", text: "<b>December 1493</b>: Maximilian became HRE. Warbeck attended the funeral of his father." },
        { type: "bullet", text: "<b>November 1494</b>: Prince Henry was created Duke of York, the title Warbeck claimed." },
        { type: "bullet", text: "<b>January-February 1495</b>: English plotters were put on trial, including the Chamberlain, Sir William Stanley." },
        { type: "bullet", text: "<b>16 February 1495</b>: Stanley confessed and was executed." },
        { type: "bullet", text: "<b>3 July 1495</b>: Warbeck invaded Kent with a force of 1300. The Kentish attacked the rebels, and 150 were killed. Warbeck sailed away." },
        { type: "bullet", text: "<b>July-August 1495</b>: Sieged Waterford, a loyalist town in Ireland with the help of the Earl of Desmond. Henry VII specifically sent Sir Edward Poynings to restore order, and Warbeck was forced to flee to Scotland." },
        { type: "bullet", text: "<b>November-December 1495</b>: Received as a prince by James IV." },
        { type: "bullet", text: "<b>January 1496</b>: Married Lady Katherine Gordon with the permission of James IV and given Falkland Palace as a base." },
        { type: "bullet", text: "<b>February 1496</b>: Intercursus Magnus signed. Trade embargo was lifted under the condition that neither government would support the other’s rebels. Margaret of Burgundy had to support more discretely." },
        { type: "bullet", text: "<b>September 1496</b>: James IV and Warbeck planned an invasion of England. Lord Bothwell informed Henry VII of the plans. Warbeck was to hand over Berwick and pay 50,000 marks towards James IV’s military expenses in exchange for a force to put him on the throne." },
        { type: "bullet", text: "<b>17-18 September 1496</b>: Crossed into England, but not well prepared, and beaten by Lord Neville. The north did not join, which shows Surrey’s success in winning over the north for the Tudors. Warbeck withdrew as he did not want a confrontation with the royal army." },
        { type: "bullet", text: "<b>6 July 1497</b>: Warbeck not welcomed in Scotland by James IV, who believed that Warbeck was damaging his international reputation. James aimed to reach a truce with England where James IV was to marry Margaret, daughter of Henry VII." },
        { type: "bullet", text: "<b>July 1497</b>: Tried to go to Ireland but no support. Had to sail away." },
        { type: "bullet", text: "<b>7 September 1497</b>: Landed in Cornwall - well received. Lord Daubenay sent to confront Warbeck. Warbeck captured St. Michael’s Mount." },
        { type: "bullet", text: "<b>17 September 1497</b>: Attacked Exeter with a force of up to 8000. But no great magnates and Exeter was well defended by Devon. The rebels withdrew and deserted Warbeck." },
        { type: "bullet", text: "<b>21 September 1497</b>: Warbeck took relief in sanctuary but he was handed over and sanctuary was no longer permitted in cases of treason after the Lovell rebellion." },
        { type: "bullet", text: "<b>5 October 1497</b>: Warbeck confessed his impostership in front of Henry VII. He was paraded through London. Over the next year, treated well at court and was allowed to attend banquets." },
        { type: "bullet", text: "<b>9 June 1498</b>: Warbeck escaped from custody." },
        { type: "bullet", text: "<b>18 June 1498</b>: Caught and locked up for life in the Tower of London." },
        { type: "bullet", text: "<b>Summer 1498</b>: Margaret apologised to Henry VII and Warbeck confessed that Margaret was behind his importership. " },
        { type: "bullet", text: "<b>12 February 1499</b>: A young man named Ralph Wulford was hanged after a friar began preaching in Kent that Wulford was the real Earl of Warwick. Arguably catalyst for executions." },
        { type: "bullet", text: "<b>3 August 1499</b>: Plot to free Warbeck and Warwick discovered." },
        { type: "bullet", text: "<b>23 November 1499</b>: Warbeck executed for treason." },
        { type: "bullet", text: "<b>29 November 1499</b>: Warwick executed for treason." },
        { type: "heading", text: "FOREIGN POLICY not related to Warbeck" },
        { type: "bullet", text: "<b>July 1488</b>: French forces invade the independent Duchy of Brittany, escalating the \"Breton Crisis.\" Motivation for H.VII invasion." },
        { type: "bullet", text: "<b>28 July 1488</b>: Battle of Saint-Aubin-du-Cormier. The French decisively defeat the Breton army. Edward Woodville, Lord Scales (brother to Elizabeth Woodville), who had defied Henry VII to lead a small force of 400-700 English volunteers to aid Brittany, is killed in the fighting." },
        { type: "bullet", text: "<b>14 February 1489</b>: The Treaty of Redon is signed with Anne of Brittany. England agrees to send a force of 6,000 troops to defend Brittany." },
        { type: "bullet", text: "<b>26 March 1489</b>: The Treaty of Medina del Campo establishes mutual defense, reduces tariffs, and arranges Arthur x Catherine of Aragon." },
        { type: "bullet", text: "<b>January - February 1490</b>: Parliament meets to grant funds for the war in Brittany and standardise weights and measures across the realm." },
        { type: "bullet", text: "<b>11 September 1490</b>: The Treaty of Woking between England, Spain, and Maximilian I. It is designed to curb French expansionism." }
    ]
};

function getBulletsForCategory(category) {
    if (spainNotesData[category]) return spainNotesData[category];
    if (wotrNotesData[category]) return wotrNotesData[category];
    return [{ type: 'bullet', text: `Key point 1 for ${category}` }];
}

// Format the names nicely for the sidebar buttons
function formatCategoryText(cat) {
    if (cat.includes(': ')) {
        const [monarch, title] = cat.split(': ');
        return `${monarch}:<br><b>${title}</b>`;
    } else if (cat.includes(' - ')) {
        const [monarch, title] = cat.split(' - ');
        return `${monarch}:<br><b>${title}</b>`; 
    }
    return `<b>${cat}</b>`; 
}

function setupNotesSidebar(categories, containerId, prefix) {
    const container = document.getElementById(containerId);
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn'; 
        btn.innerHTML = formatCategoryText(cat);
        btn.onclick = () => loadBullets(cat, prefix);
        container.appendChild(btn);
    });
}
setupNotesSidebar(spainCats, 'spain-categories', 'spain');
setupNotesSidebar(wotrCats, 'wotr-categories', 'wotr');

// Load notes into the viewer (distinguishing between headings and clickable bullets)
function loadBullets(category, prefix) {
    document.getElementById(`${prefix}-notes-title`).textContent = category;
    const list = document.getElementById(`${prefix}-bullet-list`);
    list.innerHTML = '';
    
    // Hide the notes panel when a new category is selected
    document.getElementById(`${prefix}-notes-panel`).style.display = 'none';
    
    getBulletsForCategory(category).forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = item.text;
        
        if (item.type === 'heading') {
            li.style.fontWeight = 'bold';
            li.style.marginTop = '15px';
            li.style.listStyleType = 'none';
            li.style.marginLeft = '-20px'; 
        } else {
            li.style.cursor = "pointer"; 
            li.style.marginBottom = "8px";
            li.onclick = () => loadNoteData(category, index, prefix);
        }
        
        list.appendChild(li);
    });
}

// Save/Load Personal Notes Logic
let activeNote = { prefix: null, category: null, index: null };
async function loadNoteData(category, index, prefix) {
    activeNote = { prefix, category, index };
    
    // Show the panel now that a specific bullet point is selected
    document.getElementById(`${prefix}-notes-panel`).style.display = 'flex';
    
    const textarea = document.getElementById(`${prefix}-personal-notes`);
    if (!currentUser) return textarea.value = "Sign in to view/save notes.";
    const snap = await getDoc(doc(db, "users", currentUser.uid, "notes", `${prefix}_${category}_${index}`));
    textarea.value = snap.exists() ? snap.data().text : "";
}

document.getElementById('save-spain-notes').onclick = () => saveNoteData('spain');
document.getElementById('save-wotr-notes').onclick = () => saveNoteData('wotr');
async function saveNoteData(prefix) {
    if (!currentUser || activeNote.prefix !== prefix) return alert("Please sign in and select a point.");
    const textarea = document.getElementById(`${prefix}-personal-notes`);
    await setDoc(doc(db, "users", currentUser.uid, "notes", `${prefix}_${activeNote.category}_${activeNote.index}`), { text: textarea.value });
    alert("Note saved!");
}

// --- ESSAYS & SOURCES/EXTRACTS LOGIC ---
const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];
const currentQ = { spain: null, wotr: null };

function generateQuestionButtons() {
    years.forEach(year => {
        if (year !== 2021) {
            document.getElementById('spain-essay-list').appendChild(createBtn(year, 1, 1, 'Extract', 'spain'));
            for(let i=2; i<=4; i++) document.getElementById('spain-essay-list').appendChild(createBtn(year, 1, i, 'Essay', 'spain'));
        }
        document.getElementById('wotr-essay-list').appendChild(createBtn(year, 2, 1, 'Source', 'wotr'));
        for(let i=2; i<=4; i++) document.getElementById('wotr-essay-list').appendChild(createBtn(year, 2, i, 'Essay', 'wotr'));
    });
}

function createBtn(year, paper, qNum, type, prefix) {
    const btn = document.createElement('button');
    btn.className = 'category-btn'; 
    const typeLabel = type === 'Essay' ? '' : ` (${type})`;
    btn.textContent = `${year} - Q${qNum}${typeLabel}`;
    btn.onclick = () => loadQuestionViewer(year, paper, qNum, type, prefix);
    return btn;
}
generateQuestionButtons();

async function loadQuestionViewer(year, paper, qNum, type, prefix) {
    currentQ[prefix] = `${year}.${paper}.${qNum}`;
    document.getElementById(`${prefix}-question-title`).textContent = `${year} Question ${qNum} (${type})`;
    
    const imgViewer = document.getElementById(`${prefix}-question-img`);
    const textViewer = document.getElementById(`${prefix}-question-text`);

    if (type === 'Extract' || type === 'Source') {
        imgViewer.src = `past_questions/${year}.${paper}.${qNum}.png`;
        imgViewer.className = 'img-portrait'; 
        imgViewer.style.display = 'block'; 
        textViewer.style.display = 'none';
    } else {
        imgViewer.style.display = 'none'; 
        textViewer.style.display = 'block'; 
        textViewer.textContent = "Loading...";
        try { 
            textViewer.innerText = await (await fetch(`past_questions/${year}.${paper}.${qNum}.txt`)).text(); 
        } catch (e) { 
            textViewer.innerText = `Error: Missing file past_questions/${year}.${paper}.${qNum}.txt`; 
        }
    }

    const checkbox = document.getElementById(`${prefix}-mark-complete`);
    checkbox.checked = false; 
    document.getElementById(`${prefix}-rich-text`).innerHTML = "";
    document.getElementById(`${prefix}-struct-intro`).value = "";
    document.getElementById(`${prefix}-struct-conc`).value = "";
    document.getElementById(`${prefix}-struct-boxes`).innerHTML = "";

    const planBtn = document.getElementById(`${prefix}-btn-struct`);
    if (type === 'Extract' || type === 'Source') {
        planBtn.style.display = 'none';
        document.getElementById(`${prefix}-free-editor`).style.display = 'block';
        document.getElementById(`${prefix}-struct-editor`).style.display = 'none';
        document.getElementById(`${prefix}-essay-list`).style.display = 'block';
        document.getElementById(`${prefix}-notes-picker`).style.display = 'none';
    } else {
        planBtn.style.display = 'inline-block'; 
    }

    if (currentUser) {
        const compSnap = await getDoc(doc(db, "users", currentUser.uid, "completed", currentQ[prefix]));
        if (compSnap.exists()) checkbox.checked = compSnap.data().done;

        const freeSnap = await getDoc(doc(db, "users", currentUser.uid, "free_text", currentQ[prefix]));
        if (freeSnap.exists()) {
            document.getElementById(`${prefix}-rich-text`).innerHTML = freeSnap.data().html;
        }

        const planSnap = await getDoc(doc(db, "users", currentUser.uid, "plans", currentQ[prefix]));
        if (planSnap.exists()) {
            const data = planSnap.data();
            document.getElementById(`${prefix}-struct-intro`).value = data.intro || "";
            document.getElementById(`${prefix}-struct-conc`).value = data.conclusion || "";
            
            if (data.boxes && data.boxes.length > 0) {
                data.boxes.forEach(box => {
                    addPlanBox(prefix, box.type, box.text);
                });
            }
        } else {
            addPlanBox(prefix, 'agree');
            addPlanBox(prefix, 'agree');
            addPlanBox(prefix, 'disagree');
        }
    } else {
        addPlanBox(prefix, 'agree');
        addPlanBox(prefix, 'agree');
        addPlanBox(prefix, 'disagree');
    }
}

// Mark Complete Listeners
['spain', 'wotr'].forEach(prefix => {
    document.getElementById(`${prefix}-mark-complete`).addEventListener('change', async (e) => {
        if (!currentUser || !currentQ[prefix]) {
            e.target.checked = !e.target.checked; 
            return alert("Please sign in and select a question first.");
        }
        await setDoc(doc(db, "users", currentUser.uid, "completed", currentQ[prefix]), { done: e.target.checked });
    });
});

// --- DYNAMIC DRAG & DROP PLANNING ENGINE ---
function setupNotesPicker(categories, containerId) {
    const container = document.getElementById(containerId);
    categories.forEach(cat => {
        const header = document.createElement('div');
        header.className = 'picker-category'; 
        header.innerHTML = '▼ ' + formatCategoryText(cat);
        
        const bulletContainer = document.createElement('div');
        bulletContainer.className = 'picker-bullets';
        
        getBulletsForCategory(cat).forEach(item => {
            const b = document.createElement('div');
            b.innerHTML = item.text; // Changed to innerHTML to process the <b> tags
            
            if (item.type === 'heading') {
                b.style.fontWeight = 'bold';
                b.style.padding = '8px';
                b.style.marginTop = '10px';
                b.style.color = '#333';
                b.style.borderBottom = '1px solid #ccc';
            } else {
                b.className = 'draggable-bullet';
                b.draggable = true;
                b.addEventListener('dragstart', (e) => { 
                    // This clever regex strips the <b> tags out before putting the text into your essay planner box
                    const plainText = item.text.replace(/<[^>]+>/g, '');
                    e.dataTransfer.setData('text/plain', plainText); 
                });
            }
            bulletContainer.appendChild(b);
        });

        header.onclick = () => {
            const isVisible = bulletContainer.style.display === 'block';
            bulletContainer.style.display = isVisible ? 'none' : 'block';
            header.innerHTML = (isVisible ? '▼ ' : '▲ ') + formatCategoryText(cat);
        };
        
        container.appendChild(header);
        container.appendChild(bulletContainer);
    });
}
setupNotesPicker(spainCats, 'spain-picker-content');
setupNotesPicker(wotrCats, 'wotr-picker-content');

function addPlanBox(prefix, type, initialText = "") {
    const container = document.getElementById(`${prefix}-struct-boxes`);
    const boxWrapper = document.createElement('div');
    boxWrapper.className = `plan-box-container ${type}`;
    
    const header = document.createElement('div');
    header.className = `box-header ${type}`;
    header.innerHTML = `<span>${type} Point</span> <span class="remove-box">✖ Remove</span>`;
    header.querySelector('.remove-box').onclick = () => boxWrapper.remove();
    
    const textarea = document.createElement('textarea');
    textarea.placeholder = `Write your ${type} point here, or drop notes...`;
    textarea.value = initialText;

    textarea.addEventListener('dragover', e => { e.preventDefault(); textarea.classList.add('drag-over'); });
    textarea.addEventListener('dragleave', () => textarea.classList.remove('drag-over'));
    textarea.addEventListener('drop', e => {
        e.preventDefault();
        textarea.classList.remove('drag-over');
        const text = e.dataTransfer.getData('text/plain');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const val = textarea.value;
        const insertText = val ? `\n- ${text}` : `- ${text}`;
        textarea.value = val.substring(0, start) + insertText + val.substring(end);
    });

    boxWrapper.appendChild(header);
    boxWrapper.appendChild(textarea);
    container.appendChild(boxWrapper);
}

['spain', 'wotr'].forEach(prefix => {
    document.getElementById(`${prefix}-add-agree`).onclick = () => addPlanBox(prefix, 'agree');
    document.getElementById(`${prefix}-add-disagree`).onclick = () => addPlanBox(prefix, 'disagree');

    document.getElementById(`${prefix}-btn-free`).onclick = () => {
        document.getElementById(`${prefix}-free-editor`).style.display = 'block';
        document.getElementById(`${prefix}-struct-editor`).style.display = 'none';
        document.getElementById(`${prefix}-essay-list`).style.display = 'block';
        document.getElementById(`${prefix}-notes-picker`).style.display = 'none';
    };
    document.getElementById(`${prefix}-btn-struct`).onclick = () => {
        document.getElementById(`${prefix}-free-editor`).style.display = 'none';
        document.getElementById(`${prefix}-struct-editor`).style.display = 'block';
        document.getElementById(`${prefix}-essay-list`).style.display = 'none';
        document.getElementById(`${prefix}-notes-picker`).style.display = 'block';
    };
});

// --- SAVING ESSAYS AND PLANS ---
async function saveFreeText(prefix) {
    if (!currentUser || !currentQ[prefix]) return alert("Sign in and select a question first.");
    const content = document.getElementById(`${prefix}-rich-text`).innerHTML;
    await setDoc(doc(db, "users", currentUser.uid, "free_text", currentQ[prefix]), { html: content });
    alert("Writing saved!");
}

async function savePlan(prefix) {
    if (!currentUser || !currentQ[prefix]) return alert("Sign in and select a question first.");
    const intro = document.getElementById(`${prefix}-struct-intro`).value;
    const conc = document.getElementById(`${prefix}-struct-conc`).value;
    const boxes = [];
    document.querySelectorAll(`#${prefix}-struct-boxes .plan-box-container`).forEach(box => {
        const type = box.classList.contains('agree') ? 'agree' : 'disagree';
        const text = box.querySelector('textarea').value;
        boxes.push({ type, text });
    });

    await setDoc(doc(db, "users", currentUser.uid, "plans", currentQ[prefix]), { 
        intro: intro, boxes: boxes, conclusion: conc
    });
    alert("Plan saved!");
}

['spain', 'wotr'].forEach(prefix => {
    document.getElementById(`save-${prefix}-free`).onclick = () => saveFreeText(prefix);
    document.getElementById(`save-${prefix}-struct`).onclick = () => savePlan(prefix);
});

// --- GRADE BOUNDARIES TABLE ---
const bounds = [
    { year: 2024, o: "163, 139, 115, 91, 68, 45", s: "64, 56, 45, 35, 25, 15", w: "61, 51, 42, 33, 24, 15" },
    { year: 2023, o: "167, 144, 120, 96, 73, 50", s: "65, 55, 45, 35, 25, 16", w: "66, 57, 47, 37, 28, 19" },
    { year: 2022, o: "156, 134, 110, 86, 62, 38", s: "60, 52, 41, 30, 20, 10", w: "60, 52, 43, 34, 26, 18" },
    { year: 2021, o: "N/A", s: "N/A", w: "55, 44, 36, 28, 21, 14" }, 
    { year: 2020, o: "159, 135, 116, 97, 78, 59", s: "63, 54, 46, 38, 30, 23", w: "60, 49, 42, 36, 28, 21" },
    { year: 2019, o: "159, 135, 115, 95, 75, 56", s: "66, 58, 49, 41, 33, 25", w: "58, 45, 37, 30, 23, 16" },
    { year: 2018, o: "175, 146, 125, 104, 83, 63", s: "69, 64, 55, 46, 37, 29", w: "60, 50, 42, 34, 26, 19" },
    { year: 2017, o: "163, 139, 117, 95, 73, 51", s: "64, 56, 46, 37, 27, 19", w: "60, 50, 42, 33, 25, 17" }
];

const tbody = document.getElementById('boundaries-tbody');
bounds.forEach(b => {
    let sLinks = b.year === 2021 ? `<span style="color:#999;">Cancelled</span>` : `<a href="past_papers/${b.year}.1.pdf" target="_blank">📄 P1</a> | <a href="mark_schemes/${b.year}.1.pdf" target="_blank">✅ MS1</a>`;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><b>${b.year}</b></td><td>${b.o}</td><td>${b.s}</td><td>${b.w}</td>
        <td>${sLinks} | <a href="past_papers/${b.year}.2.pdf" target="_blank">📄 P2</a> | <a href="mark_schemes/${b.year}.2.pdf" target="_blank">✅ MS2</a></td>`;
    tbody.appendChild(tr);
});