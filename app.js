import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
        loginBtn.textContent = "Sign Out";
        userInfo.textContent = `Hello, ${user.displayName}`;
        userInfo.style.display = "inline-block";
        
        // NEW: Fetch all completed questions and paint the sidebar buttons green
        const completedSnap = await getDocs(collection(db, "users", user.uid, "completed"));
        completedSnap.forEach(doc => {
            if (doc.data().done) {
                const [year, paper, qNum] = doc.id.split('.');
                const spainBtn = document.getElementById(`btn-spain-${year}-${paper}-${qNum}`);
                const wotrBtn = document.getElementById(`btn-wotr-${year}-${paper}-${qNum}`);
                if (spainBtn) spainBtn.classList.add('completed-btn');
                if (wotrBtn) wotrBtn.classList.add('completed-btn');
            }
        });
    } else {
        loginBtn.textContent = "Sign in with Google";
        userInfo.style.display = "none";
        // Remove green from all buttons on sign out
        document.querySelectorAll('.completed-btn').forEach(btn => btn.classList.remove('completed-btn'));
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
        { type: "bullet", text: "[[Personal monarchy]]: [[Isabella]] travelled over [[2000km]] per year to personally oversee [[justice]] and suppress [[dissent]]." },
        { type: "bullet", text: "The [[1480]] Cortes of [[Toledo]] used [[Acts of Resumption]] to reclaim [[royal lands]] and [[revenues]] lost since [[1464]]. Older gains were protected." },
        { type: "bullet", text: "[[Corregidores]] were [[royal governors]] in towns. In [[1494]], there were [[54]]. By [[1516]], there were [[86]]." },
        { type: "bullet", text: "The [[Royal Council]] was professionalised in a [[1493]] pragmatica. [[Ten years']] legal training was required to sit on the council." },
        { type: "bullet", text: "Secretaries gained status. [[Hernando de Zafra]] rose from humble origins to [[100k maravedis]] salary and he negotiated the surrender of [[Granada]]." },
        { type: "bullet", text: "The [[fueros]] and separate cortes of [[Aragon]] were retained. The [[1494]] Cortes of Aragon appointed [[viceroys]]." },
        { type: "bullet", text: "The Castilian cortes was made up of nobles and representatives from [[17]] towns (plus [[Granada]] in [[1492]])." },
        { type: "bullet", text: "The Castilian cortes did not meet from [[1482]] to [[1498]]." }
    ],
    "Ferdinand and Isabella: Securing the Throne and Managing the Nobility": [
        { type: "bullet", text: "[[War of Succession]]: Isabella was kept captive by her guardian, the [[Marquis of Villena]]. [[Joanna Beltraneja]] threatened the crown. The Archbishop of [[Toledo]] supported Joanna with [[19,000]] men and [[20]] castles. Isabella won at [[1476]] Battle of [[Toro]]. Ended by [[1479]] Treaty of [[Alcacovas]]. Castile granted everything north of and including [[Canaries]]. Beltraneja was sent to a [[convent]]." },
        { type: "bullet", text: "Rewards: Alliances with grandees such as [[Mendozas]], [[Velascos]]. New titles established like [[1475]] Duchy of [[Infantado]], [[1492]] Duchy of [[Frias]]." },
        { type: "bullet", text: "[[Adulterine]] castles were turned into [[Isabelline]] palaces." },
        { type: "bullet", text: "Marquis of Villena forced to forfeit [[Escalona]]." },
        { type: "bullet", text: "Military orders ([[Santiago]], [[Calatrava]], [[Alcantara]]) absorbed into crown by [[1501]]. Santiago alone had [[80]] encomiendas. Vast revenues." },
        { type: "bullet", text: "[[Mayorazgos]] were promoted by the [[1505]] Cortes of [[Toro]]. Prevented the [[sale]] and [[division]] of estates." },
        { type: "bullet", text: "[[3%]] of the population owned [[97%]] of the land." },
        { type: "bullet", text: "Grandees: [[15]] families owned [[50%]] of the land. Socially dominant, but excluded from the [[Royal Council]]." }
    ],
    "Ferdinand and Isabella: Santa Hermandad": [
        { type: "bullet", text: "Established at [[1476]] Cortes of [[Madrigal]]." },
        { type: "bullet", text: "Peacekeeping force for rural towns with [[50+]] inhabitants." },
        { type: "bullet", text: "Coordinated by [[Junta General]]. Treasurer was [[Abraham Seneor]], a Jewish tax farmer: allegations of [[corruption]]." },
        { type: "bullet", text: "Summary powers to enforce justice, such as [[death by arrow]] for highway robbery." },
        { type: "bullet", text: "Militia of [[3000]] men in [[1476]]. This rose to [[10,000]] by [[1490]]." },
        { type: "bullet", text: "Provided [[300 million maravedis]] and [[16,000]] men to the [[Granada]] war." },
        { type: "bullet", text: "Central organisation disbanded in [[1498]] to appease towns (too [[expensive]])." }
    ],
    "Ferdinand and Isabella: Religious Policy": [
        { type: "bullet", text: "[[Inquisition]] established by Papal Bull in [[1478]] to target [[converso]] heresy. [[700]] executed in [[Seville]] from 1481-88. [[99.3%]] of trials in Barcelona in 1505 of Jewish origin." },
        { type: "bullet", text: "Jews never really liked. Already long-standing Jewish districts ([[aljamas]]) in cities. [[1476]] pragmatica forbade all Jews from [[Bilbao]]." },
        { type: "bullet", text: "Changed curriculum of [[Salamanca]] University in [[1482]] to include [[limpieza de sangre]]." },
        { type: "bullet", text: "[[March 1492]] Alhambra decree told all Jews to convert or leave by July. Estimates of exodus range from [[40,000]] to [[300,000]]. Loss of professionals (eg. [[silk]]) but short term gain in confiscated property eg. [[gold and silver]] which Jews weren't allowed to take." },
        { type: "bullet", text: "Granada War was framed as [[crusade]] and thus funded by the [[cruzada]] tax which brought in [[800m maravedis]] from 1484-92." },
        { type: "bullet", text: "Muslims: Archbishop of Granada, [[Talavera]], promoted teaching and religious education. But [[1499]] intervention by [[Cisneros]] used forced baptisms. This led to the [[1499-1501]] Alpujarras revolt. Royal forces blew up a mosque where women and children were sheltering, [[October 1501]] royal decree ordered a massive public bonfire of [[Arabic books]]. No more religious or cultural rights for Arabs; [[1502]] decree said Castilian Muslims can choose [[conversion]] or [[exile]]." },
        { type: "bullet", text: "[[Cisneros]] (archbishop of Toledo) was highly infliuential. Made cardinal in [[1507]], financed Uni of [[Alcala]] in [[1508]], and capture of [[Oran]] in [[1509]]." },
        { type: "bullet", text: "Assassination of an inquisitor in [[Zaragoza]] in [[1485]] increased power of Inquisition, led to [[15]] mass auto de fes, wealth confiscations of prominent figures eg. [[Francisco de Santa Fe]]." },
        { type: "bullet", text: "Church control: [[1486 Patronato Real]] gave monarchs the right to appoint [[bishops]] in Granada." },
        { type: "bullet", text: "In [[1492 Antonio de Nebrija]] published the first Castilian grammar, and said \"language is the instrument of [[empire]]\". Tool for conversion of subjugated peoples." }
    ],
    "Ferdinand and Isabella: Foreign and Dynastic Policy": [
        { type: "bullet", text: "France: [[1493 Treaty of Barcelona]] recovered [[Cerdagne]], [[Rousillion]]." },
        { type: "bullet", text: "Italy: [[Gonzalo de Cordoba]] 'the Grand Captain' won victors at Cerignola and Garigliano [[1503]]. Ferdinand as king of Naples by [[1504]]." },
        { type: "bullet", text: "Diplomacy: First resident ambassadors in [[London]] in [[1487]]. [[1489 Treaty of Medina del Campo]] secured [[English]] alliance w/ marriages." },
        { type: "bullet", text: "Atlantic: [[1479 Treaty of Alcacovas]] secured Canaries, conquered by [[1496]]. [[1494 Treaty of Tordesillas]] divided the globe." },
        { type: "bullet", text: "North Africa: [[Presidios]] were established. [[1497]] Melilla, [[1505]] Mers-el-Kebir, [[1509]] Oran." },
        { type: "bullet", text: "Navarre: Succession crisis exploited to annexation in [[1512]]. Ferdinand as king. Respected [[fueros]]." },
        { type: "bullet", text: "[[1505 Treaty of Blois]]: Ferdinand married [[Germaine de Foix]], niece of French king, for securing of Naples and Aragon from France." },
        { type: "bullet", text: "[[Joanna]] x Philip the Handsome in [[1496]]." },
        { type: "bullet", text: "[[Isabella]] x Afonso in [[1490]]." },
        { type: "bullet", text: "[[Isabella]] x Manuel I in [[1497]]." },
        { type: "bullet", text: "[[Maria]] x Manuel I in [[1500]]." },
        { type: "bullet", text: "[[Catherine]] x Arthur in [[1501]]." },
        { type: "bullet", text: "[[Catherine]] x Henry VIII in [[1509]]." },
        { type: "bullet", text: "Columbus voyage in [[1492]] - cost only [[2m maravedis]]." },
        { type: "bullet", text: "[[1512 Laws of Burgos]] - declared natives free, mandated conversion to Catholicism, and regulated labor, though they were poorly enforced and legalised the [[encomienda]] system." }
    ],
    "Ferdinand and Isabella: Economics": [
        { type: "bullet", text: "Revenue: [[800k reales]] in 1470 to [[22m reales]] in 1504." },
        { type: "bullet", text: "The 10% sales tax - [[alcabala]] - was the biggest contributor to revenue." },
        { type: "bullet", text: "Currency: [[1497]] pragmatica standardised [[375 maravedis]] as 1 ducat, excelente, principat." },
        { type: "bullet", text: "Mesta: [[2.8 million]] sheep in 1450. Protected by the crown. Special interest represented on the [[royal council]]. Lack of agriculture led to reliance on imports and wheat shortage by [[1506]]. [[1501 Law of Leases]] allowed Mesta to rent land in perpetuity at the original price. [[Tasa]] (price fix) on grain in [[1502]] tried to fight this." },
        { type: "bullet", text: "Debt: [[Juros]] (10% interest bonds) given out. Repayment reached [[131 million maravedis]] by 1516." },
        { type: "bullet", text: "[[1494 Consulado of Burgos]] gave the city a monopoly on the wool trade." },
        { type: "bullet", text: "[[1503 Casa de Contratacion]] in Seville controlled trade, shipping schedules, etc... Seville given sole right to New World. Trade volume increased from [[300 toneladas]] in 1504 to [[5000 toneladas]] in 1516." },
        { type: "bullet", text: "Tolls: [[1480]] exemption for merchants. [[1497]] exemption for Carter's guild. Corruption. Nobles took tolls but didn't fix [[bridges]]." },
        { type: "bullet", text: "[[1511]] enquiry found roads in poor quality, [[12]] bridges swept away and not rebuilt." },
        { type: "bullet", text: "Expulsion of Jews harmed [[silk]] and cloth industries despite short term gain." },
        { type: "bullet", text: "Aragon contributed less than [[20%]] of what Castile contributes." }
    ],
    "Charles V: Consolidation of Royal Authority and Revolts": [
        { type: "bullet", text: "Accession: \"[[foreign king]]\". Resentment at early Burgundian appointments eg. [[Chievres]] placed his 20 y.o. nephew as Archbishop of [[Toledo]]." },
        { type: "bullet", text: "[[1518-19]] Cortes: promised to learn [[Castilian]], respect [[fueros]], etc." },
        { type: "bullet", text: "[[1519]] HRE election: Cost [[852k florins]]. Partially funded by [[servicios]] from Cortes of [[Santiago]] and [[Coruna]] in exchange for Hispanization." },
        { type: "bullet", text: "[[1520-21 Comuneros]]: Urban uprising due to high taxes, foreigners, corregidor abuses. Toledo, Segovia. Led by [[Juan de Padilla]]. Radicalised by burning of [[Medina del Campo]] 1520 on orders of Charles. Failed to get [[Joanna the Mad's]] support." },
        { type: "bullet", text: "April [[1521]] Battle of [[Villalar]]: Revolt crushed by nobles. Leaders executed. Last strongholds fell in October 1521. [[22]] executed." },
        { type: "bullet", text: "[[1519-21 Germania]]: Merchants and artisan guilds who held grievances over economic hardship. Limited to [[Valencia]]. Council of 13 germanias. Turned radical by [[Vicente Peris]]. Attacks on noble estates, forced baptism of mudejars. Main revolt stopped in [[1521]], holdouts until 1522 by \"[[The Hidden]]\" who tuned revolt more spiritual. Majorca until [[1523]]." },
        { type: "bullet", text: "Resolution: Hispanization. Learned Castilian, increased Spanish appointments, married [[Isabella]] in [[1526]]." },
        { type: "bullet", text: "Returned in [[1522]] with [[4000]] mercenaries. Issued [[general pardon]] except for rebel leaders." },
        { type: "bullet", text: "All cortes deputies required to have [[poderes]] (full powers)." }
    ],
    "Charles V: Government and Administration": [
        { type: "bullet", text: "Conciliar system exanded. [[1522]] war, [[1523]] finance, [[1524]] indies, [[1526]] state. [[Los Cobos]] secretary of finance for [[30yrs]]." },
        { type: "bullet", text: "[[Consulta]] standardised conciliar system with council debata leading to consulta, approved or rejected by the king." },
        { type: "bullet", text: "[[Mercurino Gattinara]] grand chancellor until [[1530]]. No new grand chancellor appointed, split between [[los Cobos]] (finance) and [[Granvelle]] (foreign policy)." },
        { type: "bullet", text: "Cortes met [[15]] times. [[1538]] Cortes of Toledo nobles refused [[sisa]] (food tax). Thereafter, only town deputies summoned." },
        { type: "bullet", text: "[[1523]]: Pope granted permanent mastership of the [[military orders]]." },
        { type: "bullet", text: "[[1543]]: State archive established at [[Simancas]]." },
        { type: "bullet", text: "[[1543]]: Philip as regent, aged [[16]]. Guided by junta including Cardinal [[Tavera]], de los Cobos. Lasted for [[14yrs]] during Charles' absence." },
        { type: "bullet", text: "[[Itinerant]] court continued." },
        { type: "bullet", text: "[[Letrados]] dominated." }
    ],
    "Charles V: Foreign Policy": [
        { type: "bullet", text: "\"[[Plus Oultre]]\" motto." },
        { type: "bullet", text: "France: [[Francis I]] captured at [[1525 Battle of Pavia]]. [[1529 Peace of Cambrai]] and [[1544 Peace of Crepy]] confirmed Spanish dominance in Italy." },
        { type: "bullet", text: "Portugal: [[1529 Treaty of Zaragoza]] sold [[Moluccas]] claim to Portugal for [[350k ducats]]." },
        { type: "bullet", text: "HRE: [[1532 Peace of Nuremberg]] was a temporary truce with Lutherans so Charles could focus on Ottoman threat. [[1547 Battle of Muhlberg]] defeated Schmalkaldic League but forced into embarrasing [[1555 Peace of Augsburg]]." },
        { type: "bullet", text: "Ottomans: [[1529]] Siege of Vienna was victory over [[100k]] Ottomans. Charles led [[1535 Tunis expedition]] with [[60k]] men. But [[1541 Algiers]] was a catastophic failure with [[150]] ships lost." },
        { type: "bullet", text: "England: [[1522 Treaty of Windsor]] continued English alliance, [[1554]] Philip x [[Mary Tudor]]." }
    ],
    "Charles V: Economics": [
        { type: "bullet", text: "Revenue: Still mostly [[Castile]] and [[New World]]." },
        { type: "bullet", text: "Church contributed approx. [[25%]] of revenue." },
        { type: "bullet", text: "[[1534]] Cortes of Madrid established [[encabezamiento]]. Annual lump sum instead of alcabala." },
        { type: "bullet", text: "1536-54: alcabala increased by [[22%]] but prices by [[33%]]. Crown real income reduced." },
        { type: "bullet", text: "[[Servicios]] tripled in yield, became more like regular tax rather than special tax." },
        { type: "bullet", text: "[[Servicio y montazgo]]: expanded medieval tax on sheep." },
        { type: "bullet", text: "1516-60: [[11.9m ducats]] from Americas." },
        { type: "bullet", text: "Partially result of [[Potosi]] 1545 and [[Zacatecas]] 1548." },
        { type: "bullet", text: "[[1554 mercury amalgamation]] was new process to extract silver ore." },
        { type: "bullet", text: "[[1543 almojarifazgo mayor]]: [[5%]] customs duty on bullion via Sevilla." },
        { type: "bullet", text: "[[Military]] spending was biggest expense." },
        { type: "bullet", text: "Burgundian-style court cost [[200k ducats/yr.]] with [[762]] people." },
        { type: "bullet", text: "[[502 asientos]] (short-term loans) negotiated, with Charles borrowing [[28.8m ducats]]." },
        { type: "bullet", text: "Interest rates rose from [[17.6%]] in the 1520s to [[48.8%]] by the 1550s." },
        { type: "bullet", text: "[[1544]]: massive debts of [[3.1m ducats]]. [[1000 hidalgos]] auctioned to raise money. Backfired as they were exempt from taxation" },
        { type: "bullet", text: "1540s: desperate measures eg. seizing all private [[treasure]] imported to fund [[Muhlberg]]." },
        { type: "bullet", text: "Selling [[public offices]] weakened crown jurisdiction in the long term." },
        { type: "bullet", text: "[[Fuggers]] lent 543k florins and [[Welsers]] another 143k florins for HRE. Gained shipping and permits for Americas - Welsers colonised [[Venezuela]]." },
        { type: "bullet", text: "Andalusia: wheat [[+109%]], oil [[+197%]], wine [[+655%]]. 1511-56" },
        { type: "bullet", text: "Valladolid: wheat [[+44%]], land [[+86%]], wages [[+33%]]. 1511-56" },
        { type: "bullet", text: "Scholars like [[Azpilcueta]] 1556 first to devise [[quantity theory of inflation]]." },
        { type: "bullet", text: "[[1556]]: 37m ducats of debt. Bankrupt by [[1557]]. Total failure." }
    ],
    "Charles V: New World": [
        { type: "bullet", text: "[[1519-21]]: [[Cortes]] with [[600]] men conquered the [[Aztecs]]." },
        { type: "bullet", text: "[[1532]]: [[Pizarro]] (pig farmer) with [[160]] men conquered [[Incas]] in Peru." },
        { type: "bullet", text: "[[1535]]: Viceroyalty of [[New Spain]] (Mexico) established." },
        { type: "bullet", text: "[[1542]]: Viceroyalty of [[Peru]] established." },
        { type: "bullet", text: "[[1542: New Laws]] tried to protect Indians, but with limited influence." },
        { type: "bullet", text: "[[1544-48]]: [[Gonzalo Pizarro]] rebellion in Peru against New Laws." },
        { type: "bullet", text: "[[1545]]: [[Potosi]]." },
        { type: "bullet", text: "[[1548]]: [[Zacatecas]] (formal mining operations began)." },
        { type: "bullet", text: "[[1554]]: [[Mercury amalgamation]]. New process to extract silver ore." },
        { type: "bullet", text: "1550s: [[Royal fifth]] made up [[15%]] of crown income." }
    ],
    "Charles V: Religious Policy": [
        { type: "bullet", text: "\"[[Plus Oultre]]\" motto partially symbolised 'Herculean task' of spreading Christianity." },
        { type: "bullet", text: "[[Limpieza de sangre]] still used to bar conversos and descendants from office." },
        { type: "bullet", text: "Inquisition began to use tortures. [[1547]] new Inquisitor General ([[Valdes]]) prosecuted moral crimes eg. [[bigamy]]." },
        { type: "bullet", text: "Episocpal standards increased eg. with [[uni training]]." },
        { type: "bullet", text: "Uni of [[Alcala]] became centre of religious innovation eg. [[1522 Polyglot Bible]]." },
        { type: "bullet", text: "[[1523]] Papal Bull expanded [[1486 Patronato Real]] to all of Spain." },
        { type: "bullet", text: "Poor Papal relations. [[1527 Sack of Rome]] by unpaid mercenaries captured the Pope." },
        { type: "bullet", text: "[[1534 Ignatius Loyola]] established [[Jesuits]]. Observant." },
        { type: "bullet", text: "[[1545-63 Council of Trent]] affirmed Latin Vulgate, Catholic doctrine, etc." },
        { type: "bullet", text: "In retirement, Charles became religious fanatic and advocated extreme violence against protestants, eg. [[Agustin de Cazalla]] (court preacher) arrested and burned in [[1558]], alleged to lead secret Protestant cell." },
        { type: "bullet", text: "[[1521 Diet of Worms]] against Luther presided over by Charles." },
        { type: "bullet", text: "[[Erasmus]] translated to Castilian in [[1526]]. Charles liked, but by [[1533]] Inquisition equated Erasmianism with Lutheranism." },
        { type: "bullet", text: "As soon as Charles left Spain, humanists like [[Juan de Vergara]] arrested." },
        { type: "bullet", text: "Germania revolt did forced baptims of Muslims. In [[1525]], Charles banned Islam in Spain. In [[1526]], admited to Pope conversions were not sincere." },
        { type: "bullet", text: "[[1526]] visit to Granada: \"[[27]] years since their conversions and there are not even [[27]] Christians\"." },
        { type: "bullet", text: "1526: [[80k ducats]] subsidy, in other areas [[20k ducats]] annual \"[[farda]]\" tax from Moriscos to be tolerated by Charles eg. keep traditional dress." },
        { type: "bullet", text: "In Aragon, [[60k ducats]] to be ignored for 40yrs ([[concordia]]) in [[1528]]. Still suspected as \"fifth column\"." }
    ],
    "Philip II - Government and Royal Authority": [
        { type: "bullet", text: "[[Paper king]]: micromanaged from [[El Escorial]]. Signed up to [[400]] documents in one morning." },
        { type: "bullet", text: "[[1561]] [[Madrid]] became the capital." },
        { type: "bullet", text: "1563-84 building of [[El Escorial]] also micromanaged by Philip II." },
        { type: "bullet", text: "[[1567 Nueva Recopilación]] codified laws of Castile." },
        { type: "bullet", text: "[[14]] councils by 1584 eg. Italy 1559, Portugal 1582." },
        { type: "bullet", text: "Shift to [[juntas]] after 1585 to improve efficiency, eliminate bottlenecks eg. [[1585 Junta de la Noche]]." },
        { type: "bullet", text: "Secretaries: [[Antonio Perez]] was most influential until arrest in [[1579]]." },
        { type: "bullet", text: "[[12]] cortes summoned for servicios. [[Milliones]] food tax introduced in 1590 became permanent." },
        { type: "bullet", text: "[[1581 Cortes of Tomar]]: Philip as king of Portugal. Promised to uphold local laws and appointments." },
        { type: "bullet", text: "[[1592 Cortes of Tarazona]] (Aragon) allowed foreign viceroys and majority voting." },
        { type: "bullet", text: "Letrados and secretaries - selected papers for king to read; [[Juan de Idiaquez]] withheld letter from [[Duke of Medina Sidonia]] where he attempted to decline command of the Armada." },
        { type: "bullet", text: "1590s: only [[35%]] of land in Salamanca and [[73/300]] towns in Valencia under direct royal jurisdiction." },
        { type: "bullet", text: "Court was simplified eg. [[Senor]] instead of His Majesty." },
        { type: "bullet", text: "Court factions existed - [[Alba]] had the war party and [[Eboli]] the peace party. Philip failed to back either one decisively; unnecessary conflict and slow bureaucracy." },
        { type: "bullet", text: "31 March [[1578]]: [[Juan de Escobedo]] (secretary of Don John) ambushed and stabbed to death by assassins hired by Perez. July [[1579]]: Philip ordered arrest of Pérez and Princess of Eboli. Perez possessed compromising state documents (proving the King ordered hit), Philip spent years alternating between torturing him and treating him leniently to get the papers back." },
        { type: "bullet", text: "Mandatory end-of-term judicial reviews ([[residencias]]) improved administration." }
    ],
    "Philip II - Religious Policy": [
        { type: "bullet", text: "[[Regalism]] asserted he was 'lord over the Church'; not bound by papal mandates." },
        { type: "bullet", text: "No papal decree published in Spain without approval from [[Council of Castile]]." },
        { type: "bullet", text: "Accepted [[1564 Council of Trent]] but insisted Crown oversee implementation." },
        { type: "bullet", text: "[[St Teresa of Avila]] founded [[Discalced Carmelites]] - recognised by Pope in the 1580s." },
        { type: "bullet", text: "Philip distrusted the [[Jesuits]] (loyal to Rome); attempted to 'nationalise' the order (Inquisiton)." },
        { type: "bullet", text: "Protestant Cells ([[1557-58]]) in [[Seville]] (130-150 people) and [[Valladolid]] (55 people) - panic." },
        { type: "bullet", text: "Protestantism effectively eradicated by [[1562]] (278 prosecutions, 77 deaths) in autos-de-fé." },
        { type: "bullet", text: "Philip personally attended October [[1559]] ceremony in Valladolid." },
        { type: "bullet", text: "[[1558]] Censorship Laws: Pragmatica established death penalty for owning/selling unlicensed books. [[Index of Prohibited Books]] (1559) issued by Inquisitor General Valdes: banned approximately [[700]] works, including 14 editions of the Bible and 14 works by Erasmus." },
        { type: "bullet", text: "[[1559]] decree recalled all Spanish students from foreign universities." },
        { type: "bullet", text: "[[Carranza]] (1559): Archbishop of Toledo imprisoned for [[17]] years by Inquisition; Philip appropriated see’s revenues. [[Luis de Leon]] imprisoned for four years ([[1572-76]]) for translating Song of Solomon and questioning the Latin Vulgate." },
        { type: "bullet", text: "1560: [[85%]] of those persecuted by the Inquisition were [[moriscos]]." },
        { type: "bullet", text: "[[1563]] Edict confiscated Morisco land and banned them from possessing weapons." },
        { type: "bullet", text: "[[Morisco Edict (1567)]] forbade Arabic language, Moorish dress, and traditional names, triggering the [[1568-70 Alpujarras revolt]]." },
        { type: "bullet", text: "Alpujarras Outcome: Suppression of the [[30,000]] rebels by [[Don John]] led to the mass dispersal of [[80,000-100,000]] Moriscos across Castile; [[20,000+]] died during the winter journey." }
    ],
    "Philip II - Economics": [
        { type: "bullet", text: "[[1557 Bankruptcy]]: Inherited approx. [[36 million ducats]] debt; he was forced to suspend all payments from Castilian treasury. Up to [[74 million ducats]] of debt by 1574." },
        { type: "bullet", text: "High-interest short-term [[asientos]] (7 million ducats) converted into long-term [[juros]] at fixed, decreased interest rate of [[5 per cent]]." },
        { type: "bullet", text: "Frther bankruptcies in [[1557]], [[1560]], [[1575]], and [[1596]]." },
        { type: "bullet", text: "Castilian ordinary revenue [[tripled]] during the reign." },
        { type: "bullet", text: "The [[Milliones]] (1590): Introduced following the failure of the Armada to tax basic essentials like meat, wine, oil, and vinegar." },
        { type: "bullet", text: "It collected [[8 million ducats]] in first 10 years and became a permanent tax." },
        { type: "bullet", text: "By the 1590s, clerical revenues accounted for [[20%]] of Crown income. The [[Three Graces]]: key clerical taxes which included [[Cruzada]] (yield quadrupled), the [[Subsidio]] (made permanent in 1561), the [[Excusado]] (granted in 1567 by Pope Pius V to fund the army in the Low Countries)." },
        { type: "bullet", text: "Bullion imports from America [[tripled]] by 1590s; total of [[65 million ducats]] received between 1555 and 1600." },
        { type: "bullet", text: "Dutch revolt (1567-1600) cost approximately [[80 million ducats]]." },
        { type: "bullet", text: "1588 Armada cost [[10 million ducats]]." },
        { type: "bullet", text: "Lepanto campaign cost the Castilian exchequer [[5 million ducats]]; direct cost of the battle was [[800,000 ducats]]" },
        { type: "bullet", text: "Total debt accumulated to approx. [[85 million ducats]] by 1598; interest payments consuming [[half]] of revenue." }
    ],
    "Philip II - Revolts": [
        { type: "heading", text: "Second Alpujarras Revolt" },
        { type: "bullet", text: "1560: [[85%]] of those persecuted by the Inquisition were moriscos." },
        { type: "bullet", text: "[[1563]] Edict confiscated Morisco land and banned them from possessing weapons. Confiscation of [[100,000 hectares]]." },
        { type: "bullet", text: "Export of Moriscan [[silk]] banned." },
        { type: "bullet", text: "[[1567]] Royal Edict forbade Arabic language, Moorish dress, and traditional dances like the [[zambra]]. [[Marquis of Mondejar]] advised Philip not to do this but he ignored." },
        { type: "bullet", text: "A rebel army of [[30,000]] was led by [[Aben Humeya]] (Fernando de Válor); it was suppressed with extreme brutality by [[Don John of Austria]] who brought 12k (later up to [[25k]]) men. Tercio veterans." },
        { type: "bullet", text: "[[Seron]]: Rebels killed 150 and enslaved 80." },
        { type: "bullet", text: "Siege of [[Galera]] (1570): Royal forces razed the village and slaughtered [[2,500]] inhabitants. Many atrocities comitted." },
        { type: "bullet", text: "Between [[80,000 and 100,000]] Granadan Moriscos were forcibly deported across Castile." },
        { type: "bullet", text: "[[20,000+]] died during the winter journey." },
        { type: "bullet", text: "[[84]] new forts were built to protect the Granada coast; the Council of State advised general expulsion as early as [[1581]]." },
        { type: "bullet", text: "Agricultural output of Granada declined. Resettled by Christians who were unfamiliar how to cultivate the land." },
        { type: "heading", text: "Aragon Revolt" },
        { type: "bullet", text: "The [[Ribagorza]] affair led to Philip II occupying the county in 1591. This involved sending troops into [[Valencia]] in 1582. Also, a non-native viceroy was appointed. Aragonese argued this was all against [[fueros]]." },
        { type: "bullet", text: "[[Perez]] escaped to Zaragoza in April 1590, claiming the right of [[manifestacion]] (protection) from the [[Justiciar]]." },
        { type: "bullet", text: "[[Zaragoza Riots]] (1591): Mobs attacked the Inquisition prison to stop Pérez’s transfer; the Viceroy [[Almenara]] was fatally wounded." },
        { type: "bullet", text: "[[1591]] Invasion: Philip sent [[14,000]] soldiers under [[Alonso de Vargas]] to restore order; a small rebel force of 2,000 dispersed. The rebels only ever occupied Zaragoza. Most of Aragon did not join." },
        { type: "bullet", text: "Repression: The Justiciar [[Juan de Lanuza]] was beheaded without trial; [[150]] leaders were executed." },
        { type: "bullet", text: "[[Tarazona]] Cortes (1592): Philip secured the right to dismiss the Justiciar at will, appoint non-native (Castilian) viceroys, and pass laws by majority vote." }
    ],
    "Philip II - Foreign Policy (not Netherlands)": [
        { type: "heading", text: "General Strategy" },
        { type: "bullet", text: "[[Realism]]: Abandoned 'universal monarchy' to focus on preserving inheritance, defending Catholicism." },
        { type: "bullet", text: "By 1570s, even normal military campaigns cost [[700,000 ducats]] per month." },
        { type: "bullet", text: "1571: Dutch and Mediterranean campaigns cost [[18.5 million ducats]]." },
        { type: "bullet", text: "[[30 million ducats]] in France and [[21 million]] in the Low Countries." },
        { type: "heading", text: "France" },
        { type: "bullet", text: "Henry II renewed hostilities to gain Italian territory, but finances led to [[1556]] truce at [[Vaucelles]]." },
        { type: "bullet", text: "[[1557]] victory at Battle of [[St Quentin]]; [[1559]] Treaty of [[Cateau-Cambresis]] confirmed Spain in Italy." },
        { type: "bullet", text: "Intervened in Wars of Religion; diverted [[Parma]] from Netherlands to aid [[Catholic League]] against Henry of Navarre. In 1590, Henry IV defeated Catholic League at the Battle of [[Ivry]]." },
        { type: "bullet", text: "1590 to 1594: [[75%]] of Low Countries' military treasury spent on French expeditions and Catholic League." },
        { type: "bullet", text: "[[1593]]: Henry IV converted to Catholicism, regained control of Paris in 1594." },
        { type: "bullet", text: "[[1595-1597]]: Spain temporarily gained [[Calais]] and [[Amiens]] but lost Toulouse and Marseilles (overstretched)." },
        { type: "bullet", text: "Philip's attempt to install [[Infanta Isabella]] in [[1589-93]] failed due to French adherence to [[Salic Law]] and nationalistic backlash." },
        { type: "bullet", text: "[[1598]] Treaty of [[Vervins]]: War ended by restating 1559 terms; Spain returned most conquests. Failure." },
        { type: "heading", text: "The Ottoman Empire & Mediterranean" },
        { type: "bullet", text: "[[1560 Djerba]]: 28 galleys sunk and 10,000-18,000 troops lost. Spanish veterans had to be withdrawn from the Netherlands." },
        { type: "bullet", text: "Shipbuilding programme (1560-74) constructed [[300]] galleys, cost over [[3.5 million ducats]]." },
        { type: "bullet", text: "[[1565 Siege of Malta]]: 9,000 Knights held out against 30,000 Ottomans for four months until [[Garcia de Toledo]] relieved." },
        { type: "bullet", text: "[[7 Oct 1571]] Battle of [[Lepanto]]: Holy League victory; 12,000 Christian rowers liberated and killed 30,000 Turks. Christian fleet included [[80]] Spanish galleys. Over [[210]] Turkish ships lost, including [[117]] galleys good enough to be used by Christians." },
        { type: "bullet", text: "Campaign cost [[5m ducats]] and specific battle [[1.1m ducats]], of which 400,000 came from Italian kingdoms." },
        { type: "bullet", text: "[[1580]]: Philip signed a formal truce with Sultan [[Selim II]] to shift focus." },
        { type: "heading", text: "Portugal" },
        { type: "bullet", text: "King Sebastian died 1578 at [[Alcazarquivir]], [[Henry]] had short reign - then, the [[Duke of Alba]] invaded in [[1580]]." },
        { type: "bullet", text: "[[1581 Cortes of Tomar]]: Philip proclaimed King; swore to respect fueros, use native officials, and keep separate trade monopolies." },
        { type: "heading", text: "England" },
        { type: "bullet", text: "English Alliance: [[1554]] marriage to [[Mary Tudor]] intended to encircle France." },
        { type: "bullet", text: "1568 confiscation of [[Genoese]] treasure ships. 1567 arrival of Alba in the Netherlands seriously affected relations." },
        { type: "bullet", text: "English merchants smuggled and did piracy; during 1577-1580 circumnavigation, [[Francis Drake]] seized Spanish treasure." },
        { type: "bullet", text: "The [[1583 Throckmorton]] Plot was uncovered by Francis Walsingham, leading to Throckmorton's execution in May 1584. This was followed by the [[Babington]] Plot in 1586." },
        { type: "bullet", text: "[[1587]] Attack on [[Cadiz]]: Drake looted, burned, or sank approx. [[30]] Spanish ships. Drake also destroyed ships carrying food for Armada and captured treasure ship [[San Felipe]]." },
        { type: "bullet", text: "[[1588]] Spanish Armada: [[130]] ships commanded by [[Medina Sidonia]]; failure cost 15,000 men. Cost about [[10,000,000 ducats]], with Castile contributing around [[70%]]." },
        { type: "bullet", text: "Further Armadas in [[1596]], [[1597]], [[1598]]."}
    ],
    "Philip II - Dutch Revolt": [
        { type: "heading", text: "Phase 1: 1555-1567" },
        { type: "bullet", text: "[[1555-1559]]: Spent majority of time in Netherlands. Therefore, knew the difficulties." },
        { type: "bullet", text: "[[1556]]: States-General refused Philip’s taxes eg. [[1% on real estate]]." },
        { type: "bullet", text: "[[1557]]: Refused subsidies again." },
        { type: "bullet", text: "[[1559]]: Assembly voted for ‘[[nine years aid]]’ of [[3.6m ducats]]." },
        { type: "bullet", text: "[[1559]]: Philip II permanently departs Netherlands for Spain. [[Margaret of Parma]] as regent but real power wielded by inner circle led by [[Granvelle]], alienating Dutch nobles like [[Orange]] and [[Egmont]]." },
        { type: "bullet", text: "[[1559-1561]]: [[14 new bishoprics]] and Crown given power to appoint bishops. Enrages the nobility (who lose patronage) and terrifies populace (who view it as first step to Inquisition)." },
        { type: "bullet", text: "[[1561-1564]]: Concessions made, eg. stopped church reform, dismissed [[Granvelle]] after ultimatum from Orange and Egmont." },
        { type: "bullet", text: "[[October 1565]]: Letters from the [[Segovia Woods]] refused Egmont’s religious concessions which he had petitioned for in Madrid. Slow response due to ‘headaches’ according to Philip but in reality waiting for situation in Malta and stalling." },
        { type: "bullet", text: "[[April 1566]]: [[300]] nobles petitioned Margaret to rescind heresy laws - she agreed due to show of unity." },
        { type: "bullet", text: "[[July 1566]]: Philip agreed to abolish [[Inquisition]] and pardon the rebels but did not arrive until October." },
        { type: "bullet", text: "[[August 1566]]: [[Iconoclastic Fury]]. Mobs sweep across the Netherlands, smashing statues, altars, and stained glass." },
        { type: "bullet", text: "[[May 1567]]: Revolt suppressed but Philip did not know and had already sent [[Alba]] with [[10k troops]], mainly tercios. He thought it was too volatile for him to visit personally." },
        { type: "heading", text: "Phase 2: 1567-1574" },
        { type: "bullet", text: "[[August 1567]]: Arrival of the [[Duke of Alba]]. Margaret of Parma resigns in protest of his extreme methods." },
        { type: "bullet", text: "[[September 1567]]: Alba establishes the [[Council of Troubles]]; ignores standard legal privileges, executes over [[1000]] people and confiscates massive amounts of property." },
        { type: "bullet", text: "[[May 1568]]: A rebel army led by [[Orange's brother]] defeats Spanish force, though little strategic gain." },
        { type: "bullet", text: "[[June 1568]]: Alba beheads the Counts of [[Egmont and Hoorn]] in Brussels. Turns moderate Catholics against the Spanish regime." },
        { type: "bullet", text: "[[March 1569]]: Alba proposed [[Tenth Penny]] sales tax. Refused by States-General, instead given [[4m florins]] over two years." },
        { type: "bullet", text: "[[1571]]: Alba implemented the Tenth Penny anyway. Brought Netherlands to brink of revolt." },
        { type: "bullet", text: "[[April 1572]]: Capture of [[Brielle]] by the [[Sea Beggars]]. Towns across Holland and Zeeland declare for the rebellion and recognize Orange as their leader." },
        { type: "bullet", text: "[[1572]]: [[Medinaceli]] reported to Philip that Alba was the reason for revolt." },
        { type: "bullet", text: "[[1573]]: Alba recalled to Spain due to his failure to crush rebellion. He is replaced by [[Requesens]]." },
        { type: "bullet", text: "[[October 1574]]: Dutch rebels flood the countryside, allowing Sea Beggars to sail up to city walls and deliver food." },
        { type: "heading", text: "Phase 3: 1576-1581" },
        { type: "bullet", text: "[[March 1576]]: [[Requesens]] dies unexpectedly, leaving a power vacuum." },
        { type: "bullet", text: "[[September 1576]]: [[Don John]] appointed as governor." },
        { type: "bullet", text: "[[3 November 1576]]: The [[Spanish Fury]]. Army mutinies and sacks Antwerp, slaughtering around 7,000 citizens." },
        { type: "bullet", text: "[[8 November 1576]]: [[Pacification of Ghent]]. All seventeen Provinces sign a treaty uniting them against Spanish." },
        { type: "bullet", text: "[[February 1577]]: [[Perpetual Edict]]. Don John accepted Pacification of Ghent. Spanish troops begin to leave but Orange refuses to cooperate, so Don John brings troops back." },
        { type: "bullet", text: "[[1577]]: [[Parma]] appointed as military leader. States-General fled north." },
        { type: "bullet", text: "[[October 1578]]: Parma succeeds as governor." },
        { type: "bullet", text: "[[January 1579]]: Revolt splits. [[Union of Arras]]: The southern, Catholic provinces reconcile with Spain, fearing Calvinist radicalism. [[Union of Utrecht]]: Northern provinces form a military alliance to continue fight." },
        { type: "bullet", text: "[[March 1580]]: Philip II declares William of Orange an outlaw." },
        { type: "bullet", text: "[[July 1581]]: [[Act of Abjuration]]. The northern provinces declare independence, stating that Philip II has violated his contract with his subjects and is no longer their sovereign." },
        { type: "heading", text: "Phase 4: 1584-1594" },
        { type: "bullet", text: "[[July 1584]]: Assassination of [[William of Orange]]." },
        { type: "bullet", text: "[[1585]]: Only Holland, Zeeland, Utrecht remained in revolt. Parma very successful." },
        { type: "bullet", text: "[[August 1585]]: Parma starves [[Antwerp]] into submission. Dutch blockade [[Scheldt]] River, permanently ruining Antwerp's economy and shifting trade power to [[Amsterdam]]." },
        { type: "bullet", text: "[[August 1585]]: Treaty of [[Nonsuch]]. [[Elizabeth I]] enters the war, sending troops and funds." },
        { type: "bullet", text: "[[1587]]: Parma withdrawn from the Dutch campaign to join [[Armada]]. Mistake." },
        { type: "bullet", text: "[[1588]]: Defeat of the Spanish Armada. Philip II diverts Parma’s army to prepare for the invasion of England." },
        { type: "bullet", text: "[[1588]]: Mutinies in Parma’s army and resistance from [[Maurice of Nassau]]." },
        { type: "bullet", text: "[[1590]]: Parma sent to [[France]]." },
        { type: "bullet", text: "[[1591]]: Parma returned against orders, but sent to France and died in 1592." },
        { type: "bullet", text: "[[1592-1594]]: [[Mansfelt]] and [[Fuentes]] shared power but hated each other and mismanaged the situation." },
        { type: "bullet", text: "[[1598]]: Philip set up [[Isabella]] and her husband (eventually [[Albert of Austria]]) to rule in his name but essentially independently." }
    ]
};

// --- WOTR NOTES DATA ---
const wotrNotesData = {
    "1450-1458": [
        { type: "bullet", text: "<b>[[February 1447]]</b> - [[Humphrey, Duke of Gloucester]] was [[executed]] five days after being arrested for [[treason]]." },
        { type: "bullet", text: "<b>[[November 1449]]</b> - Parliament does not approve [[taxation]] to further the war in France." },
        { type: "bullet", text: "<b>[[1450]]</b> - The English economy is virtually [[bankrupt]], with [[£372,000]] in debt, [[£38k]] of this being owed to [[Richard of York]]." },
        { type: "bullet", text: "<b>[[May 1450]]</b> - [[Cade's rebellion]] breaks out over taxation and the king's perceived favour of \"evil councillors\" like [[Suffolk]]." },
        { type: "bullet", text: "<b>[[2 May 1450]]</b> - [[Suffolk]] is executed on the [[Nicholas of the Tower]]." },
        { type: "bullet", text: "<b>[[1 June 1450]]</b> - Cade's forces take [[London]], and [[Lord Saye and Sele]] (the treasurer) is executed." },
        { type: "bullet", text: "<b>[[12 July 1450]]</b> - Cade's rebellion is defeated; [[3000]] rebels are issued a [[general pardon]]." },
        { type: "bullet", text: "<b>[[September 1450]]</b> - [[York]] returns from Ireland with the intent to clear his name of involvement in Cade's rebellion. He defies orders by bringing a force of [[3000-4000]] retainers." },
        { type: "bullet", text: "<b>[[1451]]</b> - Loss of [[Gascony]]." },
        { type: "bullet", text: "<b>[[1 March 1452]]</b> - The [[Dartford Coup]] ends disastrously for York; after presenting his grievances, he fails to gain support and is forced to take an oath of loyalty at [[St. Paul's]]." },
        { type: "bullet", text: "<b>[[July 1453]]</b> - [[Shrewsbury]] is defeated and killed at the Battle of [[Castilion]], which ends English claims in France." },
        { type: "bullet", text: "<b>[[August 1453]]</b> - Skirmish at [[Heworth Moor]]; the [[Nevilles]] and [[Percys]] clash while returning from a wedding, partially motivating the Nevilles to join York's faction." },
        { type: "bullet", text: "<b>[[August 1453]]</b> - [[Henry VI's]] catatonic state begins." },
        { type: "bullet", text: "<b>[[October 1453]]</b> - [[Edward of Westminster]] is born, with [[Somerset]] as his godfather, but cannot be acknowledged by the king." },
        { type: "bullet", text: "<b>[[November 1453]]</b> - [[Somerset]] is placed in the [[Tower of London]]." },
        { type: "bullet", text: "<b>[[January 1454]]</b> - [[Anjou]] makes plans to become [[regent]]." },
        { type: "bullet", text: "<b>[[February 1454]]</b> - Parliament is called but is very poorly attended due to fear of offending Henry VI." },
        { type: "bullet", text: "<b>[[22 March 1454]]</b> - Death of [[John Kemp]], Archbishop of Canterbury. Royal authority is required to name a replacement." },
        { type: "bullet", text: "<b>[[27 March 1454]]</b> - [[Richard of York]] is named [[protector]]. During his protectorate, he installs [[Salisbury]] as chancellor and [[Thomas Bourchier]] as Archbishop of Canterbury. In general, the protectorate is successful, and described as \"able, vigorous, and moderate government\". For example, he polices his own men to stop them from breaking the law. However, he is partially hindered by Lancastrian opposition." },
        { type: "bullet", text: "<b>[[July 1454]]</b> - [[Exeter]], a loyal Lancastrian, is imprisoned at [[Pontefract]] Castle." },
        { type: "bullet", text: "<b>[[25 December 1454]]</b> - Henry VI recovers from his catatonic state, and acknowledges his son as \"a fair little stud\"." },
        { type: "bullet", text: "<b>[[30 December 1454]]</b> - Richard of York's authority as protector is dissolved." },
        { type: "bullet", text: "<b>[[22 May 1455]]</b> - First Battle of [[St. Albans]] - [[Yorkist]] victory. In a short battle which lasted probably about an hour, about [[60]] casualties occur, of which most are nobles and officers. These include [[Northumberland]], [[Clifford]], and [[Somerset]], who were killed, and Henry VI, who is wounded by an arrow to the neck. The battle featured about [[5000]] troops. The Yorkists are definitively in control following the engagement." },
        { type: "bullet", text: "<b>[[November 1455]]</b> - York's [[second protectorate]] begins - partially in response to the [[Bonville-Courtenay]] fued." },
        { type: "bullet", text: "<b>[[February 1456]]</b> - York's second protectorate ends." },
        { type: "bullet", text: "<b>[[1456]]</b> - Anjou moves the court to [[Coventry]], a more pro-Lancastrian area." },
        { type: "bullet", text: "<b>[[1456]]</b> - [[Walter Devereux]], a Yorkist ally, seizes castles in Wales, for example at [[Aberystwyth]], for the Yorkists." },
        { type: "bullet", text: "<b>[[1457]]</b> - [[Pierre de Breze]], a Frenchman with ties to Anjou, raids [[Sandwich]]." },
        { type: "bullet", text: "<b>[[December 1457]]</b> - Anjou introduced [[conscription]] which York criticised as a '[[French invention]]'." },
        { type: "bullet", text: "<b>[[25 March 1458]]</b> - Henry VI puts on the [[Loveday parade]], a disastrous attempt to reconcile the two factions. It sees Anjou and York, Somerset and Salisbury, and Exeter and Warwick walk hand-in-hand through London. However, it fails in its objectively and is extremely [[expensive]]." }
    ],
    "1458-1461": [
        { type: "bullet", text: "<b>[[25 March 1458]]</b> - Henry VI puts on the [[Loveday parade]], a disastrous attempt to reconcile the two factions. It sees Anjou and York, Somerset and Salisbury, and Exeter and Warwick walk hand-in-hand through London. However, it fails in its objectively and is extremely [[expensive]]." },
        { type: "bullet", text: "<b>[[May 1458]]</b> - After returning to [[Calais]], Warwick takes up [[piracy]] by raiding Spanish and Hanseatic ships without the permission of Parliament or the king. This makes him much richer and more popular, especially with the soldiers." },
        { type: "bullet", text: "<b>[[November 1458]]</b> - Warwick, who was called to council to answer for his actions, is almost killed during a skirmish between his retainer and the royal household troops." },
        { type: "bullet", text: "<b>[[23 September 1459]]</b> - Battle of [[Blore Heath]] - [[Yorkist]] victory. Salisbury defeated Audley and Dudley." },
        { type: "bullet", text: "<b>[[9 October 1459]]</b> - [[Somerset]] is appointed Captain of Calais. He will attempt to take up his post multiple times, but is prevented by [[Warwick]]." },
        { type: "bullet", text: "<b>[[12 October 1459]]</b> - Rout of [[Ludford]] - [[Lancastrian]] victory. The defection of [[Andrew Trollope]] and poor morale on facing a large royal force lead to the Yorkist force disintegrating." },
        { type: "bullet", text: "<b>[[October 1459]]</b> - The Yorkist leaders flee; Rutland and York go to [[Ireland]], while Warwick, Salisbury, and March go to [[Calais]]." },
        { type: "bullet", text: "<b>[[20 November 1459]]</b> - In the [[Parliament of Devils]], Anjou and her Lancastrian allies implement [[27]] Acts of Attainder, which include the \"[[corruption of blood]]\" clause, disinheriting the Yorkist heirs." },
        { type: "bullet", text: "<b>[[January 1460]]</b> - Raid of [[Sandwich]] - [[Yorkist]] victory. [[John Dynham]] catches the Lancastrian garrison by surprise; [[Earl Rivers]] is still in his bed when the forces arrive. The raid establishes [[naval supremacy]] which enables the Yorkist invastion later in the year." },
        { type: "bullet", text: "<b>[[April 1460]]</b> - Battle of [[Newnham Bridge]] - [[Yorkist]] victory. Warwick finally defeats [[Somerset]] and secures Calais for the Yorkists." },
        { type: "bullet", text: "<b>[[June 1460]]</b> - The Yorkists in Calais cross to England." },
        { type: "bullet", text: "<b>[[10 July 1460]]</b> - Battle of [[Northampton]] - [[Yorkist]] victory. Heavy rain disables the Lancastrian [[cannons]] and [[Buckingham]] is killed." },
        { type: "bullet", text: "<b>[[September 1460]]</b> - York returns from Ireland, acting in the manner of a [[king]]. He touches the throne, announces his progress with trumpeters, and emblazons his arms with the [[royal arms]]." },
        { type: "bullet", text: "<b>[[25 October 1460]]</b> - In the [[Act of Accord]], a grand compromise is established whereby Henry VI would remain king for life but [[York]] would become his heir over [[Edward of Westminster]]." },
        { type: "bullet", text: "<b>[[30 December 1460]]</b> - Battle of [[Wakefield]] - [[Lancastrian]] victory. York, Salisbury, and Rutland are killed. The former has his head put up on the walls of York wearing a [[paper crown]]." },
        { type: "bullet", text: "<b>[[2 February 1461]]</b> - Battle of [[Mortimer's Cross]] - [[Yorkist]] victory. The [[parhelion]] is interpreted as a divine symbol. [[Owen Tudor]] is killed." },
        { type: "bullet", text: "<b>[[17 February 1461]]</b> - Second Battle of [[St. Albans]] - [[Lancastrian]] victory. Warwick is outflanked by a [[night march]]." },
        { type: "bullet", text: "<b>[[4 March 1461]]</b> - Proclamation of [[Edward IV]]; the Yorkists claim that Henry VI has voided his right to reign by breaking the [[Act of Accord]]." },
        { type: "bullet", text: "<b>[[29 March 1461]]</b> - Battle of [[Towton]] - [[Yorkist]] victory. The battle features up to [[50,000]] troops or up to [[3%]] of the population. A [[blizzard]] hindered the Lancastrian arrows while helping the Yorkist archers. [[Norfolk's]] arrival proved decisive for the Yorkists. Henry VI fled to [[Scotland]]." },
        { type: "bullet", text: "<b>[[5 April 1461]]</b> - Edward IV arrived in York, where he took down the heads of the Yorkist leaders and replaced them with Lancastrians." },
        { type: "bullet", text: "<b>[[28 June 1461]]</b> - Coronation of [[Edward IV]] in Westminster; his brothers are invested as [[Clarence]] and [[Gloucester]]." }
    ],
    "1461-1469": [
        { type: "bullet", text: "<b>[[28 June 1461]]</b> - Coronation of [[Edward IV]] in Westminster; his brothers are invested as [[Clarence]] and [[Gloucester]]." },
        { type: "bullet", text: "<b>[[1461]]</b> - [[113]] Attainders are issued against the enemies of Edward IV." },
        { type: "bullet", text: "<b>[[24 June 1462]]</b> - In the Treaty of [[Chinon]], [[Louis XI]] agrees to aid Anjou in retaking the throne for the Lancastrians in exchange for [[Calais]]." },
        { type: "bullet", text: "<b>[[25 October 1462]]</b> - [[Pierre de Breze]] raids [[Bamburgh]] and [[Dunstanburgh]]." },
        { type: "bullet", text: "<b>[[October 1463]]</b> - Edward IV adopted a diplomatic strategy whereby in the Treaty of [[Hesdin]] he secured guarantees from [[Louis XI]] not to support rival claimants and in a peace with [[Scotland]] he secured the expulsion of Henry Vi from Edinburgh." },
        { type: "bullet", text: "<b>[[25 April 1464]]</b> - Battle of [[Hedgeley Moor]] - [[Yorkist]] victory. Montague defeated and executed [[Ralph Percy]]." },
        { type: "bullet", text: "<b>[[May 1464]]</b> - Edward IV secretly marries [[Elizabeth Woodville]], preventing the potential match to [[Bona of Savoy]] which Warwick had advocated." },
        { type: "bullet", text: "<b>[[15 May 1464]]</b> - Battle of [[Hexham]] - [[Yorkist]] victory. Montague defeated and executed [[Somerset]]. Henry VI was forced to flee into the woods." },
        { type: "bullet", text: "<b>[[September 1464]]</b> - [[Elizabeth Woodville]] is introduced as queen of England, humiliating [[Warwick]]." },
        { type: "bullet", text: "<b>[[January 1465]]</b> - [[John Woodville]], a 19 year old, married the three-time widow [[Katherine Neville]] in a 'diabolical marriage'." },
        { type: "bullet", text: "<b>[[26 May 1465]]</b> - Elizabeth Woodville is coronated." },
        { type: "bullet", text: "<b>[[July 1465]]</b> - Henry VI is captured and put in the [[Tower of London]]." },
        { type: "bullet", text: "<b>[[11 February 1466]]</b> - Further Woodville marriages take place, including for example Katherine Woodville to [[Henry Stafford]]. This limits the marriage opportunities of Warwick's daughters." },
        { type: "bullet", text: "<b>[[1466]]</b> - Edward IV makes a private pledge of friendship with the [[Duke of Burgundy]]." },
        { type: "bullet", text: "<b>[[June 1467]]</b> - Edward IV declares to Parliament that \"[[I will live upon mine own]]\"." },
        { type: "bullet", text: "<b>[[12 June 1467]]</b> - Jousting at Smithfield! [[Anthony Woodville]] faces [[Anthony, Bastard of Burgundy]]." },
        { type: "bullet", text: "<b>[[1467]]</b> - [[George Neville]] is removed as chancellor after he did not show up for jousting." },
        { type: "bullet", text: "<b>[[January 1468]]</b> - Warwick is summoned to council at [[Coventry]] in an attempt to mend relations with Edward IV." },
        { type: "bullet", text: "<b>[[3 July 1468]]</b> - [[Margaret of York]] is married to [[Charles the Bold]]." },
        { type: "bullet", text: "<b>[[April 1469]]</b> - The first [[Robin of Redesdale]] revolt." }
    ],
    "1469-1471": [
        { type: "bullet", text: "<b>[[April 1469]]</b> - The first [[Robin of Redesdale]] revolt." },
        { type: "bullet", text: "<b>[[June 1469]]</b> - The second [[Robin of Redesdale]] revolt." },
        { type: "bullet", text: "<b>[[11 July 1469]]</b> - [[Isabel Neville]] marries [[Clarence]] in Calais." },
        { type: "bullet", text: "<b>[[12 July 1469]]</b> - Warwick published a [[pamphlet]] from Calais against the evil councillors surrounding Edward IV and airing his grievances." },
        { type: "bullet", text: "<b>[[July 1469]]</b> - Warwick crosses to England. The gates of [[London]] are opened to him, and he begins to openly support the rebels against Edward IV." },
        { type: "bullet", text: "<b>[[24 July 1469]]</b> - Battle of [[Edgecote]] - [[rebel]] victory. The [[Herbert-Devon]] dispute led to Devon withdrawing his archers. Edward IV is under Warwick's control." },
        { type: "bullet", text: "<b>[[August 1469]]</b> - Warwick executed [[John Woodville]] and [[Earl Rivers]]." },
        { type: "bullet", text: "<b>[[September 1469]]</b> - Edward IV was released from custody due to the nobles not being cooperative with his administration." },
        { type: "bullet", text: "<b>[[October 1469]]</b> - Edward IV returned to London surrounded by loyal nobles like the [[Duke of Gloucester]]." },
        { type: "bullet", text: "<b>[[12 March 1470]]</b> - Battle of [[Losecote Field]] - [[royal]] victory. 30,000 rebels under [[Robert Welles]], Warwick's puppet, are defeated by Edward IV. Warwick and Clarence are declared [[traitors]]." },
        { type: "bullet", text: "<b>[[20 March 1470]]</b> - An inheritance dispute in Gloucestershire leads to the Battle of [[Nibley Green]], the final battle between private armies on English soil." },
        { type: "bullet", text: "<b>[[22 July 1470]]</b> - In the Treaty of [[Angers]], Louis XI allied with Warwick and Anjou. Anjou forced Warwick to kneel for [[15 minutes]] upon their meeting. Clarence was sidelined. The marriage of [[Anne Neville]] and [[Edward of Westminster]] was organised." },
        { type: "bullet", text: "<b>[[3 October 1470]]</b> - Henry VI was restored and freed from the tower - he was \"amazed\" at the turn of events." },
        { type: "bullet", text: "<b>[[6 October 1470]]</b> - Warwick, Stanley, and Shrewsbury rode into London and greeted Henry VI as their rightful king. A [[pamphlet]] was issued announcing this." },
        { type: "bullet", text: "<b>[[13 October 1470]]</b> - Henry VI is paraded in blue robes through London, but this backfired as he looked \"[[mute as a crowned calf]]\" according to one chronicler." },
        { type: "bullet", text: "<b>[[3 December 1470]]</b> - Louis XI invaded [[Burgundy]]." },
        { type: "bullet", text: "<b>[[13 December 1470]]</b> - [[Anne Neville]] married [[Edward of Westminster]]." },
        { type: "bullet", text: "<b>[[December 1470]]</b> - Charles the Bold gave Edward IV [[50,000 crowns]] to take back the throne." },
        { type: "bullet", text: "<b>[[14 February 1471]]</b> - The Calais garrison was ordered to attack [[Burgundy]]." },
        { type: "bullet", text: "<b>[[12 March 1471]]</b> - Edward IV unsuccessfully landed at [[Cromer]]." },
        { type: "bullet", text: "<b>[[14 March 1471]]</b> - Edward IV landed at [[Ravenspurn]]. He had [[1200]] men and claimed to only wish to recover his Dukedom of York. Inexplicably, he went unattacked by [[Northumberland]] and [[Montague]] despite his small force and failure to secure any allies due to [[Oxford's]] proactive imprisonment of Yorkist allies in the region." },
        { type: "bullet", text: "<b>[[3 April 1471]]</b> - Gloucester convinced [[Clarence]] to defect back to Edward IV. He brings [[4000]] men." },
        { type: "bullet", text: "<b>[[11 April 1471]]</b> - The gates of London were opened to Edward IV; the merchants in the city thought they might obtain better trade deals under Yorkist rule." },
        { type: "bullet", text: "<b>[[14 April 1471]]</b> - Battle of [[Barnet]] - [[Yorkist]] victory. First, Edward IV was able to evade Warwick's cannons by [[night marching]] closer to the enemy force. Then, the [[Earl of Oxford]] arms were mistaken for the Yorkist sun in splendour, leading to friendly fire. [[Warwick]] was killed in the fighting." },
        { type: "bullet", text: "<b>[[4 May 1471]]</b> - Battle of [[Tewkesbury]] - [[Yorkist]] victory. [[Edward of Westminster]] was killed." },
        { type: "bullet", text: "<b>[[12 May 1471]]</b> - The [[Bastard of Fauconberg]] attacked London, burning 60 houses on London Bridge." },
        { type: "bullet", text: "<b>[[22 May 1471]]</b> - Henry VI dies." },
        { type: "bullet", text: "<b>[[September 1471]]</b> - Fauconberg is executed; his head is placed on [[London Bridge]], facing towards Kent." }
    ],
    "1471-1483": [
        { type: "heading", text: "John de Vere" },
        { type: "bullet", text: "<b>[[1472]]</b> - [[John de Vere]] raided Calais with the support of [[George Neville]], Archbishop of York." },
        { type: "bullet", text: "<b>[[26 April 1472]]</b> - John de Vere was arrested for treason." },
        { type: "bullet", text: "<b>[[September 1473]]</b> - John de Vere captured [[St. Michael's Mount]] and was able to hold it for several months due to incompetent Yorkist leadership." },
        { type: "bullet", text: "<b>[[15 February 1474]]</b> - John de Vere was captured." },
        { type: "heading", text: "Consolidation" },
        { type: "bullet", text: "<b>[[June 1471]]</b> - Gloucester was given new titles such as [[Warden of the West March]] and Chief Steward of the Duchy of Lancaster." },
        { type: "bullet", text: "<b>[[July 1471]]</b> - Henry and Jasper Tudor fled to [[Brittany]]." },
        { type: "bullet", text: "<b>[[12 July 1471]]</b> - Gloucester married [[Anne Neville]] despite the opposition of Clarence and the lack of a [[Papal dispensation]]." },
        { type: "bullet", text: "<b>[[1471]]</b> - [[Hastings]] was given the Lieutenancy of Calais despite Earl Rivers' desire for the job." },
        { type: "bullet", text: "<b>[[1471-1472]]</b> - The [[Black Book]] reduced household expenditure from £16,000 to [[£11,000]]." },
        { type: "bullet", text: "<b>[[February 1472]]</b> - Edward IV attempted to split the [[Warwick]] lands, but this failed to appease his brothers." },
        { type: "bullet", text: "<b>[[October 1472]]</b> - Parliament raised [[£30,000]] in taxation for the war in France. [[Benevolences]], an unpopular innovation, raised another [[£22,000]]." },
        { type: "bullet", text: "<b>[[May 1474]]</b> - [[Anne Beauchamp]] was declared legally dead by Parliament and her inheritance was divided between Isabel and Anne Neville. This blatant disregard for inheritance law scared the gentry." },
        { type: "heading", text: "King’s Great Enterprise" },
        { type: "bullet", text: "<b>[[11 September 1472]]</b> - A treaty was conlcuded with [[Brittany]], including provisions for the invasion of France being made." },
        { type: "bullet", text: "<b>[[1474]]</b> - A truce was concluded with the [[Hanseatic League]]." },
        { type: "bullet", text: "<b>[[1474]]</b> - The Anglo-Scottish treaty made peace with Scotland and arranged for the marriage of [[Cecily of York]] to the Scottish heir." },
        { type: "bullet", text: "<b>[[25 July 1474]]</b> - The Treaty of [[London]] arranged for Burgundy to support the invasion of France." },
        { type: "bullet", text: "<b>[[4 July 1475]]</b> - Edward IV landed at Calais with [[12,000]] men, beginning the war with France." },
        { type: "bullet", text: "<b>[[14 July 1475]]</b> - [[Charles the Bold]] rendezvoused with the English force, but brought [[no troops]] of his own." },
        { type: "bullet", text: "<b>[[29 August 1475]]</b> - The Treaty of [[Picquigny]] finalised a massive financial victory for the English; its terms included [[75,000 crowns]] to be paid intially, an annual sum of [[50,000 crowns]] to be paid, a payment of 50,000 crowns for the ransom of Margaret of Anjou, and pensions for English nobles. However, an end to hostilities was [[unpopular]] with Gloucester." },
        { type: "heading", text: "Fall of Clarence" },
        { type: "bullet", text: "<b>[[22 December 1476]]</b> - [[Isabel Neville]] died." },
        { type: "bullet", text: "<b>[[April 1477]]</b> - Clarence arrested [[Ankarette Twynyho]], Thursby, and Tocoats on charges of poisoning his wife. All except Tocoats were executed." },
        { type: "bullet", text: "<b>[[May 1477]]</b> - [[John Stacy]], an astronomer who supported Clarence, was arrested on charges of treason. He implicated [[Thomas Burdett]], who Clarence chose to vigorously defend in blatant opposition to the king's prosecution." },
        { type: "bullet", text: "<b>[[June 1477]]</b> - Clarence was arrested." },
        { type: "bullet", text: "<b>[[January 1478]]</b> - Clarence was [[attainted]]." },
        { type: "bullet", text: "<b>[[18 February 1478]]</b> - Clarence was executed." },
        { type: "heading", text: "Later Reign" },
        { type: "bullet", text: "<b>[[January 1478]]</b> - Richard of Shrewsbury married [[Anne Mowbray]]." },
        { type: "bullet", text: "<b>[[1478]]</b> - A breach of the truce occured on the Anglo-Scottish border; Edward IV demanded reparations and threatened war if these were not paid." },
        { type: "bullet", text: "<b>[[May 1480]]</b> - The Earl of Angus burned [[Bamburgh]]; notably, he targeted the town rather than just the castle." },
        { type: "bullet", text: "<b>[[August 1480]]</b> - Gloucester was appointed [[Lieutenant-General]] of the Realm." },
        { type: "bullet", text: "<b>[[June 1481]]</b> - [[Lord Howard]] raided the Firth of Forth." },
        { type: "bullet", text: "<b>[[November 1481]]</b> - Edward IV returned to London rather than continue the prosecution of the Scottish campaign personally." },
        { type: "bullet", text: "<b>[[1482]]</b> - [[Alexander, Duke of Albany]] arrived in England. He was the disaffected brother of James IV and thus a potential replacement to the king." },
        { type: "bullet", text: "<b>[[1482]]</b> - Gloucester invaded Scotland. He reached [[Edinburgh]], where the nobles deposed and imprisoned James IV." },
        { type: "bullet", text: "<b>[[March 1482]]</b> - [[Mary of Burgundy]] died, threatening the English alliance with Burgundy." },
        { type: "bullet", text: "<b>[[August 1482]]</b> - Gloucester captured [[Berwick]] on his way out of Scotland." },
        { type: "bullet", text: "<b>[[23 December 1482]]</b> - In the Treaty of [[Arras]], England is sidelined from European policy by France and Maximilian of Burgundy; France stops paying the annual tribute agreed in Picquigny." },
        { type: "bullet", text: "<b>[[January 1483]]</b> - Gloucester was given [[palatinate powers]] in the north of England." },
        { type: "bullet", text: "<b>[[9 April 1483]]</b> - Edward IV unexpectedly died." }
    ],
    "1483-1485": [
        { type: "bullet", text: "<b>[[9 April 1483]]</b> - Edward IV unexpectedly died." },
        { type: "bullet", text: "<b>[[14 April 1483]]</b> - News of Edward IV's death reached [[Ludlow]], where his son was under the care of [[Earl Rivers]]." },
        { type: "bullet", text: "<b>[[24 April 1483]]</b> - A royal party set off from Ludlow to London." },
        { type: "bullet", text: "<b>[[29-30 April 1483]]</b> - Gloucester and Buckingham joined and died with the royal party at [[Stony Stratford]]." },
        { type: "bullet", text: "<b>[[1 May 1483]]</b> - Gloucester suddently arrested Rivers, Grey, Hawte, and Vaughan." },
        { type: "bullet", text: "<b>[[May 1483]]</b> - Elizabeth Woodville fled into [[sanctuary]] with her children, Lionel of Salisbury, and the Great Seal." },
        { type: "bullet", text: "<b>[[4 May 1483]]</b> - Edward V entered London with Gloucester and Buckingham." },
        { type: "bullet", text: "<b>[[10 May 1483]]</b> - Gloucester was named [[protector]]." },
        { type: "bullet", text: "<b>[[13 June 1483]]</b> - Richard of Shrewsbury was released from sanctuary after Thomas Bourchier, Archbishop of Canterbury sweared to protect the boy with his life." },
        { type: "bullet", text: "<b>[[16 June 1483]]</b> - [[Hastings]] was suddenly betrayed and executed at a council meeting; just three hours after Gloucester brought charges of treason on him, he was executed on timber intended for repairs of the building." },
        { type: "bullet", text: "<b>[[22 June 1483]]</b> - [[Ralph Shaw]] preached a sermon claiming that Edward IV had already married [[Eleanor Talbot]] and thus her marriage to Elizabeth Woodville was illegitimate." },
        { type: "bullet", text: "<b>[[25 June 1483]]</b> - Gloucester executed Grey and Rivers. He was alos petitioned by the Lords and Commons to take up the kingship on this date." },
        { type: "bullet", text: "<b>[[26 June 1483]]</b> - [[Richard III]] was proclaimed as king." },
        { type: "bullet", text: "<b>[[6 July 1483]]</b> - Richard III was coronated; this was very well attended due to the presence of nobles already in London for the coronation of Edward V." },
        { type: "bullet", text: "<b>[[Summer 1483]]</b> - The [[princes in the tower]] were seen less and less and eventually disappeared completely." },
        { type: "bullet", text: "<b>[[October 1483]]</b> - The [[Buckingham Rebellion]] broke out in the south of England; it included much of Edward IV's household. The rebellion was unsuccessful due to Buckingham's failure to join the rebels as a result of the \"Great Water\" - the flooding of the [[River Severn]] - and the swift intervention of [[Norfolk]] against the rebels." },
        { type: "bullet", text: "<b>[[October 1483]]</b> - [[Henry Tudor]] attempted to cross to England, but after finding the rebellion largely unsuccessful he returned to Brittany." },
        { type: "bullet", text: "<b>[[2 November 1483]]</b> - Buckingham was captured and executed in Salisbury." },
        { type: "bullet", text: "<b>[[25 December 1483]]</b> - Henry Tudor promised to marry [[Elizabeth of York]] in Rennes Cathedral." },
        { type: "bullet", text: "<b>[[23 January 1484]]</b> - In Richard III's first Parliament, the [[Titulus Regius]] was passed in which Edward IV's supposed marriage to Eleanor Talbot was confirmed. Finally, [[97]] Acts of Attainder were passed against his enemies." },
        { type: "bullet", text: "<b>[[March 1484]]</b> - The Woodvilles returned from sanctuary after Richard III promised to protect them." },
        { type: "bullet", text: "<b>[[9 April 1484]]</b> - [[Edward of Middleham]] died, plunging Richard III and Anne Neville into deep grief." },
        { type: "bullet", text: "<b>[[July 1484]]</b> - The [[Council of the North]] was formally established under the leadership of [[John de la Pole]], Earl of Lincoln." },
        { type: "bullet", text: "<b>[[21 September 1484]]</b> - Richard III agreed a three-year truce with Scotland in the Treaty of [[Nottingham]]." },
        { type: "bullet", text: "<b>[[7 Decemebr 1484]]</b> - Richard III issued a proclamation against Henry Tudor and his supporters." },
        { type: "bullet", text: "<b>[[December 1484]]</b> - [[William Collingbourne]] was executed for treason in an example of continued opposition to Richard III." },
        { type: "bullet", text: "<b>[[16 March 1485]]</b> - [[Anne Neville]] died. A [[solar eclipse]] on the same day was interpreted as a bad omen, and it was suspected Richard III poisoned her." },
        { type: "bullet", text: "<b>[[30 March 1485]]</b> - Richard III publicly denied his intention to marry his niece, Elizabeth of York." },
        { type: "bullet", text: "<b>[[1485]]</b> - The English economy is depleted to the point of Richard III selling and pawning [[royal jewels]] to raise funds." },
        { type: "bullet", text: "<b>[[1 August 1485]]</b> - Henry Tudor set sail from Harfleur with his English exiles and [[1800]] French mercenaries under [[Philibert de Chandee]]." },
        { type: "bullet", text: "<b>[[7 August 1485]]</b> - Henry Tudor landed at [[Mill Bay]], Pembrokeshire. He capitalised on his Welsh ancestry and promises like the Lieutenancy of Wales to [[Rhys ap Thomas]] to gain local support. He has a secret meeting with the [[Stanleys]]." },
        { type: "bullet", text: "<b>[[21 August 1485]]</b> - The date to which Henry VII's reign was predated to." },
        { type: "bullet", text: "<b>[[22 August 1485]]</b> - Battle of [[Bosworth]] - Tudor victory. The inaction of [[Northumberland]] and the final intervention of [[William Stanley]] proved decisive. Richard III was killed leading a cavalry charge." }
    ],
    "1485-1499": [
        { type: "heading", text: "CONSOLIDATION" },
        { type: "bullet", text: "<b>[[22 August 1485]]</b> - Battle of [[Bosworth]] - Tudor victory. Henry VII rules by right of [[conquest]]." },
        { type: "bullet", text: "<b>[[October 1485]]</b> - A [[general pardon]] is issued to those who fought for Richard III and did not go against Henry VII." },
        { type: "bullet", text: "<b>[[30 October 1485]]</b> - Henry VII was coronated." },
        { type: "bullet", text: "<b>[[7 November 1485]]</b> - Henry VII's first Parliament met; the [[Titulus Regius]] is revoked and some new titles are invested like Jasper Tudor as Duke of Bedford." },
        { type: "bullet", text: "<b>[[18 January 1486]]</b> - Henry VII married [[Elizabeth of York]]." },
        { type: "bullet", text: "<b>[[September 1486]]</b> - [[Arthur]] was born." },
        { type: "bullet", text: "<b>[[25 November 1487]]</b> - Elizabeth of York was coronated." },
        { type: "bullet", text: "<b>[[28 June 1491]]</b> - [[Henry]] was born." },
        { type: "heading", text: "LOVELL AND STAFFORD, YORKSHIRE, CORNWALL" },
        { type: "bullet", text: "<b>[[March-April 1486]]</b> - [[Lovell]] and the [[Staffords]] attempted to raise troops against Henry VII in Yorkshire." },
        { type: "bullet", text: "<b>[[April 1486]]</b> - Henry VII reaches [[York]] on his royal progress; the rebellion dissipated without a battle." },
        { type: "bullet", text: "<b>[[11 May 1486]]</b> - [[Humphrey Stafford]] was executed after attempting to claim sanctuary while Lovell escaped to Burgundy and Thomas Stafford was pardoned." },
        { type: "bullet", text: "<b>[[Late 1486]]</b> - [[Lambert Simnel]] emerged in Oxford, tutored by [[Richard Simons]]. They travelled to Ireland, claiming to be the [[Earl of Warwick]]." },
        { type: "bullet", text: "<b>[[February 1487]]</b> - Henry VII summoned council, which resolved to parade the [[real Warwick]] through London and exile [[Elizabeth Woodville]] to a nunnery." },
        { type: "bullet", text: "<b>[[5 May 1487]]</b> - [[Lincoln]] arrived in Ireland, bringing [[2000]] German mercenaries under [[Martin Schwartz]] to join the rebels, funded by [[Margaret of Burgundy]]." },
        { type: "bullet", text: "<b>[[24 May 1487]]</b> - Simnel was coronated as [[Edward VI]] in Christchurch Cathedral, Dublin. He had the support of Irish nobles like [[Gerald FitzGerald]], Earl of Kildare." },
        { type: "bullet", text: "<b>[[4 June 1487]]</b> - The rebels landed at [[Piel Island]] in Lancashire but failed to raise much additional support." },
        { type: "bullet", text: "<b>[[16 June 1487]]</b> - Battle of [[Stoke]] - Tudor victory. The Irish rebels were underequipped and inexperienced. Thomas FitzGerald, Lincoln, and Schwartz were killed. Lovell disappeared. Simnel was given a job in the [[royal kitchens]]." },
        { type: "bullet", text: "<b>[[20 April 1489]]</b> - The [[Yorkshire]] rebellion breaks out over harsh [[taxation]] to fund English involvement in the Breton crisis. Initially less than 700 men under [[Robert Chamber]]." },
        { type: "bullet", text: "<b>[[28 April 1489]]</b> - [[Northumberland]] was murdered by the rebel mob at Cock Lodge." },
        { type: "bullet", text: "<b>[[17 May 1489]]</b> - The rebels captured York with additional support given to them by [[John Egremont]], a minor gentry." },
        { type: "bullet", text: "<b>[[May 1489]]</b> - The rebels were defeated by the [[Earl of Surrey]]." },
        { type: "bullet", text: "<b>[[January-February 1497]]</b> - Taxation is levied to fund war with Scotland. It was supposed to not be applied to the poorest subjects; however, [[corruption]] in Cornwall led to this not being implemented properly." },
        { type: "bullet", text: "<b>[[May 1497]]</b> - [[6000]] rebels under [[Michael Joseph]], a blacksmith, marched to [[Blackheath]] in order to present their grievances against councillors like Reginald Bray. They were joined by [[Lord Audley]]." },
        { type: "bullet", text: "<b>[[17 June 1497]]</b> - Battle of [[Deptford Bridge]] - royal victory. A force of 8000 men under [[Lord Daubenay]] defeated the rebels. Henry VII took the rebels off guard by attacking two days early. The leaders ere executed." },
        { type: "heading", text: "FOREIGN POLICY not related to Warbeck" },
        { type: "bullet", text: "<b>[[July 1488]]</b> - France invaded [[Brittany]]." },
        { type: "bullet", text: "<b>[[28 July 1488]]</b> - France defeated Brittany in the Battle of [[St. Aubin-du-Cormier]]." },
        { type: "bullet", text: "<b>[[February 1489]]</b> - In the Treaty of [[Redon]], England agreed to send [[6000]] men to help defend Brittany." },
        { type: "bullet", text: "<b>[[26 March 1489]]</b> - In the Treaty of [[Medina del Campo]], England agreed mutual defence as well as trade relations and a future marriage alliance with [[Catherine of Aragon]] with Spain." },
        { type: "bullet", text: "<b>[[11 September 1490]]</b> - In the Treaty of [[Woking]], England agreed an alliance with [[Maximilian of Burgundy]] against French expansionism." },
        { type: "heading", text: "WARBECK" },
        { type: "bullet", text: "<b>[[April-May 1487]]</b> - [[Warbeck]] spent time at the Portuguese court, where he made connections with the Bramptons." },
        { type: "bullet", text: "<b>[[November 1491]]</b> - Warbeck arrived in [[Cork]], where he was proclaimed as the [[Earl of Warwick]] (then Richard of York) and gained the support of the [[Earl of Desmond]], John Taylor, and John Atwater." },
        { type: "bullet", text: "<b>[[December 1491]]</b> - Henry VII quickly sent a force to Ireland which forced Warbeck to flee." },
        { type: "bullet", text: "<b>[[March 1492]]</b> - [[Charles VIII]] provided Warbeck with a fleet to take him to Harfleur." },
        { type: "bullet", text: "<b>[[2 October 1492]]</b> - Henry VII invaded France, partially motivated by Charles VIII's supporting of Warbeck." },
        { type: "bullet", text: "<b>[[3 November 1492]]</b> - The Treaty of [[Etaples]] ended Henry VII's invasion; Charles VIII agreed to pay [[£159,000]] and not to support any more imposters." },
        { type: "bullet", text: "<b>[[12 December 1492]]</b> - Warbeck was taken in by [[Margaret of Burgundy]] and Maximilian." },
        { type: "bullet", text: "<b>[[1493]]</b> - Henry VII sent a force to Ireland to assess support for Warbeck and stayed in [[Kenilworth Castle]]." },
        { type: "bullet", text: "<b>[[July 1493]]</b> - Ambassadors were sent to Margaret of Burgundy who personally insulted her and accused her of plotting. [[Trade embargos]] were imposed." },
        { type: "bullet", text: "<b>[[December 1493]]</b> - Maximilian became Holy Roman Emperor; Warbeck attended his father's funeral." },
        { type: "bullet", text: "<b>[[November 1494]]</b> - Prince Henry was created [[Duke of York]], the title which Warbeck claimed." },
        { type: "bullet", text: "<b>[[December 1494]]</b> - [[Poynings' Law]] was introduced in Ireland, requiring the English king to approve any bill before it was debated in the Irish Parliament." },
        { type: "bullet", text: "<b>[[January-February 1495]]</b> - English plotters were put on trial for supporting Warbeck." },
        { type: "bullet", text: "<b>[[16 February 1495]]</b> - [[William Stanley]], the Chamberlain, confessed and was executed for treason." },
        { type: "bullet", text: "<b>[[3 July 1495]]</b> - Warbeck landed at Kent with 1300 men; however, the Kentish killed 150 rebels and forced Warbeck to flee." },
        { type: "bullet", text: "<b>[[July-August 1495]]</b> - Warbeck sieged [[Waterford]] with the Earl of Desmond; Henry VII dispatched Poynings against Warbeck, who was successful." },
        { type: "bullet", text: "<b>[[Late 1495]]</b> - Warbeck was received as a prince by [[James IV]]." },
        { type: "bullet", text: "<b>[[January 1496]]</b> - Warbeck was allowed to marry [[Katherine Gordon]] and granted Falkland Palace to use as a base." },
        { type: "bullet", text: "<b>[[February 1496]]</b> - The [[Intercursus Magnus]] ended the trade embargos with Burgundy." },
        { type: "bullet", text: "<b>[[September 1496]]</b> - Warbeck agreed to invade England and surrender [[Berwick]] to James IV in exchange for 50,000 marks and an army. [[Lord Bothwell]] informed Henry VII of this plan." },
        { type: "bullet", text: "<b>[[21 September 1496]]</b> - The invasion took place, but failed due to the poor preparation of the Scottish troops and the north under [[Surrey]] not joining Warbeck. He is defeated by Lord Neville." },
        { type: "bullet", text: "<b>[[6 July 1497]]</b> - James IV refused to take in Warbeck, as he wished to establish a truce with Henry VII whereby he could marry [[Margaret of York]]." },
        { type: "bullet", text: "<b>[[7 September 1497]]</b> - Warbeck landed in Cornwall, where he was well received and managed to capture [[St. Michael's Mount]]." },
        { type: "bullet", text: "<b>[[17 September 1497]]</b> - Warbeck led 8000 rebels. However, he failed to capture Exeter thanks to [[Devon's]] defence, and he was deserted by his men." },
        { type: "bullet", text: "<b>[[October 1497]]</b> - Warbeck was captured and dragged from [[sanctuary]] following new laws established after Lovell and Stafford's rebellion." },
        { type: "bullet", text: "<b>[[June 1498]]</b> - Warbeck attempted to [[escape]] from custody but was quickly captured." },
        { type: "bullet", text: "<b>[[12 February 1499]]</b> - [[Ralph Wulford]] was executed after a friar began preaching that he was the Earl of Warwick in Kent." },
        { type: "bullet", text: "<b>[[3 August 1499]]</b> - A plot to flee Warbeck and Warwick was discovered." },
        { type: "bullet", text: "<b>[[23 November 1499]]</b> - Warbeck was executed." },
        { type: "bullet", text: "<b>[[28 November 1499]]</b> - Warwick was executed." }
    ]
};

// --- UNIFIED NOTES MODE LOGIC ---
let currentNotesMode = { spain: 'study', wotr: 'study' };

['spain', 'wotr'].forEach(prefix => {
    const btnStudy = document.getElementById(`${prefix}-btn-study`);
    const btnPractice = document.getElementById(`${prefix}-btn-practice`);
    const btnRecite = document.getElementById(`${prefix}-btn-recite`);
    const btnCheck = document.getElementById(`${prefix}-btn-check-answers`);

    // Helper to switch modes cleanly
    function updateModeUI(activeBtn, mode) {
        [btnStudy, btnPractice, btnRecite].forEach(b => {
            if(b) {
                b.className = 'subtle-btn';
                b.style.fontWeight = 'normal';
            }
        });
        if(activeBtn) {
            activeBtn.className = 'active-mode';
            activeBtn.style.fontWeight = 'bold';
        }
        
        currentNotesMode[prefix] = mode;
        
        // Handle UI toggles
        if (mode === 'study') {
            if(btnCheck) btnCheck.style.display = 'none';
            document.getElementById(`${prefix}-recite-container`).style.display = 'none';
            document.getElementById(`${prefix}-bullet-list`).style.display = 'block';
        } else if (mode === 'practice') {
            if(btnCheck) btnCheck.style.display = 'inline-block';
            document.getElementById(`${prefix}-recite-container`).style.display = 'none';
            document.getElementById(`${prefix}-bullet-list`).style.display = 'block';
        } else if (mode === 'recite') {
            if(btnCheck) btnCheck.style.display = 'inline-block';
            document.getElementById(`${prefix}-bullet-list`).style.display = 'none';
            document.getElementById(`${prefix}-recite-container`).style.display = 'block';
            document.getElementById(`${prefix}-recite-box`).value = ''; // clear previous attempt
            document.getElementById(`${prefix}-recite-box`).disabled = false;
        }
        
        // Refresh the text
        const currentCategory = document.getElementById(`${prefix}-notes-title`).textContent;
        if (currentCategory && currentCategory !== "Select a Category" && currentCategory !== "Select a Topic") {
            loadBullets(currentCategory, prefix); 
        }
    }

    // Attach Listeners
    if(btnStudy) btnStudy.onclick = () => updateModeUI(btnStudy, 'study');
    if(btnPractice) btnPractice.onclick = () => updateModeUI(btnPractice, 'practice');
    if(btnRecite) btnRecite.onclick = () => updateModeUI(btnRecite, 'recite');

    // The Unified Grading Engine
    if(btnCheck) btnCheck.onclick = () => {
        if (currentNotesMode[prefix] === 'practice') {
            // 1. Grade the fill-in-the-blanks
            const blanks = document.querySelectorAll(`#${prefix}-bullet-list .practice-blank`);
            if (blanks.length === 0) return alert("Select a topic to practice first!");
            
            blanks.forEach(input => {
                if (input.disabled) return; // skip already graded items
                const correctAnswer = input.getAttribute('data-answer');
                const userAnswer = input.value.trim().toLowerCase();
                const expectedAnswer = correctAnswer.trim().toLowerCase();
                
                input.disabled = true; // lock input
                
                if (userAnswer === expectedAnswer) {
                    input.classList.add('correct');
                } else {
                    input.classList.add('incorrect');
                    const correctionSpan = document.createElement('span');
                    correctionSpan.className = 'correction-text highlight-term';
                    correctionSpan.textContent = ` (${correctAnswer})`;
                    input.parentNode.insertBefore(correctionSpan, input.nextSibling);
                }
            });
        } else if (currentNotesMode[prefix] === 'recite') {
            // 2. Grade the Brain Dump (Reveal answers below)
            document.getElementById(`${prefix}-recite-box`).disabled = true; // Lock their text
            currentNotesMode[prefix] = 'recite_review'; // Temp mode to reveal original text
            document.getElementById(`${prefix}-bullet-list`).style.display = 'block';
            
            const currentCategory = document.getElementById(`${prefix}-notes-title`).textContent;
            loadBullets(currentCategory, prefix); 
            
            btnCheck.style.display = 'none'; // hide check button once checked
        }
    };
});

// The Text Parser (With Randomizer)
function formatNotesText(rawText, prefix) {
    const mode = currentNotesMode[prefix];
    
    // In Study or Recite Review mode, simply show all highlights
    if (mode === 'study' || mode === 'recite' || mode === 'recite_review') {
        return rawText.replace(/\[\[(.*?)\]\]/g, '<span class="highlight-term">$1</span>');
    } else {
        // In Practice Mode, 60% chance it becomes a blank, 40% chance it is revealed text
        return rawText.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
            if (Math.random() < 1) {
                const width = Math.max(p1.length * 9, 40); 
                return `<input type="text" class="practice-blank" data-answer="${p1}" style="width: ${width}px;" autocomplete="off">`;
            } else {
                return `<span class="highlight-term">${p1}</span>`;
            }
        });
    }
}

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

// Global store for highlights so we don't fetch redundantly
let currentHighlights = { spain: {}, wotr: {} };

// Load notes into the viewer (distinguishing between headings and clickable bullets)
async function loadBullets(category, prefix) {
    document.getElementById(`${prefix}-notes-title`).textContent = category;
    const list = document.getElementById(`${prefix}-bullet-list`);
    list.innerHTML = '<li style="list-style:none;">Loading...</li>';
    
    // Hide the notes panel when a new category is selected
    document.getElementById(`${prefix}-notes-panel`).style.display = 'none';

    // NEW: Fetch saved highlights from Firebase before rendering
    if (currentUser) {
        try {
            const snap = await getDoc(doc(db, "users", currentUser.uid, "highlights", `${prefix}_${category}`));
            if (snap.exists()) {
                currentHighlights[prefix][category] = snap.data().indices || [];
            } else {
                currentHighlights[prefix][category] = [];
            }
        } catch (e) {
            console.error("Error loading highlights:", e);
            currentHighlights[prefix][category] = [];
        }
    } else {
        currentHighlights[prefix][category] = []; // Empty if not signed in
    }

    list.innerHTML = ''; // Clear loading message
    
    getBulletsForCategory(category).forEach((item, index) => {
        const li = document.createElement('li');
        
        // Wrap content in a span so the float button aligns properly
        const contentSpan = document.createElement('span');
        contentSpan.innerHTML = formatNotesText(item.text, prefix);
        
        if (item.type === 'heading') {
            li.style.fontWeight = 'bold';
            li.style.marginTop = '15px';
            li.style.listStyleType = 'none';
            li.style.marginLeft = '-20px'; 
            li.appendChild(contentSpan);
        } else {
            li.style.marginBottom = "8px";
            li.style.padding = "5px";
            li.style.position = "relative";
            li.appendChild(contentSpan);
            
            // NEW: Highlight Toggle Button
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'highlight-toggle-btn';
            toggleBtn.innerHTML = '🖍️';
            toggleBtn.title = "Highlight this point";
            
            // NEW: Remove from tab order so Practice Mode flows smoothly!
            toggleBtn.tabIndex = -1; 
            
            // Apply existing highlight on load
            if (currentHighlights[prefix][category].includes(index)) {
                li.classList.add('user-highlighted-bullet');
                toggleBtn.style.opacity = '1';
            }

            toggleBtn.onclick = async (e) => {
                e.stopPropagation(); // Stop the click from opening the side panel
                if (!currentUser) return alert("Please sign in to save highlights!");
                
                const hList = currentHighlights[prefix][category];
                
                // Toggle logic
                if (hList.includes(index)) {
                    hList.splice(hList.indexOf(index), 1);
                    li.classList.remove('user-highlighted-bullet');
                    toggleBtn.style.opacity = '0.3';
                } else {
                    hList.push(index);
                    li.classList.add('user-highlighted-bullet');
                    toggleBtn.style.opacity = '1';
                }
                
                // Auto-save silently to Firebase
                await setDoc(doc(db, "users", currentUser.uid, "highlights", `${prefix}_${category}`), { indices: hList });
            };
            li.appendChild(toggleBtn);
            
            // Interaction logic (opening side panel)
            if (currentNotesMode[prefix] === 'study' || currentNotesMode[prefix] === 'recite_review') {
                li.style.cursor = "pointer"; 
                li.onclick = () => loadNoteData(category, index, prefix);
            } else {
                li.style.cursor = "text"; 
            }
        }
        
        list.appendChild(li);
    });
}

// Save/Load Personal Notes & Usage Logic
let activeNote = { prefix: null, category: null, index: null };
async function loadNoteData(category, index, prefix) {
    activeNote = { prefix, category, index };
    
    // Show the panel now that a specific bullet point is selected
    document.getElementById(`${prefix}-notes-panel`).style.display = 'flex';
    
    const textarea = document.getElementById(`${prefix}-personal-notes`);
    const usedInList = document.getElementById(`${prefix}-used-in-list`);
    usedInList.innerHTML = '<li class="empty-msg">Loading...</li>';

    if (!currentUser) {
        textarea.value = "Sign in to view/save notes.";
        usedInList.innerHTML = '<li class="empty-msg">Sign in to see where this note is used.</li>';
        return;
    }

    // 1. Load Personal Note
    const snap = await getDoc(doc(db, "users", currentUser.uid, "notes", `${prefix}_${category}_${index}`));
    textarea.value = snap.exists() ? snap.data().text : "";

    // 2. Cross-reference with saved Essay Plans
    const rawText = getBulletsForCategory(category)[index].text;
    const plainText = rawText.replace(/<[^>]+>/g, ''); // Strip HTML to match the drag/drop format
    
    try {
        // Fetch all of the user's saved plans
        const plansSnap = await getDocs(collection(db, "users", currentUser.uid, "plans"));
        const usedIn = [];
        
        plansSnap.forEach(doc => {
            const data = doc.data();
            // Filter by subject (Spain = Paper 1, WOTR = Paper 2)
            const [year, paper, qNum] = doc.id.split('.');
            const expectedPaper = prefix === 'spain' ? '1' : '2';
            
            if (paper === expectedPaper && data.boxes) {
                // Check if the plain text of the note exists in any of the boxes
                const isUsed = data.boxes.some(box => box.text.includes(plainText));
                if (isUsed) {
                    usedIn.push(`${year} - Question ${qNum}`);
                }
            }
        });

        // Update the UI list
        usedInList.innerHTML = '';
        if (usedIn.length > 0) {
            // Sort chronologically (newest years first)
            usedIn.sort().reverse().forEach(q => {
                const li = document.createElement('li');
                li.textContent = q;
                usedInList.appendChild(li);
            });
        } else {
            usedInList.innerHTML = '<li class="empty-msg">Not used in any plans yet.</li>';
        }
    } catch (error) {
        console.error("Error fetching plans:", error);
        usedInList.innerHTML = '<li class="empty-msg">Error loading usage data.</li>';
    }
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
    btn.id = `btn-${prefix}-${year}-${paper}-${qNum}`; // NEW: Give the button a unique ID
    const typeLabel = type === 'Essay' ? '' : ` (${type})`;
    btn.textContent = `${year} - Q${qNum}${typeLabel}`;
    btn.onclick = () => loadQuestionViewer(year, paper, qNum, type, prefix);
    return btn;
}

generateQuestionButtons();

async function loadQuestionViewer(year, paper, qNum, type, prefix) {
    // NEW: Save the previous question's data silently BEFORE we wipe the screen
    if (currentQ[prefix] && currentUser) {
        await saveFreeText(prefix, true);
        await savePlan(prefix, true);
    }

    currentQ[prefix] = `${year}.${paper}.${qNum}`;
    document.getElementById(`${prefix}-question-title`).textContent = `${year} Question ${qNum} (${type})`;
    
    const imgViewer = document.getElementById(`${prefix}-question-img`);
    const textViewer = document.getElementById(`${prefix}-question-text`);
    const pdfViewer = document.getElementById(`${prefix}-pdf-viewer`);

    // 1. Hide image and PDF viewers, show text viewer by default
    imgViewer.style.display = 'none'; 
    pdfViewer.style.display = 'none';
    pdfViewer.src = ""; // Clear old PDF to prevent ghost loading
    textViewer.style.display = 'block'; 
    textViewer.textContent = "Loading...";
    
    // Fetch the .txt file regardless of question type
    try { 
        textViewer.innerText = await (await fetch(`past_questions/${year}.${paper}.${qNum}.txt`)).text(); 
    } catch (e) { 
        textViewer.innerText = `Error: Missing file past_questions/${year}.${paper}.${qNum}.txt`; 
    }

    // 2. Reset the UI for the newly selected question
    const checkbox = document.getElementById(`${prefix}-mark-complete`);
    checkbox.checked = false; 
    document.getElementById(`${prefix}-rich-text`).innerHTML = "";
    document.getElementById(`${prefix}-struct-intro`).innerHTML = ""; // Changed to innerHTML
    document.getElementById(`${prefix}-struct-conc`).innerHTML = ""; // Changed to innerHTML
    document.getElementById(`${prefix}-struct-boxes`).innerHTML = "";

    // 3. Hide the "Plan" button for Extracts and Sources, and force "Write" view
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

    // 4. Fetch User Data from Firebase
    if (currentUser) {
        // Load Checkbox
        const compSnap = await getDoc(doc(db, "users", currentUser.uid, "completed", currentQ[prefix]));
        if (compSnap.exists()) checkbox.checked = compSnap.data().done;

        // Load Free Text
        const freeSnap = await getDoc(doc(db, "users", currentUser.uid, "free_text", currentQ[prefix]));
        if (freeSnap.exists()) {
            document.getElementById(`${prefix}-rich-text`).innerHTML = freeSnap.data().html;
        }

        // Load Structured Plan
        const planSnap = await getDoc(doc(db, "users", currentUser.uid, "plans", currentQ[prefix]));
        if (planSnap.exists()) {
            const data = planSnap.data();
            document.getElementById(`${prefix}-struct-intro`).innerHTML = data.intro || ""; // Changed to innerHTML
            document.getElementById(`${prefix}-struct-conc`).innerHTML = data.conclusion || ""; // Changed to innerHTML
            
            // Rebuild the dynamic boxes from the saved array
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
// Mark Complete Listeners
['spain', 'wotr'].forEach(prefix => {
    document.getElementById(`${prefix}-mark-complete`).addEventListener('change', async (e) => {
        if (!currentUser || !currentQ[prefix]) {
            e.target.checked = !e.target.checked; 
            return alert("Please sign in and select a question first.");
        }
        await setDoc(doc(db, "users", currentUser.uid, "completed", currentQ[prefix]), { done: e.target.checked });
        
        // NEW: Toggle the green class on the sidebar button in real-time
        const [year, paper, qNum] = currentQ[prefix].split('.');
        const sidebarBtn = document.getElementById(`btn-${prefix}-${year}-${paper}-${qNum}`);
        if (e.target.checked) {
            sidebarBtn.classList.add('completed-btn');
        } else {
            sidebarBtn.classList.remove('completed-btn');
        }
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
            
            // NEW: Render the brackets as highlighted text in the picker menu
            b.innerHTML = item.text.replace(/\[\[(.*?)\]\]/g, '<span class="highlight-term">$1</span>'); 
            
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
                    // NEW: Strip out the HTML <b> tags AND the [[ ]] brackets so plain text is dropped into the plan
                    const plainText = item.text.replace(/<[^>]+>/g, '').replace(/\[\[|\]\]/g, '');
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
    header.querySelector('.remove-box').onclick = () => {
        boxWrapper.remove();
        triggerAutoSave(prefix, 'plan'); 
    };
    
    const editor = document.createElement('div');
    editor.className = 'rich-textarea';
    editor.contentEditable = "true";
    editor.setAttribute('placeholder', `Write your ${type} point here, or drop notes...`);
    editor.innerHTML = initialText;

    editor.addEventListener('input', () => triggerAutoSave(prefix, 'plan'));

    editor.addEventListener('dragover', e => { e.preventDefault(); editor.classList.add('drag-over'); });
    editor.addEventListener('dragleave', () => editor.classList.remove('drag-over'));
    editor.addEventListener('drop', e => {
        e.preventDefault();
        editor.classList.remove('drag-over');
        const text = e.dataTransfer.getData('text/plain');
        
        // Attempt to set the text cursor exactly where the user dropped the note
        if (document.caretRangeFromPoint) {
            const range = document.caretRangeFromPoint(e.clientX, e.clientY);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        
        // Insert the text as a bullet point safely into the HTML
        document.execCommand('insertText', false, `- ${text}\n`);
        triggerAutoSave(prefix, 'plan'); 
    });

    boxWrapper.appendChild(header);
    boxWrapper.appendChild(editor);
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

// Auto-save timer tracking
let timeoutIds = {};
function triggerAutoSave(prefix, type) {
    const key = `${prefix}-${type}`;
    clearTimeout(timeoutIds[key]);
    timeoutIds[key] = setTimeout(() => {
        if (type === 'free') saveFreeText(prefix, true);
        if (type === 'plan') savePlan(prefix, true);
    }, 1500); // Waits 1.5 seconds after you stop typing to save
}

async function saveFreeText(prefix, isSilent = false) {
    if (!currentUser || !currentQ[prefix]) {
        if (!isSilent) alert("Sign in and select a question first.");
        return;
    }
    const content = document.getElementById(`${prefix}-rich-text`).innerHTML;
    await setDoc(doc(db, "users", currentUser.uid, "free_text", currentQ[prefix]), { html: content });
    if (!isSilent) alert("Writing saved!");
}

async function savePlan(prefix, isSilent = false) {
    if (!currentUser || !currentQ[prefix]) {
        if (!isSilent) alert("Sign in and select a question first.");
        return;
    }
    const intro = document.getElementById(`${prefix}-struct-intro`).innerHTML; // Changed to innerHTML
    const conc = document.getElementById(`${prefix}-struct-conc`).innerHTML; // Changed to innerHTML
    const boxes = [];
    document.querySelectorAll(`#${prefix}-struct-boxes .plan-box-container`).forEach(box => {
        const type = box.classList.contains('agree') ? 'agree' : 'disagree';
        const text = box.querySelector('.rich-textarea').innerHTML; // Changed selector and innerHTML
        boxes.push({ type, text });
    });

    await setDoc(doc(db, "users", currentUser.uid, "plans", currentQ[prefix]), { 
        intro: intro, boxes: boxes, conclusion: conc
    });
    if (!isSilent) alert("Plan saved!");
}

['spain', 'wotr'].forEach(prefix => {
    // NEW: PDF and Text Viewer Toggles
    document.getElementById(`${prefix}-btn-text`).onclick = () => {
        document.getElementById(`${prefix}-pdf-viewer`).style.display = 'none';
        document.getElementById(`${prefix}-question-text`).style.display = 'block';
    };
    
    document.getElementById(`${prefix}-btn-paper`).onclick = () => {
        if (!currentQ[prefix]) return alert("Select a question first.");
        const [year, paper] = currentQ[prefix].split('.');
        const iframe = document.getElementById(`${prefix}-pdf-viewer`);
        iframe.src = `past_papers/${year}.${paper}.pdf`;
        document.getElementById(`${prefix}-question-text`).style.display = 'none';
        iframe.style.display = 'block';
    };
    
    document.getElementById(`${prefix}-btn-ms`).onclick = () => {
        if (!currentQ[prefix]) return alert("Select a question first.");
        const [year, paper] = currentQ[prefix].split('.');
        const iframe = document.getElementById(`${prefix}-pdf-viewer`);
        iframe.src = `mark_schemes/${year}.${paper}.pdf`;
        document.getElementById(`${prefix}-question-text`).style.display = 'none';
        iframe.style.display = 'block';
    };

    // Manual Save Buttons
    document.getElementById(`save-${prefix}-free`).onclick = () => saveFreeText(prefix);
    document.getElementById(`save-${prefix}-struct`).onclick = () => savePlan(prefix);

    // Real-Time Auto-Save Listeners for the static editors
    document.getElementById(`${prefix}-rich-text`).addEventListener('input', () => triggerAutoSave(prefix, 'free'));
    document.getElementById(`${prefix}-struct-intro`).addEventListener('input', () => triggerAutoSave(prefix, 'plan'));
    document.getElementById(`${prefix}-struct-conc`).addEventListener('input', () => triggerAutoSave(prefix, 'plan'));
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